import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaDto } from './create-persona.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAsociacionDto } from '../../asociacion/dto/create-asociacion.dto';

export class UpdatePersonaDto extends PartialType(CreatePersonaDto) {

  @IsOptional()
  personaData: CreatePersonaDto;

  @IsOptional()
  asociacion?: CreateAsociacionDto;
}
