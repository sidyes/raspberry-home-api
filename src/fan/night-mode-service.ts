import { Injectable, Logger } from "@nestjs/common";
import { RfCommunicationService } from "src/rf-communication/rf-communication.service";
import { DeviceType } from "src/shared/models";
import { StorageService } from "src/storage/storage.service";
import { FanCommand } from "./models";

interface NightModeState {
  isRunning: boolean;
  cancel: () => void;
}

@Injectable()
export class NightModeService {
  private nightModeStates: Map<number, NightModeState> = new Map();

  constructor(
    private readonly rfCommunicationService: RfCommunicationService,
    private readonly storageService: StorageService
  ) {}

  public async cancelNightMode(id: number): Promise<void> {
    const currentState = this.nightModeStates.get(id);
    if (currentState?.isRunning) {
      Logger.log(
        `Night mode is already running for device ID: ${id}. Stopping it...`
      );
      currentState.cancel();
    }
  }

  public async startNightMode(id: number, cmd: FanCommand): Promise<void> {
    this.cancelNightMode(id);

    if (cmd === FanCommand.NIGHT_MODE_1) {
      await this.runNightMode1(id);
    } else if (cmd === FanCommand.NIGHT_MODE_2) {
      await this.runNightMode2(id);
    }
  }

  async isNightModeRunning(id: number): Promise<boolean> {
    const currentState = this.nightModeStates.get(id);
    return currentState?.isRunning ?? false;
  }

  private async runNightMode1(id: number): Promise<void> {
    try {
      Logger.log(`Starting night mode for device ID ${id}.`);
      await this.runNightMode(id, 7, 600000, 3000000);
      Logger.log(`Night mode completed for device ID ${id}.`);
    } catch (error) {
      this.handleNightModeError(error, id);
    } finally {
      this.resetNightModeState(id);
    }
  }

  private async runNightMode2(id: number): Promise<void> {
    try {
      Logger.log(`Starting night mode for device ID ${id}.`);
      const cancelPromise = this.createCancelPromise(id);
      await this.runFanForDuration(id, 1800000, cancelPromise);
      await Promise.race([this.delay(this.getDelayUntilNext530AM()), cancelPromise]);
      await this.runFanAt530AM(id, cancelPromise);
    } catch (error) {
      this.handleNightModeError(error, id);
    } finally {
      this.resetNightModeState(id);
    }
  }

  private async runNightMode(
    id: number,
    hours: number,
    fanRuntime: number,
    pauseDuration: number
  ): Promise<void> {
    const cancelPromise = this.createCancelPromise(id);

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
      Logger.log(
        `Night mode: starting fan ${id} with speed ${FanCommand.SPEED_1} (${
          i + 1
        })`
      );
      this.rfCommunicationService.sendCommand(startSpeed1);

      await Promise.race([this.delay(fanRuntime), cancelPromise]);
      Logger.log(`Night mode: stopping fan ${id} (${i + 1})`);
      this.rfCommunicationService.sendCommand(stop);

      await Promise.race([this.delay(pauseDuration), cancelPromise]);
    }
  }

  private async runFanForDuration(id: number, duration: number, cancelPromise: Promise<void>): Promise<void> {
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

    Logger.log(
      `Night mode: starting fan ${id} with speed ${FanCommand.SPEED_1}`
    );
    this.rfCommunicationService.sendCommand(startSpeed1);
    await Promise.race([this.delay(duration), cancelPromise]);
    Logger.log(`Night mode: stopping fan ${id}`);
    this.rfCommunicationService.sendCommand(stop);
  }

  private async runFanAt530AM(id: number, cancelPromise: Promise<void>): Promise<void> {
    const startSpeed1 = await this.storageService.getCommandSequence(
      DeviceType.FAN,
      id,
      FanCommand.SPEED_1
    );

    Logger.log(`Night mode: waiting until next 5:30 AM`);
    await Promise.race([
      this.delay(this.getDelayUntilNext530AM()),
      cancelPromise,
    ]);

    Logger.log(
      `Night mode: starting fan ${id} with speed ${FanCommand.SPEED_1} at 5:30 AM`
    );
    this.rfCommunicationService.sendCommand(startSpeed1);

    await new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Night mode cancelled")), Infinity);
    });
  }

  private createCancelPromise(id: number): Promise<void> {
    return new Promise<void>((_, reject) => {
      this.nightModeStates.set(id, {
        isRunning: true,
        cancel: () => reject(new Error("Night mode cancelled")),
      });
    });
  }

  private resetNightModeState(id: number) {
    this.nightModeStates.delete(id);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  private handleNightModeError(error: any, id: number): void {
    if (error.message === "Night mode cancelled") {
      Logger.log(`Night mode cancelled for device ID ${id}.`);
    } else {
      Logger.error(
        `Error during night mode operation for device ID ${id}:`,
        error
      );
    }
    throw error;
  }

  private getDelayUntilNext530AM(): number {
    const now = new Date();
    let next530AM = new Date(now);
    next530AM.setHours(5, 30, 0, 0); // Set to 5:30 AM today
    if (now >= next530AM) {
      next530AM.setDate(next530AM.getDate() + 1); // If it's past 5:30 AM today, set to 5:30 AM tomorrow
    }
    return next530AM.getTime() - now.getTime();
  }
}
