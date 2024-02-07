import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { History } from './history.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'favorites' })
@Unique(['user', 'history'])
export class Favorities {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE'})
  user: User;

  @ManyToOne(() => History, (product) => product.favorites, {
    onDelete: 'CASCADE',
  })
  history: History
}
