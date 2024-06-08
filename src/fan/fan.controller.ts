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

@Controller("fans")
export class FanController {
  constructor(private readonly fanService: FanService) {}

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

    if(cmd === FanCommand.NIGHT_MODE){
      return await this.fanService.startNightMode(id);
    }else {
      return await this.fanService.sendCommand(id, cmd);
    }
  }

  @Get(":id")
  async startNightMode(
    @Param("id", new ParseIntPipe()) id: number,
    @Query("cmd", new ParseEnumPipe(FanCommand)) cmd: FanCommand
  ): Promise<string> {
    console.log(`Executing command ${cmd} for fan ${id}...`);
    const result = await this.fanService.sendCommand(id, cmd);

    return result;
  }
}
