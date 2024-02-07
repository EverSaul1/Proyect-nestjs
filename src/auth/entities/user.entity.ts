import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { History } from '../../history/entities/history.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Favorities } from '../../history/entities/history-favorities.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  avatar?: string;

  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => History, (history) => history.user)
  history: History;

  @OneToMany(() => Comment, (history) => history.user)
  comment: Comment;

  @OneToMany(() => Favorities, (history) => history.user, {
    cascade: true,
    eager: true,
  })
  favorites: Favorities[];

  @BeforeInsert()
  chekFielBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  chekFielBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
