import { Args, Query, Resolver } from '@nestjs/graphql';

import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user' })
  user(@Args('id') id: number) {
    return this.userService.findByID(id);
  }
}
