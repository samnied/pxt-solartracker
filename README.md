# Solar Tracker
This library allows to operate the Solar Tracker with BBC Micro:bit and MakeCode

# Reference
## turnVal
Turn Pan or Tilt by x dgrees
``` 
Solar.turnVal(servoId.Pan, 45)
Solar.turnVal(servoId.Tilt, 90)
```
## turnDir
Turn left/ right or up/down by x degrees
``` 
Solar.turnDir(Solar.dirEnum(directionId.left), 0)
Solar.turnDir(Solar.dirEnum(directionId.right), 45)
Solar.turnDir(Solar.dirEnum(directionId.up), 90)
Solar.turnDir(Solar.dirEnum(directionId.down), 135)
```
## writeServo
Directly turn servo by x degress
``` 
Solar.writeServo(servoId.Pan, 0)
Solar.writeServo(servoId.Tilt, 90)
```
## readSolarCell
Reads the voltage of the solar cell
``` 
Solar.readSolarCell()
```
## readLDR
Reads the voltage of one of the LDR sensors
``` 
Solar.readLDR(ldrId.TopLeft)
Solar.readLDR(ldrId.TopRight)
Solar.readLDR(ldrId.BottomLeft)
Solar.readLDR(ldrId.Bottomright)
```
## readServo
Reads position of the Pan or Tilt serv0
``` 
Solar.readServo(servoId.Pan)
Solar.readServo(servoId.Tilt)
```
## Supported targets

* for PXT/microbit

## License

MIT

