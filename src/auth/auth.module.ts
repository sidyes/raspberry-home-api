import { Module } from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { HeaderApiKeyStrategy } from './auth-header-api-key.strategy';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [HeaderApiKeyStrategy, {
    provide: APP_GUARD,
    useClass: AuthGuard('api-key')
  }],
})
export class AuthModule {}