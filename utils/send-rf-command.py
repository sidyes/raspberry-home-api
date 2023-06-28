import argparse
import time
import warnings
import sys

# assume running on a Raspberry Pi
prod = True

try:
    import RPi.GPIO as GPIO

    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BOARD)
except ModuleNotFoundError:
    warnings.warn("This can only be executed on Raspberry Pi", RuntimeWarning)
    prod = False


CLI = argparse.ArgumentParser(
    prog="RF sender for Raspberry PI",
    description="This script allows to send commands to the 433 MHz module installed on a Raspberry Pi",
)
CLI.add_argument("command", nargs="*", type=object)
CLI.add_argument("--prod", default=True, type=bool)
args = CLI.parse_args()


def send(command):
    if prod:
        # send command to PIN 11
        GPIO.setup(11, GPIO.OUT, initial=GPIO.LOW)
        for i, (timing, level) in enumerate(command):
            if i != 0:
                # sleep
                now = time.time()
                while now + timing > time.time():
                    pass
            GPIO.output(11, level)
            
    else:
        print("Running in local development mode -> no command is actually sent")


send(args.command)

if prod:
    GPIO.cleanup()
