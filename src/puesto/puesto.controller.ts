import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PuestoService } from './puesto.service';
import { CreatePuestoDto } from './dto/create-puesto.dto';
import { UpdatePuestoDto } from './dto/update-puesto.dto';

@Controller('puesto')
export class PuestoController {
  constructor(private readonly puestoService: PuestoService) {}


  @Get('sector')
  async getDepartamentos() {
    return this.puestoService.getAllSector();
  }

  // Obtener provincias por departamento
  @Get('pabellon')
  async getProvincias(@Query('sector') sector: string) {
    return this.puestoService.getPabellonBySector(sector);
  }

  // Obtener distritos por provincia
  @Get('puesto')
  async getDistritos(
    @Query('pabellon') pabellon: string,
    @Query('sector') sector: string,
  ) {
    return this.puestoService.getPuestoByPabellon(pabellon, sector);
  }
  @Patch('asignar-asociado/:puestoId')
  async asignarAsociado(
    @Param('puestoId') puestoId: string,
    @Body() asociadoDto: any,
  ) {
    return this.puestoService.asignarAsociado(puestoId, asociadoDto);
  }

  @Patch('remove-asociado/:puestoId')
  async removeAsociado(
    @Param('puestoId') puestoId: string,
    @Body() asociadoDto: any,
  ) {
    return this.puestoService.removeAsociadoFromPuesto(puestoId);
  }
}
