import { Module } from '@nestjs/common';
import { EmpadronamientoService } from './empadronamiento.service';
import { EmpadronamientoController } from './empadronamiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empadronamiento } from './entities/empadronamiento.entity';
import { Persona } from '../persona/entities/persona.entity';
import { Puesto } from '../puesto/entities/puesto.entity';

@Module({
  controllers: [EmpadronamientoController],
  providers: [EmpadronamientoService],
  exports: [EmpadronamientoService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Empadronamiento, Persona, Puesto])],
})
export class EmpadronamientoModule {}
