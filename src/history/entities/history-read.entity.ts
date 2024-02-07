import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { History } from './history.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'read' })
@Unique(['user', 'history'])
export class Read {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE'})
  user: User;

  @ManyToOne(() => History, (product) => product.reads, {
    onDelete: 'CASCADE',
  })
  history: History
}
