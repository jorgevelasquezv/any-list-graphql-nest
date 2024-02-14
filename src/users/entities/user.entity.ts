import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID, { description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'User full name' })
  @Column({ name: 'full_name' })
  fullName: string;

  @Field(() => String, { description: 'User email' })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => [String], { description: 'User roles' })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @Field(() => Boolean, { description: 'User is blocked' })
  @Column({ type: 'boolean', default: false, name: 'is_blocked' })
  isBlocked: boolean;
}