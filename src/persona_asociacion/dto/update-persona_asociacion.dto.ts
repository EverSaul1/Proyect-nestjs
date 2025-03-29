import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonaAsociacionDto } from './create-persona_asociacion.dto';

export class UpdatePersonaAsociacionDto extends PartialType(CreatePersonaAsociacionDto) {}
