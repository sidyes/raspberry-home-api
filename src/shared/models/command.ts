export interface Command {
  name: string;
  sequence: Sequence[];
}

export interface Sequence {
  timing: number;
  level: number;
}
