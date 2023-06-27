import { Module } from '@nestjs/common';
import { RfCommunicationService } from './rf-communication.service';

@Module({
  providers: [RfCommunicationService]
})
export class RfCommunicationModule {}
