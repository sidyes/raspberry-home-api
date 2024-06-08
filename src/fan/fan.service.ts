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
        id: 0,
        location: "Bedroom",
      },
    ];
  }

  async startNightMode(id: number): Promise<string> {
    this.beginNightMode(id);

    return Promise.resolve("Night mode successfully started.");
  }

  async sendCommand(id: number, cmd: FanCommand): Promise<string> {
    // get command sequence from storage
    const commandSequence = await this.storageService.getCommandSequence(
      DeviceType.FAN,
      id,
      cmd
    );

    return this.rfCommunicationService.sendCommand(commandSequence);
  }

  private async beginNightMode(id: number): Promise<void> {
    const hours = 7;

    const startSpeed1 = await this.storageService.getCommandSequence(
      DeviceType.FAN,
      id,
      FanCommand.SPEED_1
    );

    const stop = await this.storageService.getCommandSequence(
      DeviceType.FAN,
      id,
      FanCommand.ON_OFF
    );

    for (let i = 0; i < hours; i++) {
      console.log(
        `Night mode: starting fan ${id} with speed ${FanCommand.SPEED_1} (${
          i + 1
        })`
      );
      this.rfCommunicationService.sendCommand(startSpeed1);

      // let fan run for 5 min
      await this.delay(300000);
      console.log(`Night mode: stopping fan ${id} (${i + 1})`);
      this.rfCommunicationService.sendCommand(stop);

      // pause for 55 minutes
      await this.delay(3300000);
    }

    console.log(`Night mode complete. Good morning!`);
  }

  // Utility function to pause execution for a specified amount of time
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
