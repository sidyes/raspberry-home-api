import { Injectable } from "@nestjs/common";
import { Fan } from "./models/fan.model";
import { FanCommand } from "./models";
import { RfCommunicationService } from "src/rf-communication/rf-communication.service";
import { StorageService } from "src/storage/storage.service";
import { DeviceType } from "src/shared/models/device-type.enum";

@Injectable()
export class FanService {
  constructor(
    private readonly rfCommunicationService: RfCommunicationService,
    private readonly storageService: StorageService
  ) {}

  getAvailableFans(): Fan[] {
    return [
      {
        id: 1,
        location: "Sample",
      },
    ];
  }

  async sendCommand(id: number, cmd: FanCommand): Promise<string> {   
    // get command sequence from storage
    const commandSequence = await this.storageService.getCommandSequence(DeviceType.FAN, id, cmd);

    return this.rfCommunicationService.sendCommand(commandSequence);
  }
}
