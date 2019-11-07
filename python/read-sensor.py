import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

TRIGGER = 23
ECHO = 24

GPIO.setup(TRIGGER, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

while True:
    GPIO.output(TRIGGER, True)
    time.sleep(0.00001)
    GPIO.output(TRIGGER, False)
    Start = time.time()
    Stop = time.time()
    while GPIO.input(ECHO) == 0:
        Start = time.time()
    while GPIO.input(ECHO) == 1:
        Stop = time.time()
    TimeElapsed = Stop - Start
    distance = (TimeElapsed * 34300) / 2
    print(distance)
    time.sleep(1)
