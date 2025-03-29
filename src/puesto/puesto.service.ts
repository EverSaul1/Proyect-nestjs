import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePuestoDto } from './dto/create-puesto.dto';
import { UpdatePuestoDto } from './dto/update-puesto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ubigeo } from '../ubigeo/entities/ubigeo.entity';
import { Repository } from 'typeorm';
import { Puesto } from './entities/puesto.entity';
import e from 'express';
import { Persona } from '../persona/entities/persona.entity';

@Injectable()
export class PuestoService {
  private readonly logger = new Logger('PuestoService');
  constructor(@InjectRepository(Puesto)
              private readonly puestoRepository: Repository<Puesto>,
              @InjectRepository(Persona)
              private readonly personaRepository: Repository<Persona>,) {
  }
  async getAllSector() {

    try {
      return this.puestoRepository
        .createQueryBuilder('puesto')
        .select('DISTINCT puesto.sector')
        .getRawMany();
    } catch (e) {
      this.handleExceptions(e);
    }


  }

  async getPabellonBySector(sector: string) {
    try {
      return this.puestoRepository
        .createQueryBuilder('puesto')
        .select('DISTINCT puesto.pabellon')
        .where('puesto.sector = :sector', { sector: sector.toUpperCase() })
        .getRawMany();
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async getPuestoByPabellon(pabellon: string, sector: string) {
    try {
      return this.puestoRepository
        .createQueryBuilder('puesto')
        .select('*')
        .where('puesto.pabellon = :pabellon AND puesto.sector = :sector', { pabellon: pabellon.toUpperCase(), sector: sector.toUpperCase() })
        .getRawMany();
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async asignarAsociado(puestoId: string, asociadoDto: any) {

    try {
      const { asociadoId, tipo } = asociadoDto;

      // Buscamos el puesto por ID
      const puesto = await this.puestoRepository.findOne({
        where: { id: puestoId },
      });
      if (!puesto) {
        throw new Error(`Puesto con ID ${puestoId} no encontrado.`);
      }

      // Buscamos a la persona (asociado) por su ID
      const asociado = await this.personaRepository.findOne({
        where: { id: asociadoId },
      });
      if (!asociado) {
        throw new Error(`Persona con ID ${asociadoId} no encontrada.`);
      }

      // Asignamos el asociado al puesto
      puesto.asociado = asociado;

      // Guardamos el puesto actualizado
      await this.puestoRepository.save(puesto);

      return {
        message: `El asociado con ID ${asociadoId} ha sido asignado al puesto ${puestoId}.`,
        puesto,
      };
    } catch (e) {
      this.handleExceptions(e)
    }

  }

  async removeAsociadoFromPuesto(puestoId: string) {
    try {
      // 1. Buscar el puesto
      const puesto = await this.puestoRepository.findOne({ where: { id: puestoId } });
      console.log(puesto);
      if (!puesto) {
        throw new Error('Puesto no encontrado');
      }

      // 3. Eliminar el asociado en el puesto (poner asociado_id como null)
      puesto.asociado = null;

      // 5. Guardar los cambios en el puesto y la persona
      await this.puestoRepository.save(puesto);
      return {
        message: 'Asociado eliminado del puesto y persona correctamente',
        puesto,
      };
    } catch (e) {
      this.handleExceptions(e)
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
