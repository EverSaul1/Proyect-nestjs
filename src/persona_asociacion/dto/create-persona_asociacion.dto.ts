import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePersonaAsociacionDto {

  @IsInt()
  @IsNotEmpty()
  persona_id: number; // Relación con personas(id)

  @IsEnum(['asociado', 'conyuge', 'carga_familiar'])
  @IsNotEmpty()
  tipo: 'asociado' | 'conyuge' | 'carga_familiar'; // Tipo de relación en la asociación

  @IsOptional()
  @IsInt()
  asociado_id?: number; // Relación con personas(id), si es cónyuge o carga familiar

  // Número de RUC, si aplica

  @IsOptional()
  @IsString()
  parentesco?: string; // Parentesco si es carga familiar
}
