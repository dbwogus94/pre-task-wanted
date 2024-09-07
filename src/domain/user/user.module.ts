import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService, UserServiceUseCase } from './user.service';
import { UserRepository, UserRepositoryPort } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: UserServiceUseCase,
      useClass: UserService,
    },
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
  ],
  exports: [UserRepositoryPort],
})
export class UserModule {}
