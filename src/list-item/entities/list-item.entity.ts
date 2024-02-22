import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities';
import { List } from '../../lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('list_items')
@ObjectType()
export class ListItem {
  @Field(() => ID, { description: 'Unique identifier of the list item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Number, { description: 'Quantity of the item' })
  @Column({ name: 'quantity' })
  quantity: number;

  @Field(() => Boolean, { description: 'Item is completed' })
  @Column({ type: 'boolean', default: false, name: 'is_completed' })
  completed: boolean;

  @Field(() => List, { description: 'List' })
  @ManyToOne(() => List, (list) => list.listItems, {
    nullable: false,
    lazy: true,
  })
  list: List;

  @Field(() => Item, { description: 'Items' })
  @ManyToOne(() => Item, (item) => item.listItems, {
    nullable: false,
    lazy: true,
  })
  item: Item;
}
