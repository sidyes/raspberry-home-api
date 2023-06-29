import argparse
import time
import warnings
import json

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
CLI.add_argument("command", type=str)
args = CLI.parse_args()


def send(command):
    if prod:
        # send command to PIN 11
        GPIO.setup(11, GPIO.OUT, initial=GPIO.LOW)
    else:
        print("Running in local development mode -> no command is actually sent")

    total_output = ""

    for i, pair in enumerate(command):
        if i != 0:
            # sleep
            now = time.time()
            while now + float(pair['timing']) > time.time():
                pass
        total_output += pair['level']
        if prod:
            GPIO.output(11, int(pair['level']))

    print("Sent {} to Raspberri Pi Rf Transmitter".format(total_output))

# parse command 
commands = json.loads(args.command)

send(commands)


if prod:
    GPIO.cleanup()
