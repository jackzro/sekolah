import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Deposit } from './entities/deposit.entity';
import { DepositRepository } from './repositories/deposits.repository';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(DepositRepository)
    private depositRepository: DepositRepository,
  ) {}

  create(createDepositDto) {
    const deposit = new Deposit();
    deposit.txid = createDepositDto.txid;
    deposit.tanggalDeposit = createDepositDto.tanggalDeposit;
    deposit.save();
    return 'This action adds a new deposit';
  }

  findAll() {
    return `This action returns all deposits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deposit`;
  }

  update(id: number, updateDepositDto: UpdateDepositDto) {
    return `This action updates a #${id} deposit`;
  }

  remove(id: number) {
    return `This action removes a #${id} deposit`;
  }
}
