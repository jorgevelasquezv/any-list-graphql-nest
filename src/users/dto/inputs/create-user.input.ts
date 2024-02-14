import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'User email' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => String, { description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}
