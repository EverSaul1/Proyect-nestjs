import { Module } from '@nestjs/common';
import { PersonaAsociacionService } from './persona_asociacion.service';
import { PersonaAsociacionController } from './persona_asociacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaAsociacion } from './entities/persona_asociacion.entity';
import { Persona } from '../persona/entities/persona.entity';

@Module({
  controllers: [PersonaAsociacionController],
  providers: [PersonaAsociacionService],
  imports: [TypeOrmModule.forFeature([PersonaAsociacion, Persona])],
  exports: [TypeOrmModule, PersonaAsociacionService],
})
export class PersonaAsociacionModule {}
