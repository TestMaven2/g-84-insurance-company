import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('confirmation_codes')
export class ConfirmationCode {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'value', unique: true, nullable: false })
  value: string;

  @Column({ name: 'expiration', unique: false, nullable: false })
  expiration: Date;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
