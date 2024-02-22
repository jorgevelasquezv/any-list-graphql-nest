import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field(() => String, { description: 'Name of the list' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
