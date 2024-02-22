import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities';
import { List } from '../../lists/entities/list.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID, { description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'User full name' })
  @Column({ name: 'full_name' })
  fullName: string;

  @Field(() => String, { description: 'User email' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => [String], { description: 'User roles' })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @Field(() => Boolean, { description: 'User is blocked' })
  @Column({ type: 'boolean', default: false, name: 'is_blocked' })
  isBlocked: boolean;

  @Field(() => User, {
    nullable: true,
    description: 'User who update the record',
  })
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'last_update_by' })
  lastUpdateBy?: User;

  // @Field(() => [Item], { description: 'User items' })
  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  items: Item[];

  @OneToMany(() => List, (list) => list.user)
  lists: List[];
}
