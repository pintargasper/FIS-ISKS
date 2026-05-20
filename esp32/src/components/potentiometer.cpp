#include "manager.h"
#include "network/manager.h"
#include "json/builder.h"

void Potentiometer::setup() {
    pinMode(potentiometerPin, INPUT);
    pinMode(blueLedPin, OUTPUT);
    pinMode(greenLedPin, OUTPUT);
    pinMode(redLedPin, OUTPUT);
}

void Potentiometer::loop(WebSocketsClient& webSocket) {

    int value = analogRead(potentiometerPin);

    String json = Builder::createMessage("potentiometer", value, true, "", "ESP32");
    webSocket.sendTXT(json);
}

void Potentiometer::handleServerCommand(const JsonDocument &jsonDocument) {

    const char* command = jsonDocument["name"];
    const char* value = jsonDocument["value"];

    if (command == nullptr) {
        return;
    }

    if (strcmp(command, "status") != 0) {
        return;
    }

    if (value == nullptr) {
        return;
    }

    if (strcmp(value, "low") == 0) {
        setLedState(true, false, false);
    } else if (strcmp(value, "ok") == 0) {
        setLedState(false, true, false);
    } else if (strcmp(value, "high") == 0) {
        setLedState(false, false, true);
    }
}

void Potentiometer::setLedState(bool blue, bool green, bool red) {
    digitalWrite(blueLedPin, blue);
    digitalWrite(greenLedPin, green);
    digitalWrite(redLedPin, red);
}
