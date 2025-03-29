import {
  BadRequestException, HttpException, HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Puesto } from '../puesto/entities/puesto.entity';
import { PersonaAsociacion } from '../persona_asociacion/entities/persona_asociacion.entity';
import { EmpadronamientoService } from '../empadronamiento/empadronamiento.service';
import { Empadronamiento } from '../empadronamiento/entities/empadronamiento.entity';
import { Ubigeo } from '../ubigeo/entities/ubigeo.entity';

@Injectable()
export class PersonaService {
  private readonly logger = new Logger('PersonaService');
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Puesto)
    private readonly puestoRepository: Repository<Puesto>,
    @InjectRepository(PersonaAsociacion)
    private readonly personaAsociacionRepository: Repository<PersonaAsociacion>,
    @InjectRepository(Empadronamiento)
    private readonly empadronamientoRepository: Repository<Empadronamiento>,
    @InjectRepository(Ubigeo)
    private readonly ubigeoRepository: Repository<Ubigeo>,
    private readonly dataSource: DataSource,
  ) {}


  async searchPerson(dni?: string, nroEmpadronamiento?: string, searchPuesto?: { puesto: string, sector: string, pabellon: string }) {

    try {
      let queryBuilder: any;
      let persona = null;
      let puestoPersona = null;

      // Lógica común para construir el queryBuilder
      if (dni) {
        // Buscar por DNI, obtener la persona y su puesto
        queryBuilder = this.personaRepository.createQueryBuilder('persona')
          .leftJoinAndSelect('persona.puesto', 'puesto')
          .where('persona.dni = :dni', { dni });
      } else {
        // Buscar por puesto, si hay empadronamiento o parámetros de puesto
        queryBuilder = this.puestoRepository.createQueryBuilder('puesto')
          .leftJoinAndSelect('puesto.asociado', 'persona');

        // Filtrar por empadronamiento si está presente
        if (nroEmpadronamiento) {
          queryBuilder.andWhere(
            'puesto.nro_empadronamiento = :nro_empadronamiento',
            { nro_empadronamiento: nroEmpadronamiento },
          );
        } else {
          queryBuilder.andWhere(
            'puesto.puesto = :puesto AND puesto.sector = :sector AND puesto.pabellon = :pabellon',
            {
              puesto: searchPuesto.puesto,
              sector: searchPuesto.sector,
              pabellon: searchPuesto.pabellon,
            },
          );
        }
      }
      const result = await queryBuilder.getOne();

      if (!result) {
        return { message: 'No se encontraron resultados.' };
      }
      if (dni) {
        puestoPersona = result.puesto || [];
        persona = result;
      } else {
        puestoPersona = [result] || [];
        persona = result.asociado || null;
      }

      return { puestoPersona, persona };
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async getPersonComplete(dni?: string, nro_empadronamiento?: string) {
    try {
      if (!dni && !nro_empadronamiento) {
        return { message: 'No se proporcionaron parámetros de búsqueda válidos.' };
      }

      if (dni) {

        /*const personaEmpadronada = await this.empadronamientoRepository
          .createQueryBuilder('empadronamiento')
          .leftJoinAndSelect('empadronamiento.puesto', 'puesto')
          .where('empadronamiento.anio = :anio', { anio: 2025 })
          .andWhere('empadronamiento.persona.dni = :dni', { dni })
          .andWhere('empadronamiento.estado = :estado', { estado: 'empadronado' })
          .getOne();

        if (personaEmpadronada) {
          return { message: `La persona con DNI ${dni} ya está empadronada en el año 2025.` };
        }*/

        const queryBuilder = this.personaRepository.createQueryBuilder('persona')
          .leftJoinAndSelect('persona.puesto', 'puesto')  // Relación con el puesto
          .leftJoinAndSelect('persona.personasAsociacion', 'personaAsociacion')  // Relación con personas_asociacion
          .leftJoinAndSelect('personaAsociacion.asociado', 'conyuge')  // Relación con cónyuge (titular)
          .leftJoinAndSelect('personaAsociacion.persona', 'cargaFamiliar');  // Relación con cargas familiares
        queryBuilder.where('persona.dni = :dni', { dni });
        const persona = await queryBuilder.getOne();

        if (!persona) {
          return { message: 'Persona no encontrada' };
        }
        const ubigeoData = await this.ubigeoRepository.findOne({ where: { ubigeo_inei: persona.ubigeo } });
        return {
          persona: {
            id: persona.id,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            dni: persona.dni,
            ubigeo: persona.ubigeo,
            fecha_nacimiento: persona.fecha_nacimiento,
            edad: persona.edad,
            ruc: persona.ruc,
            ocupacion: persona.ocupacion,
            direccion: persona.direccion,
            urbanizacion: persona.urbanizacion,
            celular: persona.celular,
            grado_instruccion: persona.grado_instruccion,
            estado_civil: persona.estado_civil,
            foto: persona.foto,
            pais: persona.pais,
            idioma: persona.idioma,
            lugar: persona.ubigeo ? {
              distrito: ubigeoData.distrito,
              provincia: ubigeoData.provincia,
              departamento: ubigeoData.departamento,
            }: null
          },
          puesto: persona.puesto,
          conyuge: persona.personasAsociacion.find(
            (asociacion) => asociacion.tipo === 'conyuge'
          )?.asociado || null,
          cargaFamiliar: persona.personasAsociacion
            .filter((asociacion) => asociacion.tipo === 'carga_familiar')
            .map((asociacion) =>  ({...asociacion.asociado, tipo: asociacion.tipo, parentesco: asociacion.parentesco, id_asociacion: asociacion.id}) ),
        };
      }

      // Si se pasa un Puesto, filtramos por el número de puesto
      if (nro_empadronamiento) {

        const puestoEmpadronado = await this.empadronamientoRepository
          .createQueryBuilder('empadronamiento')
          .leftJoinAndSelect('empadronamiento.puesto', 'puesto')
          .where('empadronamiento.anio = :anio', { anio: 2025 })
          .andWhere('puesto.nro_empadronamiento = :nro_empadronamiento', { nro_empadronamiento })
          .andWhere('empadronamiento.estado = :estado', { estado: 'empadronado' })
          .getOne();

        if (puestoEmpadronado) {
          return { message: `El puesto con el número ${nro_empadronamiento} ya está empadronado en el año 2025.` };
        }

        const queryBuilder = this.puestoRepository.createQueryBuilder('puesto')
          .leftJoinAndSelect('puesto.asociado', 'persona')  // Relación con persona asociada al puesto
          .leftJoinAndSelect('persona.personasAsociacion', 'personaAsociacion')  // Relación con personas_asociacion
          .leftJoinAndSelect('personaAsociacion.asociado', 'conyuge')  // Relación con cónyuge (titular)
          .leftJoinAndSelect('personaAsociacion.asociado', 'cargaFamiliar');
        queryBuilder.where(
          'puesto.nro_empadronamiento = :nro_empadronamiento',
          { nro_empadronamiento },
        );
        const puesto = await queryBuilder.getOne();

        if (!puesto) {
          return { message: 'puesto no encontrada' };
        }
        let ubigeoData = null;
        let ubigeoConyuge = null;

        if (puesto.asociado) {
          ubigeoData = await this.ubigeoRepository.findOne({
            where: { ubigeo_inei: puesto.asociado.ubigeo },
          });
          ubigeoConyuge = await this.ubigeoRepository.findOne({
            where: {
              ubigeo_inei: puesto.asociado.personasAsociacion.find(
                (asociacion) => asociacion.tipo === 'conyuge',
              )?.asociado.ubigeo,
            },
          });
        }
        if(!puesto.asociado) {
          return {
            persona: null,
            puesto: {
              id: puesto.id,
              sector: puesto.sector,
              nro_empadronamiento: puesto.nro_empadronamiento,
              pabellon: puesto.pabellon,
              puesto: puesto.puesto,
            },
            conyuge: null,
            cargaFamiliar: [],
          };
        }
        return {
          persona: {
            id: puesto.asociado.id,
            nombres: puesto.asociado.nombres,
            apellidos: puesto.asociado.apellidos,
            dni: puesto.asociado.dni,
            ubigeo: puesto.asociado.ubigeo,
            fecha_nacimiento: puesto.asociado.fecha_nacimiento,
            edad: puesto.asociado.edad,
            ruc: puesto.asociado.ruc,
            ocupacion: puesto.asociado.ocupacion,
            direccion: puesto.asociado.direccion,
            urbanizacion: puesto.asociado.urbanizacion,
            celular: puesto.asociado.celular,
            grado_instruccion: puesto.asociado.grado_instruccion,
            estado_civil: puesto.asociado.estado_civil,
            foto: puesto.asociado.foto,
            pais: puesto.asociado.pais,
            idioma: puesto.asociado.idioma,
            lugar: puesto.asociado.ubigeo ? {
              distrito: ubigeoData.distrito,
              provincia: ubigeoData.provincia,
              departamento: ubigeoData.departamento,
            }: null
          },
          puesto: {
            id: puesto.id,
            sector: puesto.sector,
            nro_empadronamiento: puesto.nro_empadronamiento,
            pabellon: puesto.pabellon,
            puesto: puesto.puesto,
          },
          conyuge: puesto.asociado.personasAsociacion.find(
            (asociacion) => asociacion.tipo === 'conyuge'
          )?.asociado ? {
            id_asociacion: puesto.asociado.personasAsociacion.find(
              (asociacion) => asociacion.tipo === 'conyuge'
            )?.id,
            ...puesto.asociado.personasAsociacion.find(
              (asociacion) => asociacion.tipo === 'conyuge'
            )?.asociado,
            lugar: puesto.asociado.personasAsociacion.find(
              (asociacion) => asociacion.tipo === 'conyuge'
            )?.asociado.ubigeo ? {
              distrito: ubigeoConyuge.distrito,
              provincia: ubigeoConyuge.provincia,
              departamento: ubigeoConyuge.departamento,
            } : null,
          } : null,
          cargaFamiliar: puesto.asociado.personasAsociacion
            .filter((asociacion) => asociacion.tipo === 'carga_familiar')
            .map((asociacion) =>  ({...asociacion.asociado, tipo: asociacion.tipo, parentesco: asociacion.parentesco, id_asociacion: asociacion.id}) ),
        };
      }

    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async searchPersona(searchPersonaDto: { dni?: number; nombre?: string}) {

    try {
      const { dni, nombre } = searchPersonaDto;
      const queryBuilder = this.personaRepository.createQueryBuilder('persona');
      console.log(searchPersonaDto);
      // Si se proporciona un DNI, lo usamos para buscar
      if (dni) {
        queryBuilder.andWhere('persona.dni = :dni', { dni });
      }

      // Si se proporciona un nombre, buscamos por nombre (puede ser parcial)
      if (nombre) {
        queryBuilder.andWhere(
          `persona.nombres ILIKE :nombre
           OR persona.apellidos ILIKE :nombre
           OR CONCAT(persona.nombres, ' ', persona.apellidos) ILIKE :nombre`,
          {
            nombre: `%${nombre}%`,
          },
        );
      }

      // Ejecutar la consulta
      const persona = await queryBuilder.getMany();

      // Si no se encuentra, retornamos un mensaje adecuado
      if (!persona) {
        return { message: 'Persona no encontrada' };
      }

      return persona;
    } catch (e) {
      this.handleExceptions(e);
    }

  }

  async createPersonaAsociacion(createPersonaDto: any) {

    try {
      if(createPersonaDto.asociacion && !createPersonaDto.asociacion.persona_id) {
        throw new HttpException(
          'No se encontró un socio',
          HttpStatus.BAD_REQUEST,
        );
      }
      const persona = this.personaRepository.create(createPersonaDto.persona);
      const savedPersona = await this.personaRepository.save(persona);

      // @ts-ignore
      if (!savedPersona || !savedPersona.id) {
        throw new Error('No se pudo guardar la persona.');
      }

      if (savedPersona && createPersonaDto.asociacion) {
        // 2. Crear la relación en la tabla 'persona_asociacion'
        const personaAsociacion = this.personaAsociacionRepository.create({
          persona: createPersonaDto.asociacion.persona_id,
          tipo: createPersonaDto.asociacion.tipo,
          // @ts-ignore
          asociado: savedPersona.id,
          parentesco: createPersonaDto.asociacion.parentesco || null,
        });
        await this.personaAsociacionRepository.save(personaAsociacion);
        return { message: 'Persona y asociación creadas correctamente.',
                data: savedPersona};
      }
      if(!createPersonaDto.asociacion) {
        return { message: 'Persona creada correctamente.',
          data: savedPersona};
      }
    } catch (e) {
      this.handleExceptions(e)
    }
  }

  async updatePerson(id: string, updatePersonaDto: any) {
    const { personaData, asociacion } = updatePersonaDto;

    // Cargar la persona existente y actualizarla con los datos nuevos
    const persona = await this.personaRepository.preload({
      id: id,
      ...personaData,
    });

    if (!persona) {
      throw new NotFoundException(`Persona with id: "${id}" not found`);
    }

    // Crear el QueryRunner para manejar la transacción
    const queryRunner = this.dataSource.createQueryRunner();
    // Conectar a la base de datos
    await queryRunner.connect();
    // Iniciar la transacción
    await queryRunner.startTransaction();

    try {
      // Guardar la entidad en la base de datos dentro de la transacción
      await queryRunner.manager.save(persona);

      if (asociacion) {
        const personaAsociacion =
          await this.personaAsociacionRepository.findOne({
            where: {
              id: asociacion.id,
            },
          });

        if (personaAsociacion) {
          personaAsociacion.parentesco = asociacion.parentesco;
          await queryRunner.manager.save(personaAsociacion);
        }
      }

      // Si hay más operaciones (por ejemplo, guardar asociaciones o cargar más datos), las puedes realizar aquí
      // await queryRunner.manager.save(otraEntidad);

      // Confirmar la transacción
      await queryRunner.commitTransaction();
      // Liberar el query runner
      await queryRunner.release();

      // Retornar la persona actualizada o la respuesta deseada
      return persona;
    } catch (error) {
      // En caso de error, hacer rollback
      await queryRunner.rollbackTransaction();
      // Liberar el query runner
      await queryRunner.release();
      // Manejo de excepciones
      this.handleExceptions(error);
    }
  }


  create(createPersonaDto: CreatePersonaDto) {
    return 'This action adds a new persona';
  }

  findAll() {
    return `This action returns all persona`;
  }

  findOne(id: number) {
    return `This action returns a #${id} persona`;
  }

  update(id: number, updatePersonaDto: UpdatePersonaDto) {
    return `This action updates a #${id} persona`;
  }

  remove(id: number) {
    return `This action removes a #${id} persona`;
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      if (error.detail.includes('(dni)')) {
        throw new BadRequestException('El DNI ya está registrado.');
      }
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpectes erro, check server logs',
    );
  }
}
