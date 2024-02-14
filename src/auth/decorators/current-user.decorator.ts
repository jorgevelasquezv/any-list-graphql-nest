import {
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user)
      throw new InternalServerErrorException(
        'No user found in request context - AuthGuard is required',
      );

    if (
      roles.length > 0 &&
      !user.roles
        .map((role) => role as ValidRoles)
        .some((role) => roles.includes(role))
    )
      throw new UnauthorizedException(
        `User ${user.fullName} does not have the required role(s) ${roles.join(', ')}`,
      );

    return user;
  },
);
