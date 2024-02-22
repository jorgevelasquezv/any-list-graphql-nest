import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Int, { description: 'Quantity of the item', nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, { description: 'Item is completed', nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field(() => ID, { description: 'Item ID' })
  @IsUUID()
  itemId: string;

  @Field(() => ID, { description: 'List ID' })
  @IsUUID()
  listId: string;
}
