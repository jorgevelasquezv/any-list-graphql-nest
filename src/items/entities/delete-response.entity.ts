import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteResponse {
  @Field(() => String, { description: 'Message of the response' })
  message: string;

  @Field(() => String, { description: 'Status of the response' })
  status: string;
}
