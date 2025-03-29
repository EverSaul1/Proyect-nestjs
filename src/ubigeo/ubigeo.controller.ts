import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UbigeoService } from './ubigeo.service';
import { CreateUbigeoDto } from './dto/create-ubigeo.dto';
import { UpdateUbigeoDto } from './dto/update-ubigeo.dto';

@Controller('ubigeo')
export class UbigeoController {
  constructor(private readonly ubigeoService: UbigeoService) {}

  @Get('departamentos')
  async getDepartamentos() {
    return this.ubigeoService.getAllDepartamentos();
  }

  // Obtener provincias por departamento
  @Get('provincias/')
  async getProvincias(@Query('departamento') departamento: string) {
    return this.ubigeoService.getProvinciasByDepartamento(departamento);
  }

  // Obtener distritos por provincia
  @Get('distritos')
  async getDistritos(@Query('provincia') provincia: string) {
    return this.ubigeoService.getDistritosByProvincia(provincia);
  }

  // Obtener los distritos por departamento
  @Get('distritos-by-department')
  async getDistritosByDepartment(@Param('distrito') distrito: string) {
    return this.ubigeoService.getDistritosByDepartment(distrito);
  }
}
