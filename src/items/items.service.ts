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

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    try {
      const item: Item = this.itemRepository.create({
        ...createItemInput,
      });
      await this.itemRepository.save(item);
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item: Item = await this.itemRepository.findOne({
      where: {
        id,
      },
    });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);

    return item;
  }

  async update(updateItemInput: UpdateItemInput): Promise<Item> {
    const { id } = updateItemInput;

    if (!id) throw new BadRequestException('ID is required');

    try {
      const item = await this.itemRepository.preload(updateItemInput);
      if (!item) throw new NotFoundException(`Item with ID ${id} not found`);
      return await this.itemRepository.save(item);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<DeleteResponse> {
    await this.findOne(id);

    const { affected } = await this.itemRepository.delete(id);
    if (affected !== 1) throw new InternalServerErrorException('Not deleted');
    return {
      message: `Item with ID ${id} deleted successfully`,
      status: 'ok',
    };
  }
}
