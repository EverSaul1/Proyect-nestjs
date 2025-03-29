import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpadronamientoService } from './empadronamiento.service';
import { CreateEmpadronamientoDto } from './dto/create-empadronamiento.dto';
import { UpdateEmpadronamientoDto } from './dto/update-empadronamiento.dto';

@Controller('empadronamiento')
export class EmpadronamientoController {
  constructor(private readonly empadronamientoService: EmpadronamientoService) {}

  @Get('verificar/:nroEmpadronamiento')
  async verificarPuestoEmpadronado(@Param('nroEmpadronamiento') nroEmpadronamiento: string) {
    return this.empadronamientoService.verificarPuestoEmpadronado(
      nroEmpadronamiento,
    );
  }

  @Get('verificar-persona/:dni')
  async verificarPersonaEmpadronada(@Param('dni') dni: string) {
    return this.empadronamientoService.verificarPersonaEmpadronada(dni);
  }

  @Post()
  async empadronar(@Body() body: CreateEmpadronamientoDto) {
    return this.empadronamientoService.registrar(body);
  }
}
