import { Injectable, NotFoundException } from "@nestjs/common";
import { LocalStorage } from "node-persist";
import { Device, Sequence } from "src/shared/models";
import { DeviceType } from "src/shared/models/device-type.enum";

@Injectable()
export class StorageService {
  storage: LocalStorage = require("node-persist");

  async init(): Promise<void> {
    await this.storage.init({
      dir: "assets",
      encoding: "utf8",
      forgiveParseErrors: true,
      expiredInterval: undefined,
    });

    console.log("Storage loaded");
  }

  async getCommandSequence(
    deviceType: DeviceType,
    deviceId: number,
    cmd: string
  ): Promise<Sequence[]> {
    const devices: Device[] = await this.storage.getItem(deviceType);

    if (!devices) {
      throw new NotFoundException(`No devices of type ${deviceType} found.`);
    }

    var device = devices.find((entry) => entry.id === deviceId);

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found.`);
    }

    const commandSequence = device.commands?.find(
      (command) => command.name == cmd
    );

    if (!commandSequence) {
      throw new NotFoundException(
        `Command ${cmd} for device ${deviceId} (${deviceType}) not found.`
      );
    }

    return commandSequence.sequence;
  }
}
