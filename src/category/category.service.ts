import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('CategoryService');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRespository: Repository<Category>,

    private readonly dataSource: DataSource,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {

    try {
      const date = new Date();
      const { name, svg } = createCategoryDto;
      const category = this.categoryRespository.create({
        name: name,
        createAt: date,
        svg: svg,
      });
      await this.categoryRespository.save(category);
      return { success: true, message: 'create category', data: category };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async findAll() {
    try {
      const category = await this.categoryRespository.find();
      return {
        success: true,
        data: category
      };
    } catch (e) {
      this.handleExceptions(e);
    }

  }
  async getCategoryLimit() {
    try {
      const data = await this.categoryRespository.query(
            `select * from category as c
                   where c."isActive" = true
                   order by c."createAt" asc
                   limit 7;`,
      );

      return { success: true, message: 'ok', data };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async findOne(term: string) {
    let category: Category;
    if (isUUID(term)) {
      category = await this.categoryRespository.findOneBy({ id: term });
    }
    if (!category) {
      throw new NotFoundException(
        `Category with id, name or no "${term}" not found`,
      );
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { ...request } = updateCategoryDto;

    const category = await this.categoryRespository.preload({
      id: id,
      ...request
    });
    if (!category)
      throw new NotFoundException(`Category with id: "${id}" not found`);

    // CREATE QUERY RUNNER
    const queryRunner = this.dataSource.createQueryRunner();
    //conectar a la bd queryrunner
    await queryRunner.connect();
    //inicar la transccion
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.save(category);
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

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
  async findOnePlain(ter: string) {
    const { ...res } = await this.findOne(ter);
    return {
      success: true,
      message: 'operacion exitosa',
      data: res,
    };
  }
  private handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpectes erro, check server logs',
    );
  }
}
