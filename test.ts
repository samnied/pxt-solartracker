basic.forever(function () {
    if (true) {
        serial.writeValue("tl", Solar.readLDR(ldrId.TopLeft))
        serial.writeValue("tr", Solar.readLDR(ldrId.TopRight))
        serial.writeValue("bl", Solar.readLDR(ldrId.BottomLeft))
        serial.writeValue("br", Solar.readLDR(ldrId.BottomRight))
        serial.writeValue("P", Solar.readServo(servoId.Pan))
        serial.writeValue("T", Solar.readServo(servoId.Tilt))
        serial.writeValue("SC", Solar.readSolarCell())
        basic.pause(500)
    }
})
