import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
