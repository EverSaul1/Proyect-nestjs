import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Persona } from '../../persona/entities/persona.entity';

@Entity({ name: 'ubicacion_geografica' })
export class Ubigeo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  id_ubigeo: number;

  @Column({ type: 'text', nullable: true })
  ubigeo_reniec: string;

  @Column({ type: 'text' })
  ubigeo_inei: string;

  @Column({ type: 'text' })
  departamento_inei?: string;

  @Column({ type: 'text' })
  departamento: string;

  @Column({ type: 'text' })
  provincia_inei: string;

  @Column({ type: 'text' })
  provincia: string;

  @Column({ type: 'text' })
  distrito: string;

  @Column({ type: 'text' })
  region: string;

  @Column({ type: 'text' })
  macroregion_inei: string;

  @Column({ type: 'text' })
  macroregion_minsa?: string;

  @Column({ type: 'text' })
  iso_3166_2: string;

  @Column({ type: 'text' })
  fips?: string;

  @Column({ type: 'decimal', nullable: true })
  superficie: number;

  @Column({ type: 'decimal', nullable: true })
  altitud?: number;

  @Column({ type: 'decimal', nullable: true })
  latitud: number;

  @Column({ type: 'decimal', nullable: true })
  longitud: number;

  @Column({ type: 'text' })
  frontera: string;
}
