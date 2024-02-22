import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 10, description: 'Limit of items' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @Field(() => Int, { defaultValue: 0, description: 'Offset of items' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number = 0;
}
