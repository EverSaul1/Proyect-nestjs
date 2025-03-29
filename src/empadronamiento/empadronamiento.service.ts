import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateEmpadronamientoDto } from './dto/create-empadronamiento.dto';
import { UpdateEmpadronamientoDto } from './dto/update-empadronamiento.dto';
import { Empadronamiento } from './entities/empadronamiento.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from '../persona/entities/persona.entity';
import { Puesto } from '../puesto/entities/puesto.entity';

@Injectable()
export class EmpadronamientoService {
  private readonly logger = new Logger('EmpadronamientoService');
  constructor(
    @InjectRepository(Empadronamiento)
    private readonly empadronamientoRepository: Repository<Empadronamiento>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Puesto)
    private readonly puestoRepository: Repository<Puesto>,
  ) {}

  async verificarPuestoEmpadronado(nroEmpadronamiento: string) {
    try {
      // Buscamos en la tabla empadronamiento si ya existe un registro empadronado para ese nro_empadronamiento
      const puestoEmpadronado = await this.empadronamientoRepository
        .createQueryBuilder('empadronamiento')
        .leftJoinAndSelect('empadronamiento.puesto', 'puesto')
        .where(
          'empadronamiento.puesto.nro_empadronamiento = :nroEmpadronamiento',
          { nroEmpadronamiento },
        )
        .andWhere('empadronamiento.estado = :estado', { estado: 'empadronado' })
        .getOne();

      if (puestoEmpadronado) {
        return { message: `El puesto con número de empadronamiento ${nroEmpadronamiento} ya está empadronado.` };
      } else {
        return { message: `El puesto con número de empadronamiento ${nroEmpadronamiento} no está empadronado.` };
      }
    } catch (e) {
      console.error(e);
      throw new Error('Error al verificar el empadronamiento del puesto.');
    }
  }

  async verificarPersonaEmpadronada(dni: string) {
    try {
      // Buscamos si existe un empadronamiento de la persona en el año 2025 con estado 'empadronado'
      const personaEmpadronada = await this.empadronamientoRepository
        .createQueryBuilder('empadronamiento')
        .leftJoinAndSelect('empadronamiento.puesto', 'puesto')
        .leftJoinAndSelect('empadronamiento.persona', 'persona')
        .where('persona.dni = :dni', { dni })
        .andWhere('empadronamiento.anio = :anio', { anio: 2025 })
        .andWhere('empadronamiento.estado = :estado', { estado: 'empadronado' })
        .getOne();

      if (personaEmpadronada) {
        return { message: `La persona con DNI ${dni} ya está empadronada en el año 2025.` };
      } else {
        return { message: `La persona con DNI ${dni} no está empadronada en el año 2025.` };
      }
    } catch (e) {
      console.error(e);
      throw new Error('Error al verificar el empadronamiento de la persona.');
    }
  }

  async empadronarPersona(
    dni: string,
    nroEmpadronamiento: string,
    anio: number,
  ) {
    // 1. Buscar a la persona por DNI
    const persona = await this.personaRepository.findOne({ where: { dni } });

    if (!persona) {
      throw new Error('Persona no encontrada');
    }

    // 2. Buscar el puesto por el número de empadronamiento
    const puesto = await this.puestoRepository.findOne({ where: { nro_empadronamiento: nroEmpadronamiento } });

    if (!puesto) {
      throw new Error('Puesto no encontrado');
    }

    // 3. Verificar si la persona ya está empadronada en el puesto para el año proporcionado
    const empadronamientoExistente =
      await this.empadronamientoRepository.findOne({
        where: { persona: persona, puesto: puesto, anio: anio },
    });

    if (empadronamientoExistente) {
      throw new Error(
        'La persona ya está empadronada en este puesto para el año ' + anio,
      );
    }

    // 4. Crear el empadronamiento
    const empadronamiento = this.empadronamientoRepository.create({
      persona: persona,
      puesto: puesto,
      anio: anio,
      estado: 'empadronado',
    });

    // 5. Guardar el empadronamiento
    await this.empadronamientoRepository.save(empadronamiento);

    return {
      message: 'Persona empadronada correctamente',
      empadronamiento,
    };
  }

  async registrar(data: any) {
    try {
      const empadronar = this.empadronamientoRepository.create(data);
      return await this.empadronamientoRepository.save(empadronar);
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
