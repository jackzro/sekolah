import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from './payment.entity';

@Entity({ name: 'students' })
export class Student extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  grade: string;

  @Column()
  unit: string;

  @Column()
  name: string;

  @OneToMany(() => Payment, (payments) => payments.student)
  payments: Payment[];

  // @Column({ default: true })
  // dendaActive: boolean;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  jumlahDenda: string;

  @Column({ nullable: true })
  namaPanggilan: string;

  @Column({ nullable: true })
  agama: string;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  tempatLahir: string;

  @Column({ nullable: true })
  motherName: string;

  @Column({ nullable: true })
  motherNumber: string;

  @Column({ nullable: true })
  fatherName: string;

  @Column({ nullable: true })
  fatherNumber: string;

  @Column({ nullable: true })
  joinDate: string;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  bahasaSeharihari: string;

  @Column({ nullable: true })
  bloodType: string;

  @Column()
  uangSekolah: number;

  @Column({ nullable: true })
  uangKegiatan: number;

  @Column()
  vBcaSekolah: string;

  @Column()
  vBcaKegiatan: string;

  @Column({ nullable: true })
  keterangan: string;

  @Column({ nullable: true })
  anakBaru: boolean;

  @Column({ nullable: true })
  totalTunggakan: number;

  @Column({ nullable: true })
  kewarganegaraan: string;

  @Column({ nullable: true })
  anakKe: string;

  @Column({ nullable: true })
  saudaraKandung: number;

  @Column({ nullable: true })
  saudaraTiri: number;

  @Column({ nullable: true })
  saudaraAngkat: number;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  tinggalPada: string;

  @Column({ nullable: true })
  jarakKeSekolah: string;

  @Column({ nullable: true })
  alamat: string;

  @Column({ nullable: true })
  kecamatan: string;

  @Column({ nullable: true })
  kelurahan: string;

  @Column({ nullable: true })
  kota: string;

  @Column({ nullable: true })
  provinsi: string;

  @Column({ nullable: true })
  kodepos: string;

  @Column({ nullable: true })
  notelp: string;

  @Column({ nullable: true })
  rtrw: string;

  @Column({ nullable: true })
  pendidikanAyah: string;

  @Column({ nullable: true })
  pendidikanIbu: string;

  @Column({ nullable: true })
  pekerjaanAyah: string;

  @Column({ nullable: true })
  pekerjaanIbu: string;

  @Column({ nullable: true })
  namaWali: string;

  @Column({ nullable: true })
  hubunganWali: string;

  @Column({ nullable: true })
  pendidikanWali: string;

  @Column({ nullable: true })
  pekerjaanWali: string;

  @Column({ nullable: true })
  asalSekolah: string;

  @Column({ nullable: true })
  namaSekolah: string;

  @Column({ nullable: true })
  tglDanNmrIjzSTTB: string;

  @Column({ nullable: true })
  namaSekolahAsal: string;

  @Column({ nullable: true })
  dariTingkat: string;

  @Column({ nullable: true })
  diterimaTgl: Date;

  @Column({ nullable: true })
  noSuratKet: string;

  @Column({ nullable: true })
  tahunTamat: string;

  @Column({ nullable: true })
  noIjzahSTTB: string;

  @Column({ nullable: true })
  melanjutKeSekolah: string;

  @Column({ nullable: true })
  kelasDitinggalkan: string;

  @Column({ nullable: true })
  keSekolah: string;

  @Column({ nullable: true })
  keTingkat: string;

  @Column({ nullable: true })
  alasanKeluarSekolah: string;

  @Column({ nullable: true })
  tglKeluar: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async setPassword(password: string) {}
}
