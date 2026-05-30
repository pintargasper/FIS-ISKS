#include "manager.h"
#include "network/manager.h"
#include "json/builder.h"

void TouchSensors::setup() {
    pinMode(touchSensorPin1, INPUT);
    pinMode(touchSensorPin2, INPUT);
    pinMode(touchSensorPin3, INPUT);
    pinMode(pushButtonPin, INPUT_PULLUP);
    pinMode(blueLedPin, OUTPUT);
    pinMode(greenLedPin, OUTPUT);
    pinMode(redLedPin, OUTPUT);
}

void TouchSensors::loop(WebSocketsClient& webSocket) {
    int value1 = touchRead(touchSensorPin1);
    int value2 = touchRead(touchSensorPin2);
    int value3 = touchRead(touchSensorPin3);
    int pushButtonValue = digitalRead(pushButtonPin);

    String json = Builder::createMessage("touchSensors", {value1, value2, value3, pushButtonValue}, true, "", "ESP32");
    webSocket.sendTXT(json);
}

void TouchSensors::handleServerCommand(const JsonDocument &jsonDocument) {
    const char* command = jsonDocument["name"];

    if (!command || strcmp(command, "led") != 0) {
        return;
    }

    if (!jsonDocument["value"].is<JsonArrayConst>()) {
        return;
    }

    JsonArrayConst value = jsonDocument["value"].as<JsonArrayConst>();
    setLedState(value[0], value[1], value[2]);
}

void TouchSensors::setLedState(bool blue, bool green, bool red) {
    digitalWrite(blueLedPin, blue);
    digitalWrite(greenLedPin, green);
    digitalWrite(redLedPin, red);
}
