import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('items')
@ObjectType()
export class Item {
  @Field(() => ID, { description: 'Unique identifier of the item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Name of the item' })
  @Column()
  name: string;

  @Field(() => String, { description: 'Units of the quantity', nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;

  @Field(() => User, { description: 'User who created the item' })
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('user_id_index')
  user: User;
}
