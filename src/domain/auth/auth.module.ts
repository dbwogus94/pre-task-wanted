import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService, AuthServiceUseCase } from './auth.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [JwtModule, UserModule],
  providers: [
    {
      provide: AuthServiceUseCase,
      useClass: AuthService,
    },
  ],
  exports: [AuthServiceUseCase],
})
export class AuthModule {}
