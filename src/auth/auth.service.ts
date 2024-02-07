import {
  BadRequestException,
  Injectable,
  InternalServerErrorException, NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as isUUID } from 'uuid';
import { Express } from 'express';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    
    private readonly dataSource: DataSource,
  ) {}
  async create(createUserDto: CreateUserDto, file: Express.Multer.File)
  {
    try {
      let avatarResponse;
      const { password, ...userData } = createUserDto;

      if (file) {
        avatarResponse = await this.uploadAvatar(file);
      }

      // creamos el usuario
      const user = this.userRepository.create({
        ...userData,
        avatar: avatarResponse?.url || '',
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };

      //Retornar el JWT del acceso
    } catch (e) {
      this.handleErros(e);
    }
  }
  async authLogin(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('No se encontro su (email)');
    }
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Contraseña incorrecta');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
    //Retornar el JWT del acceso
  }
  async updatePassword(id: string, updateDto: UpdatePasswordDto) {
    const { passwordOld, password } = updateDto;
    const user = await this.userRepository.preload({
      id: id,
      password: bcrypt.hashSync(password, 10),
    });
    if (!user) throw new NotFoundException(`User with id: "${id}" not found`);

    const findPassword = await this.userRepository.findOne({
      where: { id },
      select: { password: true, id: true, email: true },
    });
    if (!bcrypt.compareSync(passwordOld, findPassword.password))
      throw new UnauthorizedException(
        'Your password does not match your old password',
      );

    // CREATE QUERY RUNNER
    const queryRunner = this.dataSource.createQueryRunner();
    //conectar a la bd queryrunner
    await queryRunner.connect();
    //inicar la transccion
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(user);
      /*await this.productRespository.save(product)*/
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleErros(e);
    }
  }
  async findOnePlain(ter: string) {
    const { ...res } = await this.findOne(ter);
    return {
      ...res,
    };
  }
  async findOne(term: string) {
    let user: User;
    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    }
    if (!user) {
      throw new NotFoundException(
        `User with id, name or no "${term}" not found`,
      );
    }
    return user;
  }

  async checkAuthStatus(user: User) {
    if (!user) throw new UnauthorizedException('Not found Credentials');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    //sing: para firmar el token
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleErros(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
  private async uploadAvatar(avatarFile: Express.Multer.File) {
    console.log(avatarFile)
    const result = await cloudinary.uploader.upload(avatarFile.path);
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
}
