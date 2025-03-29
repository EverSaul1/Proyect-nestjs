import { Module } from '@nestjs/common';
import { PuestoService } from './puesto.service';
import { PuestoController } from './puesto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puesto } from './entities/puesto.entity';
import { Persona } from '../persona/entities/persona.entity';

@Module({
  controllers: [PuestoController],
  imports: [TypeOrmModule.forFeature([Puesto, Persona])],
  providers: [PuestoService],
  exports: [PuestoService, TypeOrmModule],
})
export class PuestoModule {}
