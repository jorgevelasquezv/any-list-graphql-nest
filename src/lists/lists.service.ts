import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateListInput, UpdateListInput } from './dto';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListsService {
  private readonly logger = new Logger(ListsService.name);

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    try {
      const list = this.listRepository.create({
        ...createListInput,
        user,
      });
      return await this.listRepository.save(list);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where('"userId" = :userId', { userId: user.id });

    if (search)
      queryBuilder.andWhere('LOWER(name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    try {
      return await this.listRepository.findOneByOrFail({ id, user });
    } catch (error) {
      throw new NotFoundException(`List #${id} not found`);
    }
  }

  async update(updateListInput: UpdateListInput, user: User): Promise<List> {
    const { id, ...data } = updateListInput;

    if (!id) throw new BadRequestException('List id not provided');

    try {
      const list = await this.findOne(id, user);
      return await this.listRepository.save({ ...list, ...data, user });
    } catch (error) {
      this.handleBDErrors(error);
    }
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);

    await this.listRepository.delete(id);

    return list;
  }

  async listCountByUser(user: User): Promise<number> {
    const count = await this.listRepository.count({
      where: { user: { id: user.id } },
    });
    return count;
  }

  private handleBDErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error ocurred, check the logs for more information.',
    );
  }
}
