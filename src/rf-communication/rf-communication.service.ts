import { HttpException, Injectable } from "@nestjs/common";
import { Sequence } from "src/shared/models";

@Injectable()
export class RfCommunicationService {
  sendCommand(commandSequence: Sequence[]): string {
    console.log(`Sending command to the target device.`);

    const cmdAsString = commandSequence.map(cmd => JSON.stringify(cmd)).join(' ');
    console.log(cmdAsString)

    try {
      require("child_process").execSync(
        `python3 ${process.cwd()}/utils/send-rf-command.py '${JSON.stringify(commandSequence)}'`,
        { stdio: "inherit" }
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
