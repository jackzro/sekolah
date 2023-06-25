import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepository } from './repositories/students.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentRepository, PaymentRepository])],
  controllers: [StudentsController, PaymentsController],
  providers: [StudentsService, PaymentsService],
})
export class StudentsModule {}
