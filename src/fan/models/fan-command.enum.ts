export enum FanCommand {
    ON_OFF = "ON_OFF",
    FRONT_REAR = "FRONT_REAR",
    SPEED_1 = "SPEED_1",
    SPEED_2 = "SPEED_2",
    SPEED_3 = "SPEED_3",
    SPEED_4 = "SPEED_4",
    SPEED_5 = "SPEED_5",
    TIMER_1H = "TIMER_1H",
    TIMER_4H = "TIMER_4H",
    TIMER_8H = "TIMER_8H",
    NIGHT_MODE_1 = "NIGHT_MODE_1", // 10 min every hour for 7 hours
    NIGHT_MODE_2 = "NIGHT_MODE_2", // 30 min first hour, infinite running at 5:30 am
}