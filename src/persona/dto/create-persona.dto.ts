import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePersonaDto {

  @IsString()
  @IsOptional()
  nombres: string;

  @IsString()
  @IsOptional()
  apellidos: string;

  @IsOptional()
  @IsString()
  dni: string;

  @IsOptional()
  @IsInt()
  edad: number;

  @IsOptional()
  @IsString()
  foto: string;

  @IsOptional()
  celular?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  urbanizacion?: string;

  @IsOptional()
  @IsString()
  estado_civil?: string; // Estado civil de la persona

  @IsOptional()
  @IsString()
  ocupacion?: string; // Ocupación o profesión de la persona

  @IsOptional()
  @IsString()
  ruc?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  idioma?: string;

  @IsOptional()
  @IsString()
  ubigeo: string; // Solo necesitarás el código ubigeo

  @IsOptional()
  fecha_nacimiento: Date;

  @IsOptional()
  @IsString()
  grado_instruccion?: string;
}
