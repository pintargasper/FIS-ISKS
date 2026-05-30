#include "manager.h"
#include "network/manager.h"
#include "json/builder.h"

void Photoresistor::setup() {
    pinMode(photoresistorPin, INPUT);
    pinMode(mainLedPin, OUTPUT);
    pinMode(backupLedPin, OUTPUT);
    pinMode(espLedPin, OUTPUT);
}

void Photoresistor::loop(WebSocketsClient& webSocket) {
    int value = analogRead(photoresistorPin);

    digitalWrite(mainLedPin, mainLedState ? HIGH : LOW);
    digitalWrite(backupLedPin, backupLedState ? HIGH : LOW);
    digitalWrite(espLedPin, espLedState ? HIGH : LOW);

    bool lowLight = (value < threshold);
    String controlState = evaluateControlState(lowLight);
    blinkEspLed(espLedPin, backupLedState, espLedState, lastBlinkTime, 500);

    String json = Builder::createMessage("photoresistor", {value}, mainLedState, controlState, "ESP32");
    webSocket.sendTXT(json);
}

void Photoresistor::handleServerCommand(const JsonDocument &jsonDocument) {
    const char* command = jsonDocument["name"];
    bool value = jsonDocument["value"];

    if (command == nullptr) {
        return;
    }

    if (strcmp(command, "mainButton") == 0) {
        mainLedState = value;
    }

    if (strcmp(command, "threshold") == 0) {
        threshold = jsonDocument["value"];
    }
}

void Photoresistor::blinkEspLed(int pin, bool &mainState, bool &state, unsigned long &lastBlinkTime, unsigned long interval) {
    if (!mainState) {
        state = false;
        return;
    }

    if (millis() - lastBlinkTime >= interval) {
        lastBlinkTime = millis();
        state = !state;
        digitalWrite(pin, state);
    }
}

String Photoresistor::evaluateControlState(bool lowLight) {
    if (!mainLedState) {
        backupLedState = false;
        espLedState = false;
        return lowLight ? "Headlight off" : "Safety cut off";
    }

    if (lowLight) {
        backupLedState = true;
        return "Backup light on";
    }

    backupLedState = false;
    espLedState = false;
    return "Light level is sufficient";
}