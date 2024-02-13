import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
@ObjectType()
export class Item {
  @Field(() => ID, { description: 'Unique identifier of the item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Name of the item' })
  @Column()
  name: string;

  @Field(() => Float, { description: 'Quantity of the item' })
  @Column()
  quantity: number;

  @Field(() => String, { description: 'Units of the quantity', nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;
}
