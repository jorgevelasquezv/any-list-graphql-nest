import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Name of the item' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Field(() => Float, { description: 'Quantity of the item' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Field(() => String, { description: 'Units of the quantity', nullable: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  @IsOptional()
  quantityUnits?: string;
}
