import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/users.repository';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { FotocopyController } from './fotocopy.controller';
import { FotocopyRepository } from './repositories/fotocopy.repository';
import { FotocopyService } from './fotocopy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, FotocopyRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, FotocopyController],
  providers: [UsersService, AuthService, FotocopyService],
  exports: [UsersService],
})
export class UsersModule {}
