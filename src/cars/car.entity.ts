import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'brand', nullable: false, unique: false })
  brand: string;

  @Column({ name: 'model', nullable: false, unique: false })
  model: string;

  @Column({ name: 'year', nullable: false, unique: false })
  year: number;

  @Column({ name: 'vin', nullable: false, unique: true })
  vin: string;

  @Column({ name: 'color', nullable: false, unique: false })
  color: string;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({
    name: 'owner_id',
  })
  owner: User;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
