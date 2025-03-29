import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsociacionService } from './asociacion.service';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { UpdateAsociacionDto } from './dto/update-asociacion.dto';

@Controller('asociacion')
export class AsociacionController {
  constructor(private readonly asociacionService: AsociacionService) {}

  @Post()
  create(@Body() createAsociacionDto: CreateAsociacionDto) {
    return this.asociacionService.create(createAsociacionDto);
  }

  @Get()
  findAll() {
    return this.asociacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asociacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsociacionDto: UpdateAsociacionDto) {
    return this.asociacionService.update(+id, updateAsociacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asociacionService.remove(+id);
  }
}
