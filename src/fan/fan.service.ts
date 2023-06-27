import { Injectable } from "@nestjs/common";
import { Fan } from "./models/fan.model";

@Injectable()
export class FanService {
  getAvailableFans(): Fan[] {
    return [
      {
        id: 1,
        location: "Sample",
      },
    ];
  }
}
