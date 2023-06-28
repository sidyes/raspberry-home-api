import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { RfCommunicationModule } from "./rf-communication/rf-communication.module";
import { FanModule } from "./fan/fan.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    RfCommunicationModule,
    FanModule,
  ],
})
export class AppModule {}
