import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RfCommunicationService {

    constructor(private configService: ConfigService){}

    public sendCommand(command: string): void {
        const environment = this.configService.get<string>('environment');

        // TODO: call fan
        console.log(`Sending command ${command} to the device (env: ${environment}).`)


    }
}
