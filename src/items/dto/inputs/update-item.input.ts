import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID, { description: 'Unique identifier of the item' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
