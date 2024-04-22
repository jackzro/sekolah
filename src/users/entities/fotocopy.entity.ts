import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'fotocopy' })
export class Fotocopy extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  tanggalFotocopy: Date;

  @Column()
  jumlah: string;

  @Column()
  keperluan: string;

  @ManyToOne(() => User, (user) => user.fotocopy)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
