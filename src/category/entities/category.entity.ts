import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { History } from '../../history/entities/history.entity';

@Entity({ name: 'category' })
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text'})
  name: string;

  @Column({ type: 'text', default: null})
  svg: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp' })
  createAt: Date;

  @OneToMany(() => History, (history) => history.category)
  history: History;

}
