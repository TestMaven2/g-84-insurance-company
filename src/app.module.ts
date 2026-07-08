import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { PoliciesModule } from './policies/policies.module';

@Module({
  imports: [UsersModule, CarsModule, PoliciesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
