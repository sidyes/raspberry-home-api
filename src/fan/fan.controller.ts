import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { FanService } from "./fan.service";
import { Fan, FanCommand } from "./models";
import { NightModeService } from "./night-mode-service";

@Controller("fans")
export class FanController {
  constructor(
    private readonly fanService: FanService,
    private readonly nightModeService: NightModeService
  ) {}

  @Get()
  getAvailableFans(): Fan[] {
    return this.fanService.getAvailableFans();
  }

  @Get(":id")
  async sendFanCommand(
    @Param("id", new ParseIntPipe()) id: number,
    @Query("cmd", new ParseEnumPipe(FanCommand)) cmd: FanCommand
  ): Promise<string> {
    console.log(`Executing command ${cmd} for fan ${id}...`);

    if (cmd.startsWith("NIGHT_MODE")) {
      this.nightModeService.startNightMode(id, cmd);
      return Promise.resolve(`Night Mode ${cmd} successfully started.`);
    } else {
      await this.nightModeService.cancelNightMode(id);
      return await this.fanService.sendCommand(id, cmd);
    }
  }

  @Get(":id/status")
  async isNightModeRunning(
    @Param("id", ParseIntPipe) id: number
  ): Promise<{ isRunning: boolean }> {
    const isRunning = await this.nightModeService.isNightModeRunning(id);
    return { isRunning };
  }
}
