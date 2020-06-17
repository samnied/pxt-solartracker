enum sensorId {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight
    }
enum servoId {
    Pan,
    Tilt
}
enum directionId {
    Up,
    Down,
    Left,
    Right
}
enum modeId {
    Manually,
    Automatic,
    Remote
}

/**
 * Functions to operate with the solar tracker.
 */

//% weight=100 color=#0fbc11 icon="\uf185" groups=["Read", "Write", "Constants"]
namespace SolarTracker {
    // I2C address of the device
    const i2cAddr = 8;
    // time to wait before read I2C, in micro seconds
    const wTime = 5000;

    export function writeCommand(command: string): void {
        // creat comand buffer to store each char of the command string
        let comBuf = pins.createBuffer(16);
        // comand string 
        let comStr = command;

        for (let i = 0; i < comStr.length; i++) {
            comBuf.setNumber(NumberFormat.Int8LE, i, comStr.charCodeAt(i));
        }
        pins.i2cWriteBuffer(i2cAddr, comBuf, false);
    }

    export function read(): number {
        let rBuf = pins.i2cReadBuffer(i2cAddr, 4, false);
        let str = "";
        for (let i = 0; i < 4; i++) {
            str += String.fromCharCode(rBuf.getNumber(NumberFormat.Int8LE, i));
        }
        // solve the NaN problem
        return parseInt(str)|| 0;
    }

    /**
     * Returns the sensor voltage in mV
     * @param sensorId : Which sensor should be read.
     */
    //% blockId="solar_read_sensor" block=" Sensor %sensorId| value" 
    //% group="Read" 
    export function readSensor(id: sensorId): number {
        let str = ""
        // "tl" : 0,
        // "tr" : 1,
        // "bl" : 2,
        // "br" : 3
        switch (id) {
            case sensorId.TopLeft: str = "tl,?";
                break;
            case sensorId.TopRight: str = "tr,?";
                break;
            case sensorId.BottomLeft: str = "bl,?";
                break;
            case sensorId.BottomRight: str = "br,?";
                break;
        }
        writeCommand(str);
        control.waitMicros(wTime)
        let ret = read();
        control.waitMicros(wTime)
        return ret;
    }

    /**
     * Returns the absolute postion of the 
     * servo [Pan/Tilt] in degrees
     * @param servoId : Which servo should be read.
     */
    //% blockId="solar_read_servo" block="Servo %servoId| value" 
    //% group="Read" 
    export function readServo(id: servoId): number {
        let str = "";

        switch (id) {
            case servoId.Pan: 
                str = "servoP,?";
                break;
            case servoId.Tilt: 
                str = "servoT,?";
                break;
            default:
                break;
        }
        writeCommand(str);
        control.waitMicros(wTime)
        return read();
    }
    
    /**
     * Returns the voltage of the solarcell in mV
     */
    //% blockId="solar_read_solar_cell" block="solar cell value" 
    //% group="Read" 
    export function readSolarCell(): number {
        let str = "solarC,?";
        writeCommand(str);
        control.waitMicros(wTime)
        return read();
    }

    /**
     * Returns the current operation mode as enum [Manually/Automatic/Remote]
     */
    //% blockId="solar_mode" block="mode value" 
    //% group="Read" 
    export function mode(): number {
        let str = "opMode,?";
        writeCommand(str);
        control.waitMicros(wTime)
        return read();
    }

    /**
     * Returns the calculated direction to turn the Servo [Pan/Tilt]
     * in order to follow the (sun)light
     */
    //% blockId="solar_soft_controll" block="soft control %id" 
    //% group="Read" 
    export function softControl(id: servoId): number {
        let str = "";

        switch (id) {
            case servoId.Pan: 
                str = "softP,?";
                break;
            case servoId.Tilt: 
                str = "softT,?";
                break;
            default:
                break;
        }
        writeCommand(str);
        control.waitMicros(wTime)
        return read();
    }

    /**
     * Turns the servo to the absolute position
     * @param servoId : Which servo should be turned.
     * @param degree : Position to be turned to.
     */
    //% blockId="solar_write_servo_position" block=" Set servo %id position %degree" 
    //% degree.min=0 degree.max=180 degree.defl=90
    //% group="Write" 
    export function writeServoPosition(id: servoId, degree: number): void {
        let str = "";

        switch (id) {
            case servoId.Pan: str = "servoP,";
                break;
            case servoId.Tilt: str = "servoT,";
                break;
        }
        // auto conversion from number to string
        str += degree.toString();
        writeCommand(str);
    }

    /**
     * Set operation mode
     * @param modeId : Which mode should be set.
     */
    //% blockId="solar_set_mode" block="Set mode %id=solar_modeEnum|" 
    //% group="Write" 
    export function setMode(id: modeId): void {
        let str = "opMode,";

        switch (id) {
            case modeId.Manually: str += 0;
                break;
            case modeId.Automatic: str += 1;
                break;
            case modeId.Remote: str += 2;
                break;
        }
        writeCommand(str);
    }

    /**
     * Turn the tracker 
     * Up
     * Down
     * Left
     * Right
     * @param direction : Direction to turn.
     * @param val : Degrees to turn.
     */
    //% blockId="solar_turn_direction" block="turn %dir=solar_dirEnum| %val"
    //% val.min=0 val.max=180 val.defl=1
    //% group="Write" 
    export function turnDirection(direction: number, val: number): void {
        let turn = direction*1000 + val;
        let str = "turnDir,";
        str += turn.toString();
        writeCommand(str);
    }

    /**
     * Turn the tracker relative
     * @param servoId : Which servo should be turned.
     * @param val : Degrees to turn relative.
     */
    // function to turn Pan or Tilt, value can be + or -
    //% blockId="solar_turnval" block="turn %servo=solar_servoEnum| %val"
    //% val.min=-180 val.max=180 val.defl=1
    //% group="Write" 
    export function turnVal(servo: number, val: number): void {
        switch (servo) {
            case servoId.Pan:
                if(val > 0)
                {
                    turnDirection(directionId.Left, val)
                }
                else
                {
                    turnDirection(directionId.Right, Math.abs(val))
                }
                break;
            case servoId.Tilt:
                if(val > 0)
                {
                    turnDirection(directionId.Down, val)
                }
                else
                {
                    turnDirection(directionId.Up, Math.abs(val))
                }
                break;
        }
    }

    // provide direction enum as block
    //% blockId="solar_dirEnum" block="%dir"
    //% group="Constants" 
    export function dirEnum(dir: directionId): directionId {
        return dir;
    }
    // provide servo enum as block
    //% blockId="solar_servoEnum" block="%servo"
    //% group="Constants"
    export function servoEnum(servo: servoId): servoId {
        return servo;
    }
    // provide mode enum as block
    //% blockId="solar_modeEnum" block="%mode"
    //% group="Constants"
    export function modeEnum(mode: modeId): modeId {
        return mode;
    }
}