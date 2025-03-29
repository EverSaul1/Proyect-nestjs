import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePersonaAsociacionDto } from './dto/create-persona_asociacion.dto';
import { UpdatePersonaAsociacionDto } from './dto/update-persona_asociacion.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonaAsociacion } from './entities/persona_asociacion.entity';
import { Persona } from '../persona/entities/persona.entity';

@Injectable()
export class PersonaAsociacionService {
  private readonly logger = new Logger('PersonaAsociacionService');
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,

    @InjectRepository(PersonaAsociacion)
    private readonly personaAsociacionRepository: Repository<PersonaAsociacion>,
  ) {
  }


  async deletePersonaAsociado(id: number) {

    try {

      const personaAsociado = await this.personaAsociacionRepository.findOne({
        where: { id },
      });

      // Si no se encuentra, devolver un mensaje
      if (!personaAsociado) {
        return { message: 'El registro no existe.' };
      }

      // Eliminar el registro
      await this.personaAsociacionRepository.remove(personaAsociado);

      return { message: 'Relación eliminada correctamente.' };
    } catch (e) {
      this.handleExceptions(e);
    }

  }

  async assignPersonaAsociacion(
    createPersonaAsociacionDto: any,
  ) {

    try {
      // Buscar a la persona por id o dni
      const persona = await this.personaRepository.findOne({
        where: { id: createPersonaAsociacionDto.persona_id }, // Puedes usar el id de la persona
      });

      if (!persona) {
        throw new Error('Persona no encontrada');
      }
      const personaAsociacion = this.personaAsociacionRepository.create({
        persona: createPersonaAsociacionDto.persona_id,
        tipo: createPersonaAsociacionDto.tipo,
        asociado: createPersonaAsociacionDto.asociado_id,
        parentesco: createPersonaAsociacionDto.parentesco || null,
      });

      // Guardar la nueva relación
      await this.personaAsociacionRepository.save(personaAsociacion);

      return { message: 'Asociación de persona realizada correctamente', personaAsociacion };

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

  create(createPersonaAsociacionDto: CreatePersonaAsociacionDto) {
    return 'This action adds a new personaAsociacion';
  }

  findAll() {
    return `This action returns all personaAsociacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personaAsociacion`;
  }

  update(id: number, updatePersonaAsociacionDto: UpdatePersonaAsociacionDto) {
    return `This action updates a #${id} personaAsociacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} personaAsociacion`;
  }
}
