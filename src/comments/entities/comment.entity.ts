import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { History } from '../../history/entities/history.entity';

@Entity({ name: 'comemtarios' })
export class Comment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  comentario: string;

  @Column({ type: 'text' })
  autenticate: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text', default: null} )
  avatar: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @ManyToOne(() => User, (user) => user.comment, { eager: true })
  user: User;

  @ManyToOne(() => History, (history) => history.comment, { eager: true })
  history: History;
}
