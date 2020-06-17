basic.forever(function () {
    if (true) {
        serial.writeValue("tl", SolarTracker.readSensor(sensorId.TopLeft))
        serial.writeValue("tr", SolarTracker.readSensor(sensorId.TopRight))
        serial.writeValue("bl", SolarTracker.readSensor(sensorId.BottomLeft))
        serial.writeValue("br", SolarTracker.readSensor(sensorId.BottomRight))
        serial.writeValue("P", SolarTracker.readServo(servoId.Pan))
        serial.writeValue("T", SolarTracker.readServo(servoId.Tilt))
        serial.writeValue("SC", SolarTracker.readSolarCell())
        basic.pause(500)
    }
})
