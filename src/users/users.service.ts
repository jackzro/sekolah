import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const data = new User();
    data.username = createUserDto.username;
    data.email = createUserDto.email;
    data.password = createUserDto.password;
    data.role = createUserDto.role;

    return await data.save();
  }

  async internalFindOne(userLogin) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userLogin.email })
      .addSelect('user.password')
      .getOne();
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
