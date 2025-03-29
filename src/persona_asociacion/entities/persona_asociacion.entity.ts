import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Persona } from '../../persona/entities/persona.entity';

@Entity({ name: 'personas_asociacion' })
export class PersonaAsociacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Persona, (persona) => persona.personasAsociacion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column({ type: 'enum', enum: ['asociado', 'conyuge', 'carga_familiar'] })
  tipo: 'asociado' | 'conyuge' | 'carga_familiar';

  @ManyToOne(() => Persona, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'titular_id' })
  asociado: Persona;

  @Column({ type: 'text', nullable: true })
  parentesco: string;
}
