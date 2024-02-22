import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Item } from '../items/entities';
import { User } from '../users/entities/user.entity';
import { ItemsService } from '../items/items.service';
import { UsersService } from '../users/users.service';

import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';
import { List } from 'src/lists/entities/list.entity';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {
  private isProduction: boolean;
  constructor(
    private readonly configServices: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    private readonly userService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listService: ListsService,
    private readonly listItemService: ListItemService,
  ) {
    this.isProduction = this.configServices.get('STATE') === 'prod';
  }

  async seed(): Promise<boolean> {
    if (this.isProduction)
      throw new UnauthorizedException('Not allowed in production');

    await this.deleteDataBase();

    const users: User[] = await this.loadUsers();

    await this.loadItems(users);

    const lists = await this.loadLists(users);

    await this.loadListItems(lists, users);

    return true;
  }

  private async deleteDataBase() {
    await this.listItemRepository.delete({});

    await this.listRepository.delete({});

    await this.itemRepository.delete({});

    await this.userRepository.delete({});
  }

  private async loadUsers(): Promise<User[]> {
    const users: User[] = [];
    for (const user of SEED_USERS) {
      const newUser: User = await this.userService.create(user);
      users.push(newUser);
    }
    return users;
  }

  private async loadItems(users: User[]): Promise<void> {
    for (const user of users) {
      await Promise.all(
        SEED_ITEMS.map((item) => this.itemService.create(item, user)),
      );
    }
  }

  private async loadLists(users: User[]): Promise<List[]> {
    const Lists: List[] = [];
    for (const user of users) {
      for (const list of SEED_LISTS) {
        const newList: List = await this.listService.create(list, user);
        Lists.push(newList);
      }
    }
    return Lists;
  }

  private async loadListItems(lists: List[], users: User[]): Promise<void> {
    for (const user of users) {
      const items = await this.itemService.findAll(
        user,
        { limit: 10, offset: 0 },
        {},
      );
      for (const list of lists) {
        await Promise.all(
          items.map((item) =>
            this.listItemService.create({
              completed: Math.random() > 0.5 ? true : false,
              itemId: item.id,
              listId: list.id,
              quantity: Math.floor(Math.random() * 10) + 1,
            }),
          ),
        );
      }
    }
  }
}
