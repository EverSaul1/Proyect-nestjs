import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUbigeoDto {
  @IsNumber()
  @IsNotEmpty()
  id_ubigeo: number;

  @IsString()
  @IsNotEmpty()
  ubigeo_reniec: string;

  @IsString()
  @IsNotEmpty()
  ubigeo_inei: string;

  @IsString()
  @IsOptional()
  departamento_inei?: string;

  @IsString()
  @IsNotEmpty()
  departamento: string;

  @IsString()
  @IsNotEmpty()
  provincia_inei: string;

  @IsString()
  @IsNotEmpty()
  provincia: string;

  @IsString()
  @IsNotEmpty()
  distrito: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  macroregion_inei: string;

  @IsString()
  @IsOptional()
  macroregion_minsa?: string;

  @IsString()
  @IsNotEmpty()
  iso_3166_2: string;

  @IsString()
  @IsOptional()
  fips?: string;

  @IsDecimal()
  @IsNotEmpty()
  superficie: number;

  @IsDecimal()
  @IsOptional()
  altitud?: number;

  @IsDecimal()
  @IsNotEmpty()
  latitud: number;

  @IsString()
  @IsOptional()
  frontera: string;
}
