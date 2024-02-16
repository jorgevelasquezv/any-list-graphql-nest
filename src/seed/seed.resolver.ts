import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, { name: 'seed', description: 'Seed the database' })
  async executeSeed(): Promise<boolean> {
    await this.seedService.seed();
    return true;
  }
}
