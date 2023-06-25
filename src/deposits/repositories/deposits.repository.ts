import { EntityRepository, Repository } from 'typeorm';
import { Deposit } from '../entities/deposit.entity';

@EntityRepository(Deposit)
export class DepositRepository extends Repository<Deposit> {}
