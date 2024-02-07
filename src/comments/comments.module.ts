import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { HistoryModule } from '../history/history.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CommentsController],
  imports: [TypeOrmModule.forFeature([Comment]), HistoryModule, AuthModule],
  providers: [CommentsService],
})
export class CommentsModule {}
