import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAsociacionDto {
  @IsNotEmpty()
  @IsString()
  nombre: string; // Nombre de la asociación

  @IsOptional
  ()
  @IsString()
  resolucion_municipal?: string; // Número de resolución municipal

  @IsOptional()
  @IsString()
  personeria_juridica?: string; // Documento de personería jurídica

  @IsOptional()
  @IsDate()
  fecha_resolucion?: Date;
}
