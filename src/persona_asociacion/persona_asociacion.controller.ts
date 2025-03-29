import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonaAsociacionService } from './persona_asociacion.service';
import { CreatePersonaAsociacionDto } from './dto/create-persona_asociacion.dto';
import { UpdatePersonaAsociacionDto } from './dto/update-persona_asociacion.dto';

@Controller('persona-asociacion')
export class PersonaAsociacionController {
  constructor(private readonly personaAsociacionService: PersonaAsociacionService) {}


  @Delete(':id')
  async deletePersonaAsociado(@Param('id') id: number) {
    return this.personaAsociacionService.deletePersonaAsociado(id);
  }
  @Post('assign')
  async assignPersonaAsociacion(@Body() createPersonaAsociacionDto: any) {
    return this.personaAsociacionService.assignPersonaAsociacion(
      createPersonaAsociacionDto,
    );
  }

  @Post()
  create(@Body() createPersonaAsociacionDto: CreatePersonaAsociacionDto) {
    return this.personaAsociacionService.create(createPersonaAsociacionDto);
  }

  @Get()
  findAll() {
    return this.personaAsociacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personaAsociacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonaAsociacionDto: UpdatePersonaAsociacionDto) {
    return this.personaAsociacionService.update(+id, updatePersonaAsociacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personaAsociacionService.remove(+id);
  }
}
