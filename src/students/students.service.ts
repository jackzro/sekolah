import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Payment } from './entities/payment.entity';
import { Student } from './entities/student.entity';
import { StudentRepository } from './repositories/students.repository';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentRepository)
    private studentRepository: StudentRepository,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = new Student();
    student.id = createStudentDto['SISWA-ID'];
    student.grade = createStudentDto['KELAS'];
    student.name = createStudentDto['NAMA SISWA'];
    student.unit = createStudentDto['UNIT'];
    student.vBcaSekolah = '1' + createStudentDto['SISWA-ID'];
    student.vBcaKegiatan = '2' + createStudentDto['SISWA-ID'];
    if (
      createStudentDto['KELAS'] === 'SD 6' ||
      createStudentDto['KELAS'] === 'SMP 9' ||
      createStudentDto['KELAS'] === 'SMA 12'
    ) {
      let uangSekolahBaru = (createStudentDto['USEK'] * 12) / 10;
      student.uangSekolah = uangSekolahBaru;
    } else {
      student.uangSekolah = createStudentDto['USEK'];
    }

    student.status = createStudentDto['STATUS'];
    student.keterangan = createStudentDto['keterangan'];
    student.anakBaru = createStudentDto['anak baru'];
    student.keterangan = createStudentDto[''];
    student.uangKegiatan = createStudentDto['U.KEG BARU'];
    return await student.save();
  }

  async addStudent(student) {
    student.vBcaSekolah = '1' + student.id;
    student.vBcaKegiatan = '2' + student.id;
    student.status = true;
    return await this.studentRepository.save(student);
  }

  async createNewStudent(createStudentDto: CreateStudentDto) {
    const students = await this.studentRepository
      .createQueryBuilder('students')
      .where({ unit: createStudentDto['UNIT'] })
      .select('MAX(students.id)', 'max')
      .getRawOne();
    return students;
  }

  findAll() {
    return this.studentRepository.find({
      where: {
        status: true,
      },
    });
    // return `This action returns all students`;
  }

  async findID(id) {
    const student = await this.studentRepository.findOne({
      id,
    });
    return student;
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne(
      {
        id,
      },
      {
        relations: ['payments'],
      },
    );
    return student;
  }

  async findName(name: string) {
    const student = await this.studentRepository.findOne({
      name,
    });
    return student;
  }

  async payment(id) {
    const student = await this.studentRepository.findOne(
      {
        id,
      },
      {
        relations: ['payments'],
      },
    );
    return student;
  }

  async findStudentsbyUnit(unit) {
    const students = await this.studentRepository.find({
      unit,
      status: true,
    });
    return students;
  }
  async findStudentsbyGrade({ grade }) {
    const students = await this.studentRepository.find({
      grade,
    });
    return students;
  }

  async lastIdStudentById(unit) {
    const students = await this.studentRepository
      .createQueryBuilder('students')
      .where({ unit })
      .select('MAX(students.id)', 'max')
      .getRawOne();
    return students;
  }

  async update(updateStudentDto) {
    // const student = await this.studentRepository
    //   .createQueryBuilder('students')
    //   .update(updateStudentDto)
    //   .where('students.id =:id', { id: updateStudentDto.id })
    //   // .andWhere('payments.period =:period', { period: data.period })
    //   .execute()
    //   .then((response) => {
    //     console.log(response);
    //     return response.raw[0];
    //   });
    await this.studentRepository.update(updateStudentDto.id, updateStudentDto);
    const student = await this.studentRepository.findByIds(updateStudentDto.id);
    return student[0];
  }

  async remove(id: number) {
    return await this.studentRepository.delete(id);
  }

  async updateNama(id, nama) {
    return await this.studentRepository.update(id, {
      name: nama,
    });
  }

  async cariStudent(data) {
    return await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .where({ grade: data.grade })
      .andWhere('payments.iuran =:iuran', { iuran: 'Uang Sekolah' })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
      .andWhere('payments.tglDenda <=:nowDate', {
        nowDate: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      })
      // .andWhere('payments.tglTagihan <:nowDate', {
      //   nowDate: new Date(`2022-12-10`),
      // })
      .orderBy('payments.tglTagihan', 'ASC')
      .getMany();
  }

  async filterPaymentgakbayar(data) {
    return await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .where({ unit: 'SMA PAX PATRIAE' })
      .andWhere('payments.period =:period', {
        period: 'Tahun Ajaran 2023/2024',
      })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
      // .andWhere('payments.tglTagihan <:nowDate', {
      //   nowDate: new Date(`2022-12-10`),
      // })
      .orderBy('students.id', 'ASC')
      .getMany();
  }

  async filterPaymentbyUnit(data) {
    if (data.jenis === 'Uang Sekolah') {
      return await this.studentRepository
        .createQueryBuilder('students')
        .leftJoinAndSelect('students.payments', 'payments')
        .where({ unit: data.type })
        .andWhere('payments.iuran IN (:...iuran)', {
          iuran: ['Uang Sekolah', 'Uang Daftar Ulang'],
        })
        .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
        .andWhere('payments.tglDenda <=:nowDate', {
          nowDate: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}`,
        })
        .andWhere('students.status =:status', { status: true })
        // .andWhere('payments.tglTagihan <:nowDate', {
        //   nowDate: new Date(`2022-12-10`),
        // })
        .orderBy('students.id', 'ASC')
        .getMany();
    } else {
      return await this.studentRepository
        .createQueryBuilder('students')
        .leftJoinAndSelect('students.payments', 'payments')
        .where({ unit: data.type })
        .andWhere('payments.iuran =:iuran', { iuran: data.jenis })
        .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
        .andWhere('payments.tglDenda <=:nowDate', {
          nowDate: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}`,
        })
        .andWhere('students.status =:status', { status: true })
        // .andWhere('payments.tglTagihan <:nowDate', {
        //   nowDate: new Date(`2022-12-10`),
        // })
        .orderBy('students.id', 'ASC')
        .getMany();
    }
  }

  async filterSetahun() {
    return await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .where({ unit: 'SD MARIA FRANSISKA' })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: true })
      .andWhere('payments.bulanIuran =:nowDate', {
        nowDate: `2023-6`,
      })
      .orderBy('students.id', 'ASC')
      .getMany();
  }

  async filterSetahunUjian() {
    return await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .where({ unit: 'SD MARIA FRANSISKA' })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: true })
      .andWhere('payments.bulanIuran =:nowDate', {
        nowDate: `2023-4`,
      })
      .orderBy('students.id', 'ASC')
      .getMany();
  }

  async filterSetahunUangDaftarUlang() {
    return await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .andWhere('payments.bulanIuran =:nowDate', {
        nowDate: `2024-6`,
      })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: true })
      .orderBy('students.id', 'ASC')
      .getMany();
  }

  async filterTidakSetahunUangDaftarUlang() {
    return await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .andWhere('payments.bulanIuran =:nowDate', {
        nowDate: `2024-4`,
      })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
      .andWhere('students.grade ')
      .orderBy('students.id', 'ASC')
      .getMany();
  }

  async createFileBca() {
    const students = await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .orderBy('students.id', 'ASC')
      // .where('payments.iuran =:iuran', { iuran: type })
      .where('payments.statusBayar =:statusBayar', { statusBayar: false })
      .andWhere('payments.tglTagihan <=:nowDate', {
        nowDate: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
        // nowDate: `2024-1-10`,
      })
      // .andWhere('payments.tglTagihan <=:nowDate', {
      //   nowDate: new Date(`2022-6-25`),
      // })
      .addOrderBy('payments.tglTagihan', 'ASC')
      .getMany();
    return students;
  }

  async updatePayment(id, data) {
    return await this.studentRepository.update(id, {
      uangSekolah: data.uangSekolah,
    });
  }

  async updateGrade(id, data) {
    return await this.studentRepository.update(id, {
      grade: data.grade,
    });
  }

  async updateUangKegiatan(id, data) {
    return await this.studentRepository.update(id, {
      uangKegiatan: data.uangKegiatan,
    });
  }

  async updateJumlahDenda() {
    const students = await this.studentRepository
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.payments', 'payments')
      .where('payments.iuran =:iuran', { iuran: 'Uang Sekolah' })
      .where('payments.statusBayar =:statusBayar', { statusBayar: false })
      .andWhere('payments.tglTagihan <=:tglTagihan', {
        tglTagihan: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-10`,
      })
      .orderBy('payments.tglTagihan', 'ASC')
      .getMany();
    return students;
  }

  async updateStatusToFalse(id) {
    return await this.studentRepository.update(id, {
      status: false,
    });
  }

  async updateStatusToTrue(id) {
    return await this.studentRepository.update(id, {
      status: true,
    });
  }

  async naikkelas(id, grade) {
    return await this.studentRepository.update(id, {
      grade,
    });
  }

  async updateStatusAll(status) {
    const students = await this.studentRepository.find();
    if (status === 'False') {
      students.map(
        async (student) => await this.updateStatusToFalse(student.id),
      );
    } else if (status === 'True') {
      students.map(
        async (student) => await this.updateStatusToTrue(student.id),
      );
    }

    return;
  }

  async updateAllStudentUangDenda() {
    // const students = await this.studentRepository.find();
    // students.map(student=>{
    //   this
    // })
    // console.log(students);
  }

  // async dendaSwitch(id, status) {
  //   return await this.studentRepository.update(id, {
  //     dendaActive: status === 'false' ? false : true,
  //   });
  // }

  // async activationDenda(status) {
  //   const students = await this.studentRepository.find();
  //   students.map(async (student) => {
  //     await this.studentRepository.update(student.id, {
  //       dendaActive: status === 'false' ? false : true,
  //     });
  //   });
  //   return `All Student Denda is ${
  //     status === 'false' ? 'Tidak Aktif' : 'Aktif'
  //   }`;
  // }
}
