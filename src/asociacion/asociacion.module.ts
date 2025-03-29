import { Module } from '@nestjs/common';
import { AsociacionService } from './asociacion.service';
import { AsociacionController } from './asociacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asociacion } from './entities/asociacion.entity';

@Module({
  controllers: [AsociacionController],
  providers: [AsociacionService],
  imports: [TypeOrmModule.forFeature([Asociacion])],
  exports: [TypeOrmModule, AsociacionService],
})
export class AsociacionModule {}
