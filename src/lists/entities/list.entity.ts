import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity('lists')
@ObjectType()
export class List {
  @Field(() => ID, { description: 'Unique identifier of the list' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Name of the list' })
  @Column({ name: 'name' })
  name: string;

  @Field(() => User, { description: 'User who created the list' })
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('user_id_list_index')
  user: User;

  // @Field(() => [ListItem], { description: 'List items' })
  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  listItems: ListItem[];
}
