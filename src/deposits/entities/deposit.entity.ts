import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'deposits' })
export class Deposit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txid: string;

  @Column()
  tanggalDeposit: Date;
}
