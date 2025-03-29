import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateEmpadronamientoDto {
  @IsNotEmpty()
  @IsInt()
  puesto_id: number; // Relación con puestos(id), qué puesto se empadronó

  @IsOptional()
  @IsInt()
  persona_id?: number; // Relación con personas(id), quién se empadronó

  @IsNotEmpty()
  @IsInt()
  anio: number; // Año del empadronamiento

  @IsOptional()
  creat_at: Date;
}
