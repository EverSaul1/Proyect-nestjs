import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query, ParseUUIDPipe
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../auth/multer/multer.configuration';
import { Express, query } from 'express';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  create(@Body() createHistoryDto: CreateHistoryDto, @GetUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.historyService.create(createHistoryDto, user, file);
  }
  @Get('get-history-by-category')
  getHistoryByCategoryController(@Query() request: any) {
    return this.historyService.getHistoryByCategory(request);
  }

  @Get('get-history')
  getHistoryOneController(@Query() request: any) {
    return this.historyService.getHistoryOne(request);
  }
  @Get('get-historia-limit-gigant')
  getHistoryLimitGigantController() {
    return this.historyService.getHistoryLimitPanelGrande();
  }
  @Get('get-historia-limit')
  getHistoryLimitController() {
    return this.historyService.getHistoryLimit();
  }
  @Get('get-history-all')
  getHistoryAllController(@Query() request: any) {
    return this.historyService.getSearchHistory(request);
  }
  @Get('get-history-recomendaciones')
  getHistoryRecomendadosAllController(@Query() request: any) {
    return this.historyService.getHistoryRecomendados(request);
  }

  @Post('add-favorite')
  @Auth()
  createfavorities(@Body() request: any, @GetUser() user: User) {
    return this.historyService.postFavorites(request, user);
  }

  @Get('favorities/all')
  @Auth()
  getFavoritiesAll(@GetUser() user: User) {
    return this.historyService.getFavorities(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.historyService.update(+id, updateHistoryDto);
  }

  @Delete('favorities/:id')
  @Auth()
  removeFavorites(@Param('id') id: number) {
    return this.historyService.deleteFavorities(id);
  }
  @Post('add-count-visto')
  createVistoController(@Body() request: any) {
    return this.historyService.postVisto(request);
  }

  @Post('add-read')
  @Auth()
  createReadController(@Body() request: any, @GetUser() user: User) {
    return this.historyService.postRead(request, user);
  }
  @Delete('read/:id')
  @Auth()
  removeReadController(@Param('id') id: number) {
    return this.historyService.deleteRead(id);
  }
}
