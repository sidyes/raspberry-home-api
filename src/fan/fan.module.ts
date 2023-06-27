import { Module } from '@nestjs/common';
import { FanController } from './fan.controller';
import { FanService } from './fan.service';

@Module({
  controllers: [FanController],
  providers: [FanService]
})
export class FanModule {}
