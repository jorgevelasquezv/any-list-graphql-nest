import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'User email' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}
