import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { History } from './history.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'visto' })
export class Visto {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => History, (product) => product.vistos, {
    onDelete: 'CASCADE',
  })
  history: History;

  @Column({ type: 'timestamp' })
  createAt: Date;
}
