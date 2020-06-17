basic.forever(function () {
    if (true) {
        serial.writeValue("tl", Solar.readSensor(sensorId.TopLeft))
        serial.writeValue("tr", Solar.readSensor(sensorId.TopRight))
        serial.writeValue("bl", Solar.readSensor(sensorId.BottomLeft))
        serial.writeValue("br", Solar.readSensor(sensorId.BottomRight))
        serial.writeValue("P", Solar.readServo(servoId.Pan))
        serial.writeValue("T", Solar.readServo(servoId.Tilt))
        serial.writeValue("SC", Solar.readSolarCell())
        basic.pause(500)
    }
})
