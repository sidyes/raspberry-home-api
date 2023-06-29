import { Command } from "./command";

export interface Device {
  id: number;
  location: string;
  commands?: Command[];
}
