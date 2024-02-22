import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { ListsModule } from 'src/lists/lists.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule,
    ListsModule,
    ListItemModule,
  ],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
