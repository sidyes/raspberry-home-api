import { Injectable } from "@nestjs/common";
import { Fan } from "./models/fan.model";
import { FanCommand } from "./models";
import { RfCommunicationService } from "src/rf-communication/rf-communication.service";

@Injectable()
export class FanService {
  constructor(
    private readonly rfCommunicationService: RfCommunicationService
  ) {}

  getAvailableFans(): Fan[] {
    return [
      {
        id: 1,
        location: "Sample",
      },
    ];
  }

  sendCommand(id: number, cmd: FanCommand): string {
    return this.rfCommunicationService.sendCommand("XX");
  }
}
