import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Puesto } from '../../puesto/entities/puesto.entity';
import { Persona } from '../../persona/entities/persona.entity';
import { IsOptional } from 'class-validator';

@Entity('empadronamientos')
export class Empadronamiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación muchos a uno con Puesto (Cada puesto puede tener muchas personas, pero solo una por año)
  @ManyToOne(() => Puesto, (puesto) => puesto.empadronamientos)
  @JoinColumn({ name: 'puesto_id' })
  puesto: Puesto;

  // Relación muchos a uno con Persona (Cada persona solo puede tener un empadronamiento por puesto y año)
  @ManyToOne(() => Persona, (persona) => persona.empadronamientos)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'varchar', default: 'pendiente' })
  estado: string;  // 'pendiente', 'empadronado', 'desactivado'

  @Column({ type: 'date', nullable: true })
  creat_at: Date;
}
