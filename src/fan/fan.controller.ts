import { Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Query } from "@nestjs/common";
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
  sendFanCommand(@Param("id", new ParseIntPipe()) id: number, @Query("cmd", new ParseEnumPipe(FanCommand)) cmd: FanCommand) {
    return `Command ${cmd} for fan ${id} executed!`;
  }
}