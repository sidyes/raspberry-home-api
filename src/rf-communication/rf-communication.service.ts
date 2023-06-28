import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class RfCommunicationService {
  public sendCommand(command: string): string {
    console.log(`Sending command ${command} to the device.`);

    try {
      require("child_process").execSync(
        `python3 ${process.cwd()}/utils/send-rf-command.py`
      );
      return "Success";
    } catch (error) {
      console.log(`Status Code: ${error.status} with '${error.message}'`);
      throw new HttpException(
        "Sending the command to Raspberry Pi failed.",
        500
      );
    }
  }
}
