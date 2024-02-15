import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Repository } from 'typeorm';
import { Item, DeleteResponse } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(
    createItemInput: CreateItemInput,
    userAdmin: User,
  ): Promise<Item> {
    try {
      const item: Item = this.itemRepository.create({
        ...createItemInput,
        user: userAdmin,
      });
      await this.itemRepository.save(item);
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll(user: User): Promise<Item[]> {
    return this.itemRepository.find({ where: { user } });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item: Item = await this.itemRepository.findOne({
      where: {
        id,
        user,
      },
    });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);

    return item;
  }

  async update(updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    const { id } = updateItemInput;

    if (!id) throw new BadRequestException('ID is required');

    try {
      const item = await this.findOne(id, user);
      if (!item) throw new NotFoundException(`Item with ID ${id} not found`);
      return await this.itemRepository.save({
        ...item,
        ...updateItemInput,
        user,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, user: User): Promise<DeleteResponse> {
    await this.findOne(id, user);

    const { affected } = await this.itemRepository.delete(id);
    if (affected !== 1) throw new InternalServerErrorException('Not deleted');
    return {
      message: `Item with ID ${id} deleted successfully`,
      status: 'ok',
    };
  }

  async itemCountByUser(user: User): Promise<number> {
    const count = await this.itemRepository.count({
      where: { user: { id: user.id } },
    });
    return count;
  }
}
