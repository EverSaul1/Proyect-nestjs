import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'asociaciones' })
export class Asociacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  resolucion_municipal?: string;

  @Column({ type: 'text', nullable: true })
  personeria_juridica?: string;

  @Column({ type: 'date', nullable: true })
  fecha_resolucion?: Date;
}
