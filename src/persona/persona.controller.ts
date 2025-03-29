import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}


  @Get('searchPuesto')
  findPersonOrPuesto(
    @Query('dni') dni: string,
    @Query('puesto') puesto: string,
    @Query('sector') sector: string,
    @Query('pabellon') pabellon: string,
    @Query('nroEmpadronamiento') nroEmpadronamiento: string,
  ) {
    return this.personaService.searchPerson(
      dni,
      nroEmpadronamiento,
      { puesto, sector, pabellon },

    );
  }

  @Get('datos-puesto')
  findDataPuesto(
    @Query('dni') dni: string,
    @Query('nroEmpadronamiento') nroEmpadronamiento: string,
  ) {
    return this.personaService.getPersonComplete(dni, nroEmpadronamiento);
  }

  @Get('search')
  async searchPersona(@Query() searchPersonaDto: {dni?: number, nombre?: string}) {
    return this.personaService.searchPersona(searchPersonaDto);
  }
  @Post('create')
  async createPersona(@Body() createPersonaDto: any) {
    return this.personaService.createPersonaAsociacion(createPersonaDto);
  }

  @Patch(':id')
  async updatePersona(
    @Param('id') id: string,  // Obtenemos el id de la persona a actualizar
    @Body() updatePersonaDto: UpdatePersonaDto,
  ) {
    return this.personaService.updatePerson(id, updatePersonaDto);
  }


  @Get()
  findAll() {
    return this.personaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonaDto: UpdatePersonaDto) {
    return this.personaService.update(+id, updatePersonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personaService.remove(+id);
  }
}
