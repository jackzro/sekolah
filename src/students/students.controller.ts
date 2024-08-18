import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { DiskStorage } from 'helpers/file-type';
import { join } from 'path';
import {
  bulans,
  BULAN_KELAS_LULUSAN,
  BULAN_KELAS_NAIKAN,
} from 'helpers/payment-type';
import { PaymentsService } from './payments.service';
import { transformAuthInfo } from 'passport';
// import { Cron } from '@nestjs/schedule';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private paymentsService: PaymentsService,
  ) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file', DiskStorage))
  create(@UploadedFile() file, @Body() createStudentDto: CreateStudentDto) {
    return 'upload file success';
  }

  @Post('createFile')
  async bikinExcelBca(@Body() data) {
    return await this.studentsService.createFileBca();
  }

  @Post('payment/file/createFile')
  async bikinExcelBcaPayment(@Body() data) {
    return await this.paymentsService.createFile();
  }

  // @Cron('0 0 11 * *')
  @Get('updateAllUangDenda')
  async updateAllUangDenda(@Param('id') id: string) {
    const students = await this.studentsService.findAll();
    return students.map(
      async (student) => await this.paymentsService.updateUangDenda(student.id),
    );
  }

  @Get()
  findStudentAll() {
    return this.studentsService.findAll();
  }

  @Post('newStudent')
  async createNewStudent(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');
    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet);
    json.map((students) => {
      if (students['NAMA SISWA']) {
        this.studentsService.createNewStudent(students);
      }
    });
  }

  @Post()
  async findAll(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const sheetName = workbook.SheetNames[data.arraySheet];
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      if (students['SISWA-ID']) {
        await this.studentsService.create(students);
      }
    });
    return 'All created';

    // console.log(json[34]);
    // console.log(workbook);
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const data = e.target.result;
    //   const workbook = xlsx.read(data, { type: 'array' });
    //   const sheetName = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[sheetName];
    //   console.log(worksheet);
    //   const json = xlsx.utils.sheet_to_json(worksheet);
    //   console.log(json);
    // };
    return this.studentsService.findAll();
  }

  @Post('createUangPMB')
  createUangPMB(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      const detail = {
        id: students['SISWA-ID'],
        grade: students['KELAS'],
        uangPMB: students['UPMB'],
        vBcaUangPMB: '5' + students['SISWA-ID'],
        unit: students['UNIT'],
      };
      if (students['SISWA-ID'] && students['UPMB']) {
        await this.paymentsService.createUangPMB(detail);
      }
    });

    return 'done create PMB';
  }

  @Post('updateStatusFalse')
  async updateStatusFalse(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');
    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);
    json.map(async (students) => {
      console.log(students['SISWA-ID']);
      if (students['SISWA-ID']) {
        await this.studentsService.updateStatusToTrue(students['SISWA-ID']);
      }
    });
    return 'All Update to True';
  }

  @Post('updateStatusAll')
  async updateStatusAll(@Body() data) {
    return await this.studentsService.updateStatusAll(data.status);
  }

  @Post('pmb/updateUbahNamaPMB')
  async updateUbahNamaPMB(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });

    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      if (students['id'] && students['nama']) {
        await this.studentsService.updateNama(students['id'], students['nama']);
      }
    });

    return '';
  }

  @Post('updateUsek')
  updateUsek(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      if (students['SISWA-ID'] && students['USEK']) {
        await this.studentsService.updatePayment(students['SISWA-ID'], {
          uangSekolah: students['USEK'],
        });
        await this.studentsService.updateGrade(students['SISWA-ID'], {
          grade: students['KELAS'],
        });
      }
    });

    return '';
  }

  @Post('createUangSekolahByExcelDariBulanJuly')
  createUangSekolahDariBulanJuly(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      if (students['SISWA-ID'] && students['USEK 2024/2025']) {
        await this.studentsService.updateStatusToTrue(students['SISWA-ID']);
        const detail = {
          id: students['SISWA-ID'],
          grade: students['KELAS'],
          uangSekolah: students['USEK 2024/2025'],
          vBcaSekolah: '1' + students['SISWA-ID'],
          unit: students['UNIT'],
        };

        bulans.map(async (bulan) => {
          await this.paymentsService.createUangSekolah(detail, bulan);
        });
      }
    });

    return '';
  }

  @Post('excelstatustotrue')
  excelstatus(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      await this.studentsService.updateStatusToTrue(students['SISWA-ID']);
    });

    return '';
  }

  @Post('bikinUangKegiatan')
  bikinUangKegiatan(@Body() data) {
    console.log('bikinUangKegiatan');
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);
    json.map(async (students) => {
      if (
        students['SISWA-ID'] === undefined ||
        students['U.KEG BARU'] === undefined
      ) {
        return;
      }
      const stu = {
        id: students['SISWA-ID'],
        unit: students['UNIT'],
        tahun: '2024/2025',
        uangKegiatan: students['U.KEG BARU'],
        vBcaKegiatan: students['vbca ukeg'],
        tanggalTunggakan: '2024-7-25',
        tanggalDenda: '2024-8-10',
      };
      // console.log(students['SISWA-ID'], students['U.KEG BARU']);
      await this.paymentsService.createUangKegiatanlewatExcel(stu);
    });
  }

  @Post('naikkelas')
  naikkelas(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      if (students['SISWA-ID'] && students['USEK 2024/2025']) {
        await this.studentsService.updateStatusToTrue(students['SISWA-ID']);
        await this.studentsService.naikkelas(
          students['SISWA-ID'],
          students['KELAS'],
        );
      }
    });

    return '';
  }

  @Post('createUangSekolahByExcelDariBulanAgustus')
  createUangSekolahDariBulanAgustus(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      if (students['SISWA-ID'] && students['USEK 2024/2025']) {
        await this.studentsService.updateStatusToTrue(students['SISWA-ID']);
        const detail = {
          id: students['SISWA-ID'],
          grade: students['KELAS'],
          uangSekolah: students['USEK 2024/2025'],
          vBcaSekolah: '1' + students['SISWA-ID'],
          unit: students['UNIT'],
        };

        BULAN_KELAS_NAIKAN.map(async (bulan) => {
          await this.paymentsService.createUangSekolah(detail, bulan);
        });
      }
    });

    return '';
  }

  @Post('createUangSekolahByExcel')
  createUangSekolah(@Body() data) {
    const dirpath = join(__dirname, '..', '..', '..', 'uploads');

    const workbook = xlsx.readFile(dirpath + `/${data.filename}`, {
      type: 'array',
    });
    const worksheet = workbook.Sheets[data.arraySheet];
    const json = xlsx.utils.sheet_to_json(worksheet);

    json.map(async (students) => {
      if (students['SISWA-ID'] && students['USEK 2024/2025']) {
        await this.studentsService.updateStatusToTrue(students['SISWA-ID']);
        const detail = {
          id: students['SISWA-ID'],
          grade: students['KELAS'],
          uangSekolah: (students['USEK 2024/2025'] * 12) / 10,
          vBcaSekolah: '1' + students['SISWA-ID'],
          unit: students['UNIT'],
        };
        if (
          students['KELAS'] === 'SD 6' ||
          students['KELAS'] === 'SMP 9' ||
          students['KELAS'] === 'SMA 12'
        ) {
          BULAN_KELAS_LULUSAN.map(async (bulan) => {
            await this.paymentsService.createUangSekolah(detail, bulan);
          });
        } else if (
          students['KELAS'] === 'PG' ||
          students['KELAS'] === 'KB' ||
          students['KELAS'] === 'TKA' ||
          students['KELAS'] === 'SD 1' ||
          students['KELAS'] === 'SMP 7' ||
          students['KELAS'] === 'SMA 10'
        ) {
          BULAN_KELAS_NAIKAN.map(async (bulan) => {
            await this.paymentsService.createUangSekolah(detail, bulan);
          });
        } else {
          console.log(detail);
          bulans.map(async (bulan) => {
            await this.paymentsService.createUangSekolah(detail, bulan);
          });
        }
      }
    });

    return '';
  }

  @Get('setahun')
  async filterSetahun() {
    const students = await this.studentsService.filterSetahun();
    const newStudents = students.map((student) => {
      return {
        id: student.id,
        name: student.name,
      };
    });
    return newStudents.length;
  }

  @Post('payments')
  async createPayment() {
    const students = await this.studentsService.findAll();
    students.map(async (student) => {
      if (student.uangSekolah) {
        if (
          student.grade === 'SD 6' ||
          student.grade === 'SMP 9' ||
          student.grade === 'SMA 12'
        ) {
          BULAN_KELAS_LULUSAN.map(async (bulan) => {
            await this.paymentsService.createUangSekolah(student, bulan);
          });
        } else if (
          student.grade === 'SD 1' ||
          student.grade === 'SMP 7' ||
          student.grade === 'SMA 10'
        ) {
          BULAN_KELAS_NAIKAN.map(async (bulan) => {
            await this.paymentsService.createUangSekolah(student, bulan);
          });
        } else {
          bulans.map(async (bulan) => {
            await this.paymentsService.createUangSekolah(student, bulan);
          });
        }
      }
    });
    return 'All payment have been created.';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Get('payment/:id')
  async payment(@Param('id') id: string) {
    return await this.paymentsService.payments(id);
  }

  @Get('show/uangKegiatan')
  async showUangKegiatan(@Query() query) {
    const payments = await this.paymentsService.filterUangKegiatan();
    return payments.length;
  }

  @Get('payment/detail/:id')
  async paymentDetail(@Param('id') id: string) {
    return await this.paymentsService.paymentDetail(id);
  }

  @Post('payment/delete')
  async removePayment(@Body() data) {
    await data.map(async (data) => {
      return await this.paymentsService.remove(data.id);
    });
  }

  @Post('addStudent')
  async addStudent(@Body() student) {
    const data = await this.studentsService.addStudent(student);
    if (data.uangSekolah) {
      if (
        data.grade === 'SD 6' ||
        data.grade === 'SMP 9' ||
        data.grade === 'SMA 12'
      ) {
        BULAN_KELAS_LULUSAN.map(async (bulan) => {
          await this.paymentsService.buatUSek(data, bulan, student.tahun);
        });
      } else if (
        data.grade === 'SD 1' ||
        data.grade === 'SMP 7' ||
        data.grade === 'SMA 10'
      ) {
        BULAN_KELAS_NAIKAN.map(async (bulan) => {
          await this.paymentsService.buatUSek(data, bulan, student.tahun);
        });
      } else {
        bulans.map(async (bulan) => {
          await this.paymentsService.buatUSek(student, bulan, student.tahun);
        });
      }
    }
    return data;
  }

  @Post('createUangSekolahById')
  async createUangSekolahById(@Body() data) {
    const student = await this.studentsService.findID(data.id);
    if (student.uangSekolah) {
      if (
        student.grade === 'SD 6' ||
        student.grade === 'SMP 9' ||
        student.grade === 'SMA 12'
      ) {
        BULAN_KELAS_LULUSAN.map(async (bulan) => {
          await this.paymentsService.buatUSek(student, bulan, data.tahun);
        });
      } else if (
        student.grade === 'SD 1' ||
        student.grade === 'SMP 7' ||
        student.grade === 'SMA 10'
      ) {
        BULAN_KELAS_NAIKAN.map(async (bulan) => {
          await this.paymentsService.buatUSek(student, bulan, data.tahun);
        });
      } else {
        bulans.map(async (bulan) => {
          await this.paymentsService.buatUSek(student, bulan, data.tahun);
        });
      }
    }
    return student;
  }

  @Post('updatePaymentStatus')
  async updateStatusPay(@Body() updateStatus) {
    await updateStatus.data.map(async (data) => {
      return await this.paymentsService.updateStatusBayarTunai(
        data.id,
        updateStatus.tanggalBayar,
        updateStatus.tipepayment,
        updateStatus.kodeTransaksi,
      );
    });
  }

  @Post('updatePaymentStatusViaFIle')
  async updateStatusViaFile(@Body() updateStatus) {
    await updateStatus.dataBayaran.map(async (data) => {
      return await this.paymentsService.paymentsViaBca(
        data,
        updateStatus.tanggalBatas,
      );
    });
  }

  @Post('updateStatusPayment')
  async updateStatusOne(@Body() updateStatus) {
    return await this.paymentsService.updateStatus(
      updateStatus,
      updateStatus.tanggal,
      false,
    );
  }

  @Post('laporan')
  async laporan(@Body() data) {
    return await this.studentsService.cariStudent(data);
  }

  @Post('laporan/unit')
  async laporanUnit(@Body() data) {
    return await this.studentsService.filterPaymentbyUnit(data);
  }

  @Post('laporan/gakbayar')
  async laporanUnitgakbayar(@Body() data) {
    return await this.studentsService.filterPaymentgakbayar(data);
  }

  @Post('unit')
  findStudentsbyUnit(@Body() data) {
    return this.studentsService.findStudentsbyUnit(data.unit);
  }

  @Post('unit/:id')
  async findStudentsID(@Body() data) {
    const student = await this.studentsService.lastIdStudentById(data.unit);
    return student.max;
  }

  @Patch(':id')
  update(@Body() updateStudentDto) {
    return this.studentsService.update(updateStudentDto);
  }

  @Patch('/payment/uangsekolah/:id')
  updatePayment(@Body() updateStudentDto, @Param() id) {
    this.studentsService.updatePayment(id.id, updateStudentDto);
    return this.paymentsService.updatePaymentUangSekolah(
      id.id,
      updateStudentDto,
    );
  }

  @Patch('/payment/uangkegiatan/:id')
  updateUangKegiatan(@Body() updateStudentDto, @Param() id) {
    this.studentsService.updateUangKegiatan(id.id, updateStudentDto);
    return this.paymentsService.updateUangKegiatan(id.id, updateStudentDto);
  }

  // @Patch('/uangDenda/:id')
  // async updateDenda(@Body() updateDenda, @Param() id) {
  //   return await this.studentsService.dendaSwitch(id.id, updateDenda.status);
  // }

  @Post('/payment/status')
  async batalPaymentStatus(@Body() updatePayment) {
    updatePayment.map(async (payment) => {
      return await this.paymentsService.batalPaymentStatus(payment.id);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.removeAll(id);
      await Promise.all(
        payment.map(async (data) => {
          await this.paymentsService.remove(data.id);
        }),
      );
      return await this.studentsService.remove(+id);
    } catch (error) {
      return 'You must delete payment history first!!!';
    }
  }

  @Get('/payment/period/:id')
  groupByPeriod(@Param('id') id: string) {
    return this.paymentsService.groupByTahunAjaran(id);
  }

  @Post('create/uangLainnya')
  async generateUangLainnya(@Body() detail) {
    const students = await this.studentsService.findStudentsbyGrade({
      grade: detail.grade,
    });
    await Promise.all(
      students.map((student) => {
        this.paymentsService.createUangLainnya(student, detail);
      }),
    );
    return 'Uang Lainnya is created !!!';
  }

  @Post('create/id/uangLainnya')
  async generateUangLainnyaById(@Body() detail) {
    const student = await this.studentsService.findOne(detail.idSiswa);
    this.paymentsService.createUangLainnya(student, detail);
    return 'Uang Lainnya is created !!!';
  }

  @Post('/updateExcel/payment')
  async updateExcelPayment(@Body() updateExcel) {
    const user = await Promise.all(
      updateExcel.data.map(async (detail) => {
        const student = await this.studentsService.findID(detail.studentID);
        updateExcel.detail.jumlahTagihan = detail.Jumlah;
        await this.paymentsService.createUangLainnya(
          student,
          updateExcel.detail,
        );
      }),
    );
  }

  @Post('create/uangKegiatan')
  async generateUangKegiatan(@Body() detail) {
    const students = await this.studentsService.findStudentsbyGrade({
      grade: detail.grade,
    });
    await Promise.all(
      students.map((student) => {
        this.paymentsService.createUangKegiatan(student, detail);
      }),
    );
    return 'Uang Kegiatan is created !!!';
  }

  @Post('create/id/uangkegiatan')
  async generateUangKegiatanById(@Body() detail) {
    const student = await this.studentsService.findOne(detail.idSiswa);
    this.paymentsService.createUangKegiatan(student, detail);
    return 'Uang Kegiatan is created !!!';
  }

  @Post('create/uangUjian')
  async generateUangUjian(@Body() detail) {
    const students = await this.studentsService.findStudentsbyGrade({
      grade: detail.grade,
    });
    await Promise.all(
      students.map((student) => {
        this.paymentsService.createUangUjian(student, detail);
      }),
    );
    return 'Uang Ujian is created !!!';
  }

  //bayar setahun
  @Post('/bayarsetahun/uangDaftarUlang')
  async bayarsetahunBikinUangDaftarUlang(@Body() detail) {
    const students = await this.studentsService.filterSetahunUangDaftarUlang();
    await Promise.all(
      students.map((student) => {
        this.paymentsService.createUangDaftarUlang(student, detail);
      }),
    );
    return 'Uang Daftar Ulang is created !!!';
  }

  //tidak bayar setahun
  @Post('/tidakbayarsetahun/uangDaftarUlang')
  async tidakbayarsetahunBikinUangDaftarUlang(@Body() detail) {
    const students =
      await this.studentsService.filterTidakSetahunUangDaftarUlang();

    let final = [];
    await Promise.all(
      students.map(async (student) => {
        final.push({
          name: student.name,
          grade: student.grade,
          tagihanSebelumnya: student.payments[0].jumlahTagihan,
          tagihanNow: await this.paymentsService.tambahUangAprilDaftarUlang(
            student,
          ),
        });
      }),
    );
    return final;
  }

  // @Post('dendaActivation')
  // async dendaActivation(@Body() data) {
  //   return this.studentsService.activationDenda(data.status);
  // }
}
