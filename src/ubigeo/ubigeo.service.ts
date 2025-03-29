import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUbigeoDto } from './dto/create-ubigeo.dto';
import { UpdateUbigeoDto } from './dto/update-ubigeo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ubigeo } from './entities/ubigeo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UbigeoService {
  private readonly logger = new Logger('UbigeoService');
  constructor(
    @InjectRepository(Ubigeo)
    private readonly ubigeoRepository: Repository<Ubigeo>,
  ) {}


  // Obtener todos los departamentos
  async getAllDepartamentos() {
    try {
      return this.ubigeoRepository
        .createQueryBuilder('ubigeo')
        .select('DISTINCT ubigeo.departamento')  // Aseguramos que solo seleccionamos 'departamento' único
        .getRawMany();  // Utilizamos getRawMany para evitar problemas con el 'GROUP BY'
    } catch (e) {
      this.handleExceptions(e);
    }

  }

  // Obtener provincias por departamento
  async getProvinciasByDepartamento(departamento: string) {

    try {
      return this.ubigeoRepository
        .createQueryBuilder('ubigeo')
        .select('DISTINCT ubigeo.provincia')
        .where('ubigeo.departamento = :departamento', { departamento: departamento.toUpperCase() })
        .getRawMany();
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  // Obtener distritos por provincia
  async getDistritosByProvincia(provincia: string) {

    try {
      return this.ubigeoRepository
        .createQueryBuilder('ubigeo')
        .select('DISTINCT ubigeo.distrito, ubigeo.ubigeo_inei')
        .where('ubigeo.provincia = :provincia', { provincia: provincia.toUpperCase() })
        .getRawMany();
    }catch (e) {
      this.handleExceptions(e);
    }
  }

  // Obtener distritos por departamento
  async getDistritosByDepartment(distrito: string) {

    try {
      return this.ubigeoRepository
        .createQueryBuilder('ubigeo')
        .select('DISTINCT ubigeo.distrito')
        .where('ubigeo.provincia = :departamento', { distrito });
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpectes erro, check server logs',
    );
  }
}
