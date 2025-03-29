import { Module } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { Puesto } from '../puesto/entities/puesto.entity';
import { PersonaAsociacion } from '../persona_asociacion/entities/persona_asociacion.entity';
import { Empadronamiento } from '../empadronamiento/entities/empadronamiento.entity';
import { Ubigeo } from '../ubigeo/entities/ubigeo.entity';

@Module({
  controllers: [PersonaController],
  providers: [PersonaService],
  imports: [
    TypeOrmModule.forFeature([
      Persona,
      Puesto,
      PersonaAsociacion,
      Empadronamiento,
      Ubigeo,
    ]),
  ],
  exports: [TypeOrmModule, PersonaService],
})
export class PersonaModule {}
