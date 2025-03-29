import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { PersonaAsociacion } from '../../persona_asociacion/entities/persona_asociacion.entity';
import { Ubigeo } from '../../ubigeo/entities/ubigeo.entity';
import { Puesto } from '../../puesto/entities/puesto.entity';
import { Empadronamiento } from '../../empadronamiento/entities/empadronamiento.entity';

@Entity({ name: 'personas' })
export class Persona {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  nombres: string;

  @Column({ type: 'text' })
  apellidos: string;

  @Column({ type: 'text', unique: true, nullable: true })
  dni: string;

  @Column({ type: 'int', nullable: true  })
  edad: number;

  @Column({ type: 'text', nullable: true })
  foto: string;

  @Column({ type: 'text', nullable: true })
  celular?: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({ type: 'text', nullable: true })
  urbanizacion?: string;

  @Column({ type: 'text', nullable: true })
  ubigeo: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'text', nullable: true })
  grado_instruccion?: string;

  @Column({ type: 'text', nullable: true })
  estado_civil: string;

  @Column({ type: 'text', nullable: true })
  ocupacion: string;

  @Column({ type: 'text', nullable: true })
  ruc: string;

  @Column({ type: 'text', nullable: true })
  pais: string;

  @Column({ type: 'text', nullable: true })
  idioma: string;

  @OneToMany(() => PersonaAsociacion, (personaAsociacion) => personaAsociacion.persona)
  personasAsociacion: PersonaAsociacion[];

  @OneToMany(() => Puesto, (puesto) => puesto.asociado, { nullable: true })  // Relación uno a uno con Puesto
  puesto: Puesto;

  @OneToMany(() => Empadronamiento, (empadronamiento) => empadronamiento.persona)
  empadronamientos: Empadronamiento[];
}
