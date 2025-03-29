import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePuestoDto {
  @IsNotEmpty()
  @IsString()
  sector: string; // Sector dentro de la asociación

  @IsNotEmpty()
  @IsString()
  pabellon: string; // Pabellón dentro del sector

  @IsNotEmpty()
  @IsString()
  puesto: string; // Número de puesto asignado

  @IsNotEmpty()
  @IsString()
  nro_empadronamiento: string;
}
