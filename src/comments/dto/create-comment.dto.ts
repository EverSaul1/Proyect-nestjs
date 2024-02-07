import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCommentDto {

  @IsString()
  @MinLength(1)
  comentario: string;

  @IsString()
  fecha: string;

  @IsString()
  history?: string;

  @IsString()
  autenticate?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  fullName: string;


}
