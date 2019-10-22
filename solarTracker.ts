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

enum modeId {
    Manually,
    Tracker
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

    //% blockId="solar_readSolarCell" block="solar cell" 
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
}