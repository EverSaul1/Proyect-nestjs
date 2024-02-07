import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from '../history/entities/history.entity';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../auth/entities/user.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger('CommentsService');
  constructor(
    @InjectRepository(Comment)
    private readonly commentRespository: Repository<Comment>,

    @InjectRepository(History)
    private readonly historyRespository: Repository<History>,

    private readonly dataSource: DataSource,
  ) {
  }
  async create(createCommentDto: CreateCommentDto, user) {
    const { history, ...data } = createCommentDto;
    const idHistory = await this.historyRespository.findOneBy({ id: history });
    if(!idHistory) {
      throw new NotFoundException('Historia no encontrada');
    }
    try {
        const history = this.commentRespository.create({
          ...data,
          user: user.id,
          history: idHistory,
        });
        await this.commentRespository.save(history);
        return { success: true, message: 'comentario creado'};
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async createSinAutenticar(createCommentDto: CreateCommentDto) {
    const { history, ...data } = createCommentDto;
    const idHistory = await this.historyRespository.findOneBy({ id: history });
    if(!idHistory) {
      throw new NotFoundException('Historia no encontrada');
    }
    try {
      const history = this.commentRespository.create({
        ...data,
        history: idHistory,
      });
      await this.commentRespository.save(history);
      return { success: true, message: 'comentario creado'};
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async findAllByID(id: string) {

    const idHistory = await this.historyRespository.findOneBy({id: id})
    if(!idHistory) {
      throw new NotFoundException('Historia no encontrada');
    }
    try {
      const query = `
        SELECT a.*, u."fullName" as name, u.avatar as img FROM comemtarios AS a
        left join users u on a."userId" = u.id
        WHERE a."historyId" = $1
        ORDER BY a.fecha desc
      `;

      const comentarios = await this.commentRespository.query(query, [id]);
      return {
        success: true,
        data: comentarios,
      };
    } catch (e) {
      this.handleExceptions(e);
    }
  }
  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const { ...toUpdate } = updateCommentDto;

    const comment = await this.commentRespository.preload({
      id: id,
      ...toUpdate,
    });
    if (!comment)
      throw new NotFoundException(`Comentario with id: "${id}" not found`);

    // CREATE QUERY RUNNER
    const queryRunner = this.dataSource.createQueryRunner();
    //conectar a la bd queryrunner
    await queryRunner.connect();
    //inicar la transccion
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(comment);
      /*await this.productRespository.save(product)*/
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(e);
    }
  }
  async findOnePlain(ter: string) {
    const { ...res } = await this.findOne(ter);
    return {
      success: true,
      message: 'Update',
    };
  }
  async findOne(term: string) {
    let coment: Comment;
    if (isUUID(term)) {
      coment = await this.commentRespository.findOneBy({ id: term });
    }
    if (!coment) {
      throw new NotFoundException(
        `User with id, name or no "${term}" not found`,
      );
    }
    return coment;
  }

  async remove(id: string) {
    const productID = await this.commentRespository.delete({ id });
    if (productID.affected === 0) {
      throw new BadRequestException(`comentario with id "${id}" not found`);
    }
    return { success: true, message: 'Comentario eliminado' };
  }
  private handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpectes erro, check server logs',
    );
  }

}
