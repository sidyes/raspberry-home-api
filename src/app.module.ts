import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { FanModule } from "./fan/fan.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    FanModule
  ],
})
export class AppModule {}
