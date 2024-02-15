import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ItemsModule],
  providers: [UsersResolver, UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
