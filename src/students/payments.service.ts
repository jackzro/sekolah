import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';
import { getManager } from 'typeorm';
import { findNthTerm } from 'helpers/payment-type';
import { vBcaKodeGenerate } from 'helpers/funcHelp';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,
  ) {}
  private readonly logger = new Logger(PaymentsService.name);

  // @Cron('45 * * * * *')
  // async handleCron() {
  // const payment = await this.paymentRepository.update(451, {
  //   statusBayar: true,
  //   caraBayar: 'QRIS',
  //   tanggalBayar: '2023-5-10',
  // });
  // return payment;
  // this.logger.debug('Called when the current second is 45', payment);
  // }

  async buatUSek(detail, bulan, tahun) {
    const payment = new Payment();
    const year = tahun.split('/');
    payment.student = detail.id;
    payment.unit = detail.unit;
    payment.iuran = 'Uang Sekolah';
    payment.period = `Tahun Ajaran ${tahun}`;
    payment.jumlahTagihan = detail.uangSekolah;
    payment.vBcaKode = detail.vBcaSekolah;
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    if (bulan >= 7 && bulan <= 12) {
      payment.bulanIuran = `${year[0]}-${bulan}`;
      payment.tglTagihan = new Date(`${year[0]}-${bulan - 1}-25`);
      payment.tglDenda = new Date(`${year[0]}-${bulan}-10`);
    } else if (bulan === 1) {
      payment.bulanIuran = `${year[1]}-${bulan}`;
      payment.tglTagihan = new Date(`${year[0]}-12-25`);
      payment.tglDenda = new Date(`${year[1]}-${bulan}-10`);
    } else {
      payment.bulanIuran = `${year[1]}-${bulan}`;
      payment.tglTagihan = new Date(`${year[1]}-${bulan - 1}-25`);
      payment.tglDenda = new Date(`${year[1]}-${bulan}-10`);
    }
    payment.cicilanKe = 0;
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.keterangan = '';
    payment.kodeTransaksi = '';
    return await payment.save();
  }

  async createUangSekolah(student, bulan) {
    const payment = new Payment();
    payment.student = student.id;
    payment.unit = student.unit;
    payment.iuran = 'Uang Sekolah';
    payment.period = `Tahun Ajaran ${new Date().getFullYear()}/${
      new Date().getFullYear() + 1
    } `;
    payment.jumlahTagihan = student.uangSekolah;
    payment.vBcaKode = student.vBcaSekolah;
    payment.kodeTransaksi = '';
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    if (bulan >= 7 && bulan <= 12) {
      payment.bulanIuran = `${new Date().getFullYear()}-${bulan}`;
      payment.tglTagihan = new Date(
        `${new Date().getFullYear()}-${bulan - 1}-25`,
      );
      payment.tglDenda = new Date(`${new Date().getFullYear()}-${bulan}-10`);
    } else if (bulan === 1) {
      payment.bulanIuran = `${new Date().getFullYear() + 1}-${bulan}`;
      payment.tglTagihan = new Date(`${new Date().getFullYear()}-12-25`);
      payment.tglDenda = new Date(
        `${new Date().getFullYear() + 1}-${bulan}-10`,
      );
    } else {
      payment.bulanIuran = `${new Date().getFullYear() + 1}-${bulan}`;
      payment.tglTagihan = new Date(
        `${new Date().getFullYear() + 1}-${bulan - 1}-25`,
      );
      payment.tglDenda = new Date(
        `${new Date().getFullYear() + 1}-${bulan}-10`,
      );
    }
    payment.cicilanKe = 0;
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.keterangan = '';
    return await payment.save();
  }

  async deletePmb() {
    const pmb = await this.paymentRepository.find({
      iuran: 'Uang PMB',
    });
    pmb.map(async (detail) => {
      await this.paymentRepository.delete({ id: detail.id });
    });
    return pmb;
  }

  async createUangLainnya(student, detail) {
    const tanggal = detail.tanggalDenda.split('/');
    const payment = new Payment();
    payment.student = student.id;
    payment.unit = student.unit;
    payment.iuran = detail.typeUang;
    payment.period = `Tahun Ajaran ${detail.tahun}`;
    payment.jumlahTagihan = detail.jumlahTagihan;
    payment.vBcaKode = vBcaKodeGenerate(detail) + student.id;
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    payment.bulanIuran = `${tanggal[2]}-${tanggal[0]}`;
    payment.tglTagihan = new Date(detail.tanggalTunggakan);
    payment.tglDenda = new Date(detail.tanggalDenda);
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.cicilanKe = 0;
    payment.keterangan = '';
    return payment.save();
  }

  async createUangKegiatan(student, detail) {
    const tanggal = detail.tanggalTunggakan.split('/');
    const payment = new Payment();
    payment.student = student.id;
    payment.unit = student.unit;
    payment.iuran = 'Uang Kegiatan';
    payment.period = `Tahun Ajaran ${detail.tahun}`;
    payment.jumlahTagihan = detail.uangKegiatan;
    payment.vBcaKode = student.vBcaKegiatan;
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    payment.bulanIuran = `${tanggal[2]}-${tanggal[0]}`;
    payment.tglTagihan = new Date(detail.tanggalTunggakan);
    payment.tglDenda = new Date(detail.tanggalDenda);
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.cicilanKe = 0;
    payment.keterangan = '';
    payment.kodeTransaksi = '';
    return payment.save();
  }

  async createUangKegiatanlewatExcel(student) {
    // const tanggal = detail.tanggalTunggakan.split('/');
    const payment = new Payment();
    payment.student = student.id;
    payment.unit = student.unit;
    payment.iuran = 'Uang Kegiatan';
    payment.period = `Tahun Ajaran ${student.tahun}`;
    payment.jumlahTagihan = student.uangKegiatan;
    payment.vBcaKode = student.vBcaKegiatan;
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    payment.bulanIuran = `2024-8`;
    payment.tglTagihan = new Date(student.tanggalTunggakan);
    payment.tglDenda = new Date(student.tanggalDenda);
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.cicilanKe = 0;
    payment.keterangan = '';
    payment.kodeTransaksi = '';
    return payment.save();
  }

  async createUangUjian(student, detail) {
    const tanggal = detail.tanggalTunggakan.split('/');
    const payment = new Payment();
    payment.student = student.id;
    payment.unit = student.unit;
    payment.iuran = 'Uang Ujian';
    payment.period = `Tahun Ajaran ${detail.tahun}`;
    payment.jumlahTagihan = detail.uangKegiatan;
    payment.vBcaKode = '3' + student.id;
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    payment.bulanIuran = `${tanggal[2]}-${tanggal[0]}`;
    payment.tglTagihan = new Date(detail.tanggalTunggakan);
    payment.tglDenda = new Date(detail.tanggalDenda);
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.cicilanKe = 0;
    payment.keterangan = '';
    return payment.save();
  }

  async createUangDaftarUlang(student, detail) {
    if (
      student.grade === 'SD 6' ||
      student.grade === 'SMP 9' ||
      student.grade === 'SMA 12' ||
      student.grade === 'TKB'
    ) {
      return;
    }
    let uangDaftarUlang = 0;
    switch (student.unit) {
      case 'KB/TK MARIA YACHINTA':
        uangDaftarUlang = 350000;
        break;
      case 'SD MARIA FRANSISKA':
        uangDaftarUlang = 400000;
        break;
      case 'SMP PAX ECCLESIA':
        uangDaftarUlang = 450000;
        break;
      case 'SMA PAX PATRIAE':
        uangDaftarUlang = 450000;
        break;
    }

    const tanggal = detail.tanggalTunggakan.split('/');
    const payment = new Payment();
    payment.student = student.id;
    payment.unit = student.unit;
    payment.iuran = 'Uang Daftar Ulang';
    payment.period = `Tahun Ajaran ${detail.tahun}`;
    payment.jumlahTagihan = uangDaftarUlang;
    payment.vBcaKode = '4' + student.id;
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    payment.bulanIuran = `${tanggal[2]}-${tanggal[0]}`;
    payment.tglTagihan = new Date(detail.tanggalTunggakan);
    payment.tglDenda = new Date(detail.tanggalDenda);
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.cicilanKe = 0;
    payment.keterangan = '';
    payment.kodeTransaksi = '';
    return payment.save();
  }

  async tambahUangAprilDaftarUlang(student) {
    if (
      student.grade === 'SD 6' ||
      student.grade === 'SMP 9' ||
      student.grade === 'SMA 12' ||
      student.grade === 'TKB'
    ) {
      return student.payments[0].jumlahTagihan;
    }
    let paymentAprildanDaftarUlang = 0;

    if (student.grade === 'TKA' || student.grade === 'PG') {
      paymentAprildanDaftarUlang = student.payments[0].jumlahTagihan + 350000;
    } else if (
      student.grade === 'SD 1' ||
      student.grade === 'SD 2' ||
      student.grade === 'SD 3' ||
      student.grade === 'SD 4' ||
      student.grade === 'SD 5'
    ) {
      paymentAprildanDaftarUlang = student.payments[0].jumlahTagihan + 400000;
    } else if (student.grade === 'SMP 7' || student.grade === 'SMP 8') {
      paymentAprildanDaftarUlang = student.payments[0].jumlahTagihan + 450000;
    } else if (student.grade === 'SMA 10' || student.grade === 'SMA 11') {
      paymentAprildanDaftarUlang = student.payments[0].jumlahTagihan + 450000;
    }
    await this.paymentRepository.update(student.payments[0].id, {
      jumlahTagihan: paymentAprildanDaftarUlang,
    });

    return paymentAprildanDaftarUlang;
  }

  async createUangPMB(student) {
    const payment = new Payment();
    payment.student = student.id;
    payment.unit = student.unit;
    payment.iuran = 'Uang PMB';
    payment.period = `Tahun Ajaran 2024/2025`;
    payment.jumlahTagihan = student.uangPMB;
    payment.vBcaKode = student.vBcaUangPMB;
    payment.jumlahDenda = 0;
    payment.jumlahAdmin = 5000;
    payment.bulanIuran = `2023-9`;
    payment.tglTagihan = new Date('2023-08-25');
    payment.tglDenda = new Date('2023-09-10');
    payment.caraBayar = '';
    payment.jumlahBayar = '';
    payment.userBayar = '';
    payment.buktiBayar = '';
    payment.statusBayar = false;
    payment.cicilanKe = 0;
    payment.keterangan = '';
    payment.kodeTransaksi = '';
    return payment.save();
  }

  async filterUangKegiatan() {
    const payments = await this.paymentRepository.find({
      where: {
        iuran: 'Uang Kegiatan',
        student: {
          grade: 'TKB',
        },
      },
      relations: ['student'],
    });
    return payments;
  }

  async payments(id) {
    const payments = await this.paymentRepository.find({
      where: {
        student: id,
        statusBayar: false,
      },
      relations: ['student'],
      order: {
        tglTagihan: 'ASC',
      },
    });
    return payments;
  }

  async paymentDetail(id) {
    const payments = await this.paymentRepository.find({
      where: {
        student: id,
        statusBayar: true,
      },
      relations: ['student'],
      order: {
        tglTagihan: 'ASC',
      },
    });
    return payments;
  }

  async updateDendatonol(data) {
    const payment = await this.paymentRepository.update(data.id, {
      // statusBayar: true,
      // caraBayar: 'BCA VA',
      // tanggalBayar: tanggal,
      jumlahDenda: 0,
    });
    return payment;
  }

  async paymentsViaBca(data, tanggal) {
    let pembayaran = data;
    const formatTanggal = data.tanggalTransaksi.split('/');
    pembayaran.tanggalTransaksi = `20${formatTanggal[2]}-${formatTanggal[1]}-${formatTanggal[0]}`;
    const payments = await this.paymentRepository
      .createQueryBuilder('payments')
      .orderBy('payments.tglTagihan', 'ASC')
      .where('payments.vBcaKode =:vBca', { vBca: data.vBcaKode })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
      .getMany();
    // const payments = await this.paymentRepository.find({
    //   where: {
    //     vBcaKode: data.vBcaKode,
    //   },
    //   relations: ['student'],
    // });

    let isNotEnough = false;
    await payments.map(async (payment) => {
      // this.updateDendatonol(payment);
      if (isNotEnough) return;
      const totalCost = payment.jumlahTagihan + payment.jumlahDenda;
      if (payment.statusBayar === false) {
        if (pembayaran.totalPembayaran >= totalCost) {
          pembayaran.totalPembayaran -= Number(totalCost);
          await this.updateStatus(payment, pembayaran.tanggalTransaksi, true);
        } else {
          isNotEnough = true;
          return;
        }
      } else if (payment.statusBayar === true) {
        return;
      }
    });
    // let isNotEnough = false;
    // console.log(payments.length);
    // await payments.map(async (payment) => {
    //   if (isNotEnough) return;
    //   const totalCost = payment.jumlahTagihan + payment.jumlahDenda;
    //   if (payment.statusBayar === false) {
    //     if (pembayaran.totalPembayaran >= totalCost) {
    //       if (
    //         new Date(pembayaran.tanggalTransaksi) <=
    //         new Date(tanggal.split('T')[0])
    //       ) {
    //         pembayaran.totalPembayaran -= Number(totalCost);
    //         console.log(pembayaran);
    //         // await this.updateStatus(
    //         //   payment,
    //         //   pembayaran.tanggalTransaksi,
    //         //   false,
    //         // );
    //       } else {
    //         console.log('lebig tanggla');
    //         // pembayaran.totalPembayaran -= Number(
    //         //   payment.jumlahTagihan + payment.jumlahDenda,
    //         // );
    //         // await this.updateStatus(payment, pembayaran.tanggalTransaksi, true);
    //       }
    //     } else {
    //       isNotEnough = true;
    //       console.log('duit ga cukup', pembayaran.totalPembayaran, totalCost);
    //       return;
    //     }
    //   } else if (payment.statusBayar === true) {
    //     return;
    //   }
    // });

    // function sortByDate(a, b) {
    //   if (new Date(a.bulanIuran) > new Date(b.bulanIuran)) {
    //     return 1;
    //   }
    //   if (new Date(a.bulanIuran) < new Date(b.bulanIuran)) {
    //     return -1;
    //   }
    //   return 0;
    // }
    // const sorted = payments.sort(sortByDate);
    // await sorted.map(async (data) => {
    //   if (data.statusBayar === false) {
    //     if (data.jumlahTagihan <= pembayaran.totalPembayaran) {
    //       pembayaran.totalPembayaran -= Number(data.jumlahTagihan);
    //       await this.updateStatus(data);
    //       console.log(data.jumlahTagihan, pembayaran.totalPembayaran);
    //     } else {
    //       return;
    //     }
    //   } else if (data.statusBayar === true) {
    //     return;
    //   }
    // });
    return payments;
  }

  async updateStatusBayarTunai(data, tanggal, tipe, kodeTransaksi) {
    const payment = await this.paymentRepository.update(data, {
      statusBayar: true,
      caraBayar: tipe,
      tanggalBayar: tanggal,
      kodeTransaksi: kodeTransaksi,
    });
    return payment;
  }

  async updateStatus(data, tanggal, denda) {
    const payment = await this.paymentRepository.update(data.id, {
      statusBayar: true,
      caraBayar: 'BCA VA',
      tanggalBayar: tanggal,
      jumlahDenda: denda === false ? 0 : data.jumlahDenda,
    });
    return payment;
  }

  async batalPaymentStatus(id) {
    const payment = await this.paymentRepository.update(id, {
      statusBayar: false,
      caraBayar: '',
      tanggalBayar: '',
    });
    return payment;
  }
  async cekgabayar() {
    const payment = await this.paymentRepository.find({
      statusBayar: false,
      period: 'Tahun Ajaran 2023/2024',
      unit: 'SMA PAX PATRIAE',
    });
    return payment;
  }

  async remove(id) {
    const payment = await this.paymentRepository.delete(id);
    return payment;
  }

  async updatePaymentUangSekolah(id, data) {
    const payments = await this.paymentRepository
      .createQueryBuilder('payments')
      .update({ jumlahTagihan: Number(data.uangSekolah) })
      .where('payments.studentId =:id', { id })
      .andWhere('payments.iuran =:iuran', { iuran: 'Uang Sekolah' })
      .andWhere('payments.period =:period', { period: data.period })
      .execute();

    return payments;
  }

  async updateUangKegiatan(id, data) {
    const payments = await this.paymentRepository
      .createQueryBuilder('payments')
      .update({ jumlahTagihan: Number(data.uangKegiatan) })
      .where('payments.id =:id', { id: data.paymentId })
      .andWhere('payments.studentId =:studentId', { studentId: id })
      .andWhere('payments.iuran=:type', { type: 'Uang Kegiatan' })
      .andWhere('payments.period =:period', { period: data.period })
      .execute();

    return payments;
  }

  async groupByTahunAjaran(id) {
    const payments = await this.paymentRepository.find({
      where: {
        student: id,
      },
      relations: ['student'],
      order: {
        tglTagihan: 'ASC',
      },
    });
    let newObject = {};
    const result = payments.map((payment) => {
      let tahunAjaran = payment.period.trim();

      if (newObject[tahunAjaran] === undefined) {
        newObject[tahunAjaran] = [];
        newObject[tahunAjaran].push(payment);
      } else {
        newObject[tahunAjaran].push(payment);
      }
    });
    return newObject;
  }

  async removeAll(id) {
    const payment = await this.paymentRepository.find({ student: id });
    return payment;
  }

  async hitungDenda(id) {
    const payment = await this.paymentRepository
      .createQueryBuilder('payments')
      .leftJoinAndSelect('payments.student', 'student')
      .where('student.id =:id', { id })
      .andWhere('payments.iuran =:iuran', { iuran: 'Uang Sekolah' })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
      .andWhere('payments.tglDenda >=:startDate', {
        startDate: `2023-1-1`,
      })
      .andWhere('payments.tglDenda <=:nowDate', {
        nowDate: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      })
      .getMany();
    return {
      uangDenda: findNthTerm(25000, 25000, payment.length),
      // statusDenda: payment[0].student.dendaActive,
    };
  }

  async hitungDendaperBulan(detail, jumlah) {
    const payment = Promise.resolve(
      //@ts-ignore
      await this.paymentRepository.update(detail.id, {
        jumlahDenda: detail.jumlahDenda + 25000,
      }),
    );
    return payment;
  }

  async updateUangDenda(id) {
    const payment = await this.paymentRepository
      .createQueryBuilder('payments')
      .leftJoinAndSelect('payments.student', 'student')
      .where('student.id =:id', { id })
      .andWhere('payments.iuran =:iuran', { iuran: 'Uang Sekolah' })
      .andWhere('payments.statusBayar =:statusBayar', { statusBayar: false })
      .andWhere('payments.tglDenda >=:startDate', {
        startDate: `2024-1-1`,
      })
      .andWhere('payments.tglDenda <=:nowDate', {
        nowDate: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      })
      .orderBy('payments.tglDenda', 'DESC')
      .getMany();
    for (let i = payment.length; i >= 1; i--) {
      await this.hitungDendaperBulan(payment[i - 1], i);
    }
    return payment;
  }

  async createFile() {
    const payment = await this.paymentRepository
      .createQueryBuilder('payments')
      .leftJoinAndSelect('payments.student', 'student')
      .orderBy('student.id', 'ASC')
      .where('payments.statusBayar =:statusBayar', { statusBayar: false })
      .andWhere('payments.tglTagihan <=:nowDate', {
        nowDate: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      })
      // .andWhere('payments.tglTagihan <=:nowDate', {
      //   nowDate: new Date(`2022-6-25`),
      // })
      .addOrderBy('payments.tglTagihan', 'ASC')
      .getMany();

    return payment;
  }

  async hitungProfit() {
    const payment = await this.paymentRepository
      .createQueryBuilder('payments')
      .leftJoinAndSelect('payments.student', 'student')
      // .orderBy('student.id', 'ASC')
      .where('payments.statusBayar =:statusBayar', { statusBayar: true })
      .andWhere('payments.iuran =:iuran', { iuran: 'Uang Ujian' })
      .andWhere('payments.tanggalBayar >= :startDate', {
        startDate: new Date('2023-01-01'),
      })
      .andWhere('payments.tanggalBayar <= :endDate', {
        endDate: new Date('2023-12-31'),
      })
      .addOrderBy('payments.tglDenda', 'ASC')
      .getMany();
    console.log(payment.length, 'uang kegiatan');
    return payment;
  }

  async income(data) {
    const payment = await this.paymentRepository
      .createQueryBuilder('payments')
      .leftJoinAndSelect('payments.student', 'student')
      .orderBy('student.id', 'ASC')
      .where('payments.statusBayar =:statusBayar', { statusBayar: true })
      // .andWhere('payments.caraBayar =:caraBayar', { caraBayar: 'BCA VA' })
      .andWhere('payments.tanggalBayar >= :startDate', {
        startDate: data.start_date,
      })
      .andWhere('payments.tanggalBayar <= :endDate', { endDate: data.end_date })
      .addOrderBy('payments.tglDenda', 'ASC')
      .getMany();

    return payment;
  }

  async updatePaymentById(data) {
    try {
      const { jumlahTagihan, jumlahDenda, jumlahBayar } = data.amount;
      let hasilUbah: any = {};

      if (
        (jumlahDenda === undefined || jumlahDenda === '') &&
        (jumlahBayar === undefined || jumlahBayar === '') &&
        (jumlahTagihan !== undefined || jumlahTagihan !== '')
      ) {
        hasilUbah.jumlahTagihan = data.amount.jumlahTagihan;
      } else if (
        (jumlahDenda !== undefined || jumlahDenda !== '') &&
        (jumlahBayar === undefined || jumlahBayar === '') &&
        (jumlahTagihan === undefined || jumlahTagihan === '')
      ) {
        hasilUbah.jumlahDenda = data.amount.jumlahDenda;
      } else if (
        (jumlahDenda === undefined || jumlahDenda === '') &&
        (jumlahBayar !== undefined || jumlahBayar !== '') &&
        (jumlahTagihan === undefined || jumlahTagihan === '')
      ) {
        hasilUbah.jumlahBayar = data.amount.jumlahBayar;
      } else if (
        jumlahDenda !== undefined &&
        jumlahTagihan !== undefined &&
        jumlahBayar !== undefined &&
        jumlahDenda !== '' &&
        jumlahTagihan !== '' &&
        jumlahBayar !== 's'
      ) {
        hasilUbah.jumlahDenda = data.amount.jumlahDenda;
        hasilUbah.jumlahTagihan = data.amount.jumlahTagihan;
        hasilUbah.jumlahTagihan = data.amount.jumlahBayar;
      }
      const payment = await this.paymentRepository.update(data.id, hasilUbah);
      return payment;
    } catch (error) {
      return 'Any Error';
    }
  }

  async penguranganJumlahTagihan(data) {
    try {
      const entityManager = getManager();
      const result = await entityManager.query(
        `UPDATE payments SET jumlahTagihan=(jumlahTagihan-${data.Jumlah}) where studentId='${data.studentID}' and bulanIuran='2023-4' and iuran='Uang Sekolah'`,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async ubahJumlahTagihan(data) {
    try {
      const entityManager = getManager();
      const result = await entityManager.query(
        `UPDATE payments SET jumlahTagihan='${data.Jumlah}' where studentId='${data.studentID}' and bulanIuran='2023-4' and iuran='Uang Sekolah'`,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
