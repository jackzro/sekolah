import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from './student.entity';

@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  period: string;

  @Column()
  unit: string;

  @Column()
  iuran: string;

  @ManyToOne(() => Student, (student) => student.payments)
  student: Student;

  @Column()
  jumlahTagihan: number;

  @Column()
  jumlahDenda: number;

  @Column()
  jumlahAdmin: number;

  @Column()
  bulanIuran: string;

  @Column()
  tglTagihan: Date;

  @Column()
  tglDenda: Date;

  @Column()
  cicilanKe: number;

  @Column()
  caraBayar: string;

  @Column()
  vBcaKode: string;

  @Column({ nullable: true })
  tanggalBayar: Date;

  @Column()
  jumlahBayar: string;

  @Column()
  userBayar: string;

  @Column()
  buktiBayar: string;

  @Column()
  statusBayar: boolean;

  @Column()
  keterangan: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
