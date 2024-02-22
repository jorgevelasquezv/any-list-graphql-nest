import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UpdateUserInput } from './dto/inputs';
import { User } from './entities/user.entity';
import { RegisterInput } from '../auth/dto/inputs/register.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(registerInput: RegisterInput): Promise<User> {
    try {
      const { password, ...registerData } = registerInput;
      const user = this.userRepository.create({
        ...registerData,
        password: bcrypt.hashSync(password, 10),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleBDErrors(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.userRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (roles.length > 0)
      // return this.userRepository.find({
      //   // relations: ['lastUpdateBy'], No es necesario por que se tiene la propiedad lazy en el campo lastUpdateBy
      //   take: limit,
      //   skip: offset,
      // });
      queryBuilder
        .where('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles);

    if (search)
      queryBuilder.andWhere('LOWER(full_name) LIKE :search', {
        search: `%${search.toLocaleLowerCase()}%`,
      });

    return queryBuilder.getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not fount`);
    }
  }

  async findOneByID(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not fount`);
    }
  }

  async update(
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    try {
      const { password } = updateUserInput;

      if (password) updateUserInput.password = bcrypt.hashSync(password, 10);

      const user = await this.userRepository.preload({
        ...updateUserInput,
      });

      user.lastUpdateBy = adminUser;

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleBDErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneByID(id);
    userToBlock.isBlocked = true;
    userToBlock.lastUpdateBy = adminUser;
    return await this.userRepository.save(userToBlock);
  }

  private handleBDErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error ocurred, check the logs for more information.',
    );
  }
}
