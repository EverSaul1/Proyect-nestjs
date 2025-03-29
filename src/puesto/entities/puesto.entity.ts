import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Persona } from '../../persona/entities/persona.entity';
import { Empadronamiento } from '../../empadronamiento/entities/empadronamiento.entity';

@Entity({ name: 'puestos' })
export class Puesto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Persona, { nullable: true })  // Relación uno a uno con Persona
  @JoinColumn({ name: 'asociado_id' })  // La columna asociada_id es la clave foránea
  asociado: Persona;

  @Column({ type: 'text'})
  sector: string;

  @Column({ type: 'text', unique: true})
  nro_empadronamiento: string ;

  @Column({ type: 'text' })
  pabellon: string;

  @Column({ type: 'text'})
  puesto: string; // Número de puesto asignado

  // Relación uno a muchos con Empadronamientos
  @OneToMany(() => Empadronamiento, (empadronamiento) => empadronamiento.puesto)
  empadronamientos: Empadronamiento[];
}
