import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateCommentDto {

  @IsString()
  @MinLength(1)
  comentario: string;
}
