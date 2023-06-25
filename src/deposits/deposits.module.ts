import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositRepository } from './repositories/deposits.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DepositRepository])],
  controllers: [DepositsController],
  providers: [DepositsService],
})
export class DepositsModule {}
