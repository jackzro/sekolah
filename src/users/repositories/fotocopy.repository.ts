import { EntityRepository, Repository } from 'typeorm';
import { Fotocopy } from '../entities/fotocopy.entity';

@EntityRepository(Fotocopy)
export class FotocopyRepository extends Repository<Fotocopy> {}
