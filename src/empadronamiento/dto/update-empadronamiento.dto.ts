import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpadronamientoDto } from './create-empadronamiento.dto';

export class UpdateEmpadronamientoDto extends PartialType(CreateEmpadronamientoDto) {}
