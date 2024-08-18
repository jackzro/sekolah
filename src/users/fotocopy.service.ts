import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FotocopyRepository } from './repositories/fotocopy.repository';
import { Fotocopy } from './entities/fotocopy.entity';

@Injectable()
export class FotocopyService {
  constructor(
    @InjectRepository(FotocopyRepository)
    private FotoCopyRepository: FotocopyRepository,
  ) {}

  async addNewFotocopy(data) {
    const newFotocopy = new Fotocopy();
    newFotocopy.tanggalFotocopy = data.tanggalFotocopy;
    newFotocopy.jumlah = data.jumlahFotocopy;
    newFotocopy.keperluan = data.keperluan;
    newFotocopy.user = data.userId;
    return await newFotocopy.save();
  }

  async deleteFotocopy(id) {
    const fotocopy = await this.FotoCopyRepository.delete(id);
    return fotocopy;
  }

  async getAllFotocopy() {
    return await this.FotoCopyRepository.find({});
  }

  async editFotocopy(data) {
    return await this.FotoCopyRepository.update(data.id, {
      jumlah: data.jumlahFotocopy,
      keperluan: data.keperluan,
      tanggalFotocopy: new Date(data.tanggalFotocopy),
    });
  }
}
