import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchArgs {
  @Field(() => String, { description: 'Search term', nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
