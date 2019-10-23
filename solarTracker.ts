// Id to identify the different ldr sensor
enum ldrId {
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
    left = 1,
    right = 2,
    up = 3,
    down = 4
}
enum modeId {
    Manually,
    Tracker
}
//Hardware limit of plattform
enum servoLimit {
    panUp = 175,
    panLow = 5,
    tiltUp = 150,
    tiltLow = 10
}

//% weight=100 color=#0fbc11 icon=""
namespace Solar {
    // I2C address of solar device
    const i2cAddr = 8;

    export function writeCom(command: string): void {
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
        let rBuf = pins.i2cReadBuffer(i2cAddr, 4, true);
        let str = "";
        for (let i = 0; i < 4; i++) {
            str += String.fromCharCode(rBuf.getNumber(NumberFormat.Int8LE, i));
        }
        return parseInt(str);
    }


    /**
     * TODO: Beschreibe deine Funktion hier
     * @param id 
     */

    //% blockId="solar_readLDR" block=" LDR %ldrId| value" 
    export function readLDR(id: ldrId): number {
        let str = ""
        // "tl" : 0,
        // "tr" : 1,
        // "bl" : 2,
        // "br" : 3
        switch (id) {
            case ldrId.TopLeft: str = "ldr0,?";
                break;
            case ldrId.TopRight: str = "ldr1,?";
                break;
            case ldrId.BottomLeft: str = "ldr2,?";
                break;
            case ldrId.BottomRight: str = "ldr3,?";
                break;
        }
        writeCom(str);
        return read();
    }

    //% blockId="solar_readServo" block=" Servo %servoId| value" 
    export function readServo(id: servoId): number {
        let str = "";

        switch (id) {
            case servoId.Pan: str = "servoP,?";
                break;
            case servoId.Tilt: str = "servoT,?";
                break;
        }
        writeCom(str);
        return read();
    }

    //% blockId="solar_readSolarCell" block="solar cell value" 
    export function readSolarCell(): number {
        let str = "solarC,?";
        writeCom(str);
        return read();
    }

    //% blockId="solar_writeServo" block=" Write servo %id  %val degrees" 
    //% val.min=0 val.max=180 val.defl=90
    export function writeServo(id: servoId, val: number): void {
        let str = "";

        switch (id) {
            case servoId.Pan: str = "servoP,";
                break;
            case servoId.Tilt: str = "servoT,";
                break;
        }
        // auto conversion from number to string
        str += val;
        writeCom(str);
    }
    //% blockId="solar_setMode" block="Set mode %id" 
    export function setMode(id: modeId): void {
        let str = "opMode,";

        switch (id) {
            case modeId.Manually: str += 0;
                break;
            case modeId.Tracker: str += 1;
                break;
        }
        writeCom(str);
    }
    // function to turn: left, right, up, down direction is a parameter
    //% blockId="solar_turndir" block=" turn %dir=solar_dirEnum| %val"
    //% val.min=0 val.max=180 val.defl=180
    export function turnDir(dir: number, val: number): void {
        let angle = 0;

        switch (dir) {
            case directionId.left:
                angle = Solar.readServo(servoId.Pan) + val;
                if ((angle > servoLimit.panLow) && (angle < servoLimit.panUp)) {
                    Solar.writeServo(servoId.Pan, angle);
                }
                break;
            case directionId.right:
                angle = Solar.readServo(servoId.Pan) - val;
                if ((angle > servoLimit.panLow) && (angle < servoLimit.panUp)) {
                    Solar.writeServo(servoId.Pan, angle);
                }
                break;
            case directionId.up:
                angle = Solar.readServo(servoId.Tilt) - val;
                if ((angle > servoLimit.tiltLow) && (angle < servoLimit.tiltUp)) {
                    Solar.writeServo(servoId.Tilt, angle);
                }
                break;
            case directionId.down:
                angle = Solar.readServo(servoId.Tilt) + val;
                if ((angle > servoLimit.tiltLow) && (angle < servoLimit.tiltUp)) {
                    Solar.writeServo(servoId.Tilt, angle);
                }
                break;
        }
    }
    // function to turn: Pan or tilt, value can be + or -
    //% blockId="solar_turnval" block="turn %servo=solar_servoEnum %val"
    //% val.min=-180 val.max=180 val.defl=0
    export function turnVal(servo: servoId, val: number): void {
        let angle = 0;

        switch (servo) {
            case servoId.Pan:
                angle = Solar.readServo(servoId.Pan) + val;
                if ((angle > servoLimit.panLow) && (angle < servoLimit.panUp)) {
                    Solar.writeServo(servoId.Pan, angle);
                }
                break;
            case servoId.Tilt:
                angle = Solar.readServo(servoId.Tilt) + val;
                if ((angle > servoLimit.tiltLow) && (angle < servoLimit.tiltUp)) {
                    Solar.writeServo(servoId.Tilt, angle);
                }
                break;
        }
    }
    // function to provide direction enum as block
    //% blockId="solar_direnum" block="%dir"
    export function dirEnum(dir: directionId): directionId {
        return dir;
    }
    // function to provide servo enum as block
    //% blockId="solar_servoenum" block="%servoId"
    export function servoEnum(servo: servoId): servoId {

        return servo;
    }
}