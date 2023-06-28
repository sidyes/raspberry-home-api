import { Module } from "@nestjs/common";
import { FanController } from "./fan.controller";
import { FanService } from "./fan.service";
import { RfCommunicationModule } from "src/rf-communication/rf-communication.module";

@Module({
  imports: [RfCommunicationModule],
  controllers: [FanController],
  providers: [FanService],
})
export class FanModule {}
