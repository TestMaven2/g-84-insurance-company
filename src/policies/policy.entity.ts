import { InsuranceType } from './enums/insurance-type.enum';
import { User } from '../users/user.entity';
import { Car } from '../cars/car.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Policy {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'type', nullable: false, type: 'enum', enum: InsuranceType })
  type: InsuranceType;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({
    name: 'holder_id',
  })
  holder: User;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({
    name: 'agent_id',
  })
  agent: User;

  @ManyToMany((): typeof Car => Car)
  @JoinTable({
    name: 'policies_cars',
    joinColumn: { name: 'policy_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'car_id', referencedColumnName: 'id' },
  })
  cars: Car[];

  @Column({ name: 'coverage_in_cents', nullable: false, unique: false })
  coverageInCents: number;

  @Column({ name: 'issued_at', nullable: false, unique: false })
  issuedAt: Date;

  @Column({ name: 'expires_at', nullable: false, unique: false })
  expiresAt: Date;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
