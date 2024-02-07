import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { Favorities } from './entities/history-favorities.entity';
import { CategoryModule } from '../category/category.module';
import { Read } from './entities/history-read.entity';
import { Visto } from './entities/history-visto.entity';

@Module({
  controllers: [HistoryController],
  imports: [
    TypeOrmModule.forFeature([History, Favorities, Read, Visto]),
    AuthModule,
    CategoryModule,
  ],
  providers: [HistoryService],
  exports: [HistoryService, TypeOrmModule],
})
export class HistoryModule {}
