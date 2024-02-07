import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Category } from '../../category/entities/category.entity';
import { Favorities } from './history-favorities.entity';
import { Read } from './history-read.entity';
import { Visto } from './history-visto.entity';

@Entity({ name: 'history' })
export class History {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'timestamp' })
  createAt: Date;

  @Column({ type: 'text' })
  text_history: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  imagen: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @ManyToOne(() => User, (user) => user.history, { eager: true })
  user: User;

  @ManyToOne(() => Category, (category) => category.history, { eager: true })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.history)
  comment: Comment;

  @OneToMany(() => Favorities, (comment) => comment.history,
    {
      cascade: true,
      eager: true,
    })
  favorites?: Favorities[];
  @OneToMany(() => Read, (comment) => comment.history,
    {
      cascade: true,
      eager: true,
    })
  reads?: Read[];
  @OneToMany(() => Visto, (comment) => comment.history,
    {
      cascade: true,
      eager: true,
    })
  vistos?: Visto[];

}
