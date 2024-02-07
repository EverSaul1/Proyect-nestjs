import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { Category } from '../category/entities/category.entity';
import { Favorities } from './entities/history-favorities.entity';
import { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { User } from '../auth/entities/user.entity';
import { isUUID } from 'class-validator';
import { Read } from './entities/history-read.entity';
import { Visto } from './entities/history-visto.entity';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger('HistoryService');

  constructor(
    @InjectRepository(History)
    private readonly historyRespository: Repository<History>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Favorities)
    private readonly favoritiesRepository: Repository<Favorities>,

    @InjectRepository(Read)
    private readonly readsRepository: Repository<Read>,

    @InjectRepository(Visto)
    private readonly vistosRepository: Repository<Visto>,

    @InjectRepository(User)
    private readonly usuariosRepository: Repository<User>,


    private readonly dataSource: DataSource,
  ) {}
  async create(createHistoryDto: CreateHistoryDto, user, file: Express.Multer.File) {

    console.log(file)
   /* puedes crear de esta manera (solo esas opciones para validar desde el front) el campo type: VIDEO, AUDIO, TEXT*/
    let avatarResponse;
    const { category, imagen, ...res } = createHistoryDto;
    const idcategory = await this.categoryRepository.findOneBy({ id: category });

    if (!idcategory) {
      // Maneja el caso en que no se encuentre la categoría
      throw new NotFoundException('Categoría no encontrada');
    }
    //validamos si existe la historia con el mismo nombre
    const idHistory = await this.historyRespository.findOneBy({ name: res.name });
    if (file && !idHistory) {
      avatarResponse = await this.uploadImg(file, 'history');
    }
    try {
      const date = new Date();
      const history = this.historyRespository.create({
        category: idcategory,
        imagen: `${avatarResponse?.public_id}.${avatarResponse?.format}` || '',
        ...res,
        createAt: date,
        user,
      });
      await this.historyRespository.save(history);
      return { success: true, message: 'create category', data: history };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  findAll() {
    return `This action returns all history`;
  }
  async getHistoryByCategory(req) {
    //traer historia por usuario y saber cuales marco
    const userId = req.userId;
    const categoryId = req.categoryId;
    const usuarioType = req.usuarioType;

    if (usuarioType === 'S'){
        this.validateRequest(userId, 'usuarioId');
        this.validateRequest(categoryId, 'categoryId')
    }
    if (usuarioType === 'N') {
      this.validateRequest(categoryId, 'categoryId');
    }
    const validateUserId = await this.usuariosRepository.findOneBy({
      id: userId,
    });
    this.validatefindOneByIDorOther(validateUserId, 'Usuario');

    const validatecategoryId = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    this.validatefindOneByIDorOther(validatecategoryId, 'Categoria');

    try {
      let data;
      if (usuarioType === 'S') {
        data = await this.historyRespository.query(
          `SELECT
      h.id,
      h.name,
      h."isActive",
      h.description,
      h."userId",
      h."categoryId",
      h."createAt",
      h.imagen,
      h.type,
      f.id as favorities_id,
        CASE WHEN f."userId" IS NOT NULL THEN true ELSE false END AS favorito,
        r.id as read_id,
        CASE WHEN r."userId" IS NOT NULL THEN true ELSE false END AS leido,
        count(DISTINCT c.id) as total_comentarios,
        count(DISTINCT v.id) as total_visto
      FROM history h
      LEFT JOIN favorites f ON h.id = f."historyId" AND f."userId" = $1
      LEFT JOIN read r on h.id = r."historyId" AND r."userId" = $1

      LEFT JOIN comemtarios c on h.id = c."historyId"
      LEFT JOIN visto v on h.id = v."historyId"
      WHERE h."categoryId" = $2
      GROUP BY h.id, f.id, r.id
      ORDER BY h."createAt" DESC
      `,
          [userId, categoryId],
        );
      }
      if (usuarioType === 'N') {
        data = await this.historyRespository.query(
          `SELECT h.*, 
                        count(DISTINCT c.id) as total_comentarios,
                        count(DISTINCT v.id) as total_visto 
                    FROM history as h 
                    LEFT JOIN comemtarios c on h.id = c."historyId"
                    LEFT JOIN visto v on h.id = v."historyId"
                    WHERE h."categoryId" =  $1
                    GROUP BY h.id
                    ORDER BY h."createAt" DESC`,
          [categoryId],
        );
      }
      return { success: true, message: 'ok', data };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async getHistoryOne(req) {
    //traer historia por usuario y saber cuales marco
    const userId = req.userId;
    const historyId = req.historyId;
    const usuarioType = req.usuarioType;

    if (usuarioType === 'S'){
      this.validateRequest(userId, 'usuarioId');
      this.validateRequest(historyId, 'historyId');
    }
    if (usuarioType === 'N') {
      this.validateRequest(historyId, 'historyId');
    }
    const validateUserId = await this.usuariosRepository.findOneBy({
      id: userId,
    });
    this.validatefindOneByIDorOther(validateUserId, 'Usuario');

    const validatecategoryId = await this.historyRespository.findOneBy({
      id: historyId,
    });
    this.validatefindOneByIDorOther(validatecategoryId, 'Categoria');

    try {
      let historyData;
      if( usuarioType === 'S'){
        const query = `
        SELECT
          h.id,
          h.text_history,
          h.name,
          f.id as favorities_id,
          h.imagen,
          h.type,
          h.url,
          CASE WHEN f."userId" IS NOT NULL THEN true ELSE false END AS favorito,
          r.id as read_id,
            CASE WHEN r."userId" IS NOT NULL THEN true ELSE false END AS leido,
          cast(COUNT(DISTINCT c.id)as INTEGER) AS total_comentarios,
          cast(COUNT(DISTINCT v.id) as INTEGER) AS total_visto
        FROM
          history h
        LEFT JOIN favorites f ON h.id = f."historyId" AND f."userId" = $1
        LEFT JOIN read r on h.id = r."historyId" AND r."userId" = $1
        LEFT JOIN comemtarios c ON h.id = c."historyId"
        LEFT JOIN visto v on h.id = v."historyId"
        where h.id = $2
        GROUP BY
          h.id, f.id, r.id;
      `;

        historyData = await this.historyRespository.query(query, [ userId, historyId ]);
      } else {
        const query = `
        select
              h.id,
                h.text_history,
                h.name,
                h.imagen,
                h.type,
                h.url,
                h.description,
                cast(COUNT(DISTINCT c.id) as INTEGER) AS total_comentarios,
                cast(COUNT(DISTINCT v.id) as INTEGER) AS total_visto
              from history as h
                  LEFT JOIN comemtarios c ON h.id = c."historyId"
                  LEFT JOIN visto v on h.id = v."historyId"
                  where h.id = $1
          GROUP BY
            h.id;
      `;

        historyData = await this.historyRespository.query(query, [ historyId ]);
      }
      return { success: true, message: 'ok', data: historyData[0] };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async getHistoryLimitPanelGrande() {
    //traer historia por usuario y saber cuales marco
    try {
      const query = `
          select
              h.id,
              h.imagen,
              h.name,
              h.type,
              count(DISTINCT v.id) as total_visto 
              from history as h              
              LEFT JOIN visto v on h.id = v."historyId"
                   where h."isActive" = true
                   AND v."createAt" >= DATE_TRUNC('month', CURRENT_DATE)
                   group by h.id order by total_visto desc limit 6`;
      const historyData = await this.historyRespository.query(query);

      return { success: true, message: 'ok', data: historyData };
    } catch (e) {
      this.handleExceptions(e);
    }
  }
  async getHistoryLimit() {
    //traer historia por usuario y saber cuales marco
    try {
      const query = `
          select
          h.id,
          h.description,
          h.name,
          h."createAt",
          h.imagen,
          h.type,
          COUNT(DISTINCT c.id) AS total_comentarios,
          count(DISTINCT v.id) as total_visto 
          from history as h
          left join comemtarios c on h.id = c."historyId"
          LEFT JOIN visto v on h.id = v."historyId"
         where h."isActive" = true
          group by h.id
         order by "createAt" desc
         limit 7;`;
      const historyData = await this.historyRespository.query(query);

      return { success: true, message: 'ok', data: historyData };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async getSearchHistory(req){
    const userId = req.userId;
    const usuarioType = req.usuarioType;
    const termino = req.search;

      this.validateRequest(usuarioType, 'usuarioType');


    if (usuarioType === 'S'){
      this.validateRequest(userId, 'userId');
    }
    const validateUserId = await this.usuariosRepository.findOneBy({
      id: userId,
    });
    this.validatefindOneByIDorOther(validateUserId, 'Usuario');
    try {
      let historyData;
      if (usuarioType === 'S') {
        const query = `
       SELECT DISTINCT
              h.id,
              h.name,
              h."isActive",
              h.description,
              h."userId",
              h."categoryId",
              h."createAt",
              h.imagen,
              h.type,
              f.id as favorities_id,
              CASE WHEN f."userId" IS NOT NULL THEN true ELSE false END AS favorito,
              count(DISTINCT c.id) as total_comentarios,
              count(DISTINCT v.id) as total_visto 
          FROM history h
          LEFT JOIN favorites f ON h.id = f."historyId" AND f."userId" = $1
          LEFT JOIN comemtarios c on h.id = c."historyId"
          LEFT JOIN visto v on h.id = v."historyId"
          WHERE h.name ilike $2
          GROUP BY h.id, f.id
          ORDER BY total_comentarios desc`;

        historyData = await this.historyRespository.query(query, [ userId, `%${termino}%` ]);
      } else {
        const query = `
        SELECT h.id,
              h.name,
              h."isActive",
              h.description,
              h."userId",
              h."categoryId",
              h."createAt",
              h.imagen, 
              h.type,
              count(DISTINCT c.id) as total_comentarios,
              count(DISTINCT v.id) as total_visto 
                    FROM history as h
                    LEFT JOIN comemtarios c on h.id = c."historyId"
                    LEFT JOIN visto v on h.id = v."historyId"
                    WHERE h.name ilike $1
                    GROUP BY h.id
                    ORDER BY total_comentarios desc`;

        historyData = await this.historyRespository.query(query, [`%${termino}%`]);
      }
      return { success: true, message: 'ok', data: historyData };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async postFavorites(req: any, user) {
    const historyId = req.history;

    this.validateRequest(historyId, 'historyId');
    const validateHistoriID = await this.historyRespository.findOneBy({
      id: historyId,
    });
    this.validatefindOneByIDorOther(validateHistoriID, 'Historia');
    try {
      const query = this.favoritiesRepository.create({
        history: historyId,
        user: user.id,
      });
      await this.favoritiesRepository.save(query);
      return { success: true, message: 'add favorite' };
    } catch (e) {
      this.handleExceptions(e);
    }

  }
  async deleteFavorities(id: number) {
    const productID = await this.favoritiesRepository.delete({ id });
    if (productID.affected === 0) {
      throw new BadRequestException(`favoritos with id "${id}" not found`);
    }
    return { success: true, message: 'delete favorite' };
  }
  async getFavorities(user) {
    try {
      const query = await this.favoritiesRepository.query(
        `
          select DISTINCT h.*,
                            a.id as favorities_id,
                            r.id as read_id,
                          CASE WHEN a."userId" IS NOT NULL THEN true ELSE false END AS favorito,
                          CASE WHEN r."userId" IS NOT NULL THEN true ELSE false END AS leido,
                          count(DISTINCT c.id) as total_comentarios,
                          count( DISTINCT  v.id) as total_visto
          from favorites a
                      inner join history h on a."historyId" = h.id
                      LEFT JOIN read r on h.id = r."historyId" AND r."userId" = $1
                      LEFT JOIN comemtarios c on h.id = c."historyId"
                      LEFT JOIN visto v on h.id = v."historyId"
                   where a."userId" = $1 and h."isActive" = true
          group by h.id, r.id, a.id
          order by h."createAt" desc    
      `,
        [user.id],
      );
      return { success: true, message: 'ok', data: query };
    } catch (e) {
      this.handleExceptions(e);
    }

  }

  async getHistoryRecomendados(request) {

    const idHistory = request.idHistory
    try {
      const query = `
          select h.id,
                 h.name, 
                 h.imagen 
                  from history h where h.id != $1
                  and h."categoryId" = (select c."categoryId" from history c where c.id = $1 )
                  and h."isActive" = true
                  order by random()
                  limit 5;`;
      const historyData = await this.historyRespository.query(query, [
        idHistory,
      ]);

      return { success: true, message: 'ok', data: historyData };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async postVisto(req) {
    const historyId = req.history;
    console.log(req, 'history')
    this.validateRequest(historyId, 'history');
    const validateHistoriID = await this.historyRespository.findOneBy({
      id: historyId,
    });
    this.validatefindOneByIDorOther(validateHistoriID, 'Historia');
    try {
      const date = new Date();
      const query = this.vistosRepository.create({
        history: historyId,
        createAt: date,
      });
      await this.vistosRepository.save(query);
      return { success: true, message: 'add visto' };
    } catch (e) {
      this.handleExceptions(e);
    }
  }
  async postRead(req: any, user) {
    const historyId = req.history;

    this.validateRequest(historyId, 'historyId');
    const validateHistoriID = await this.historyRespository.findOneBy({
      id: historyId,
    });
    this.validatefindOneByIDorOther(validateHistoriID, 'Historia');
    try {
      const query = this.readsRepository.create({
        history: historyId,
        user: user.id,
      });
      await this.readsRepository.save(query);
      return { success: true, message: 'add leido' };
    } catch (e) {
      this.handleExceptions(e);
    }

  }
  async deleteRead(id: number) {
    const productID = await this.readsRepository.delete({ id });
    if (productID.affected === 0) {
      throw new BadRequestException(`read with id "${id}" not found`);
    }
    return { success: true, message: 'delete leido' };
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpectes erro, check server logs',
    );
  }
  private async uploadImg(img: Express.Multer.File, name: string) {
    if (img.size > 3145728){
      throw new NotFoundException(
        'La imagen excede el tamaño máximo permitido (3MB)',
      );
    }
    if(!img.originalname.match(/\.(jpg|jpeg|png|gif)$/) ){
      throw new NotFoundException('Solo se permiten imágenes');
    }
    try {
      //https://res.cloudinary.com/dzepvqbgz/image/upload/v1692657127/
      const result = await cloudinary.uploader.upload(img.path, {folder: name});
      console.log(result)
      return {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format
      };
    } catch (e) {
      this.handleExceptions(e);
      throw new NotFoundException('Error al subir la imagen a Cloudinary');
    }
  }

  validateRequest(item: any, msj: string) {
    if(!item) {
      throw new NotFoundException(`Falta el parametro ${msj}`);
    }
  }
  validatefindOneByIDorOther(item: any, msj: string) {
    if (!item) {
      throw new NotFoundException(`${msj} no encontrada`);
    }
  }

}
