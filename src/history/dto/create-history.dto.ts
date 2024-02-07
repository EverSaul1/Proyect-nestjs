import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateHistoryDto {

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  text_history: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  imagen?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsUUID(4)
  category: string;

  @IsString()
  type: string;
}
