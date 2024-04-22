import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('income')
  async countIncome(@Body() data) {
    return await this.paymentsService.income(data);
  }

  @Get(':id')
  async hitungDenda(@Param() id) {
    const data = await this.paymentsService.hitungDenda(id.id);
    return data;
  }

  @Post('/updateJumlahTagihan')
  async updateJumlahTagihan(@Body() data) {
    try {
      data.result.map(async (student) => {
        await this.paymentsService.ubahJumlahTagihan(student);
      });
      return `Update Jumlah Tagihan is finished`;
    } catch (error) {
      throw error;
    }
  }

  @Post(':id')
  async updatePaymentById(@Body() data) {
    return await this.paymentsService.updatePaymentById(data);
  }
}
