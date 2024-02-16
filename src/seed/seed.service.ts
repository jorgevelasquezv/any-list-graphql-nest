import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Item } from '../items/entities';
import { User } from '../users/entities/user.entity';
import { ItemsService } from '../items/items.service';
import { UsersService } from '../users/users.service';

import { SEED_USERS, SEED_ITEMS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProduction: boolean;
  constructor(
    private readonly configServices: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly userService: UsersService,
    private readonly itemService: ItemsService,
  ) {
    this.isProduction = this.configServices.get('STATE') === 'prod';
  }

  async seed(): Promise<boolean> {
    if (this.isProduction)
      throw new UnauthorizedException('Not allowed in production');

    await this.deleteDataBase();

    const users: User[] = await this.loadUsers();

    await this.loadItems(users);

    return true;
  }

  private async deleteDataBase() {
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
}
