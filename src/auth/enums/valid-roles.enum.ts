import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_USER = 'super-user',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Valid roles for users',
});
