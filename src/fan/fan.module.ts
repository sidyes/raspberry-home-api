import { Module } from "@nestjs/common";
import { FanController } from "./fan.controller";
import { FanService } from "./fan.service";
import { RfCommunicationModule } from "src/rf-communication/rf-communication.module";
import { StorageModule } from "src/storage/storage.module";

@Module({
  imports: [RfCommunicationModule, StorageModule],
  controllers: [FanController],
  providers: [FanService],
})
export class FanModule {}
