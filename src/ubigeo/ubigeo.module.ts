import { Module } from '@nestjs/common';
import { UbigeoService } from './ubigeo.service';
import { UbigeoController } from './ubigeo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ubigeo } from './entities/ubigeo.entity';

@Module({
  controllers: [UbigeoController],
  providers: [UbigeoService],
  imports: [TypeOrmModule.forFeature([Ubigeo])],
  exports: [TypeOrmModule, UbigeoService],
})
export class UbigeoModule {}
