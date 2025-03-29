import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import { AuthModule } from './auth/auth.module';
import { v2 as cloudinary } from 'cloudinary';
import { PersonaModule } from './persona/persona.module';
import { PuestoModule } from './puesto/puesto.module';
import { AsociacionModule } from './asociacion/asociacion.module';
import { PersonaAsociacionModule } from './persona_asociacion/persona_asociacion.module';
import { EmpadronamientoModule } from './empadronamiento/empadronamiento.module';
import { UbigeoModule } from './ubigeo/ubigeo.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    PersonaModule,
    PuestoModule,
    AsociacionModule,
    PersonaAsociacionModule,
    EmpadronamientoModule,
    UbigeoModule,
  ],
  providers: [AuthModule],
})
export class AppModule {
  // Configuration
  configure() {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })
  }

}
