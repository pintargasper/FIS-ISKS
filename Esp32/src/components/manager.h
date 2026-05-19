#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>

class Photoresistor {

    public:
        void begin();
        void update(WebSocketsClient& webSocket);
        void handleServerCommand(const JsonDocument &jsonDocument);

    private:
        int photoresistorPin = 32;
        int mainLedPin = 33;
        int backupLedPin = 25;
        int espLedPin = 2;

        int threshold = 200;

        bool mainLedState = true;
        bool backupLedState = false;
        bool espLedState = false;

        unsigned long lastBlinkTime = 0;

        void blinkEspLed(int pin, bool &mainState, bool &state, unsigned long &lastBlinkTime, unsigned long interval);
        String evaluateControlState(bool lowLight);
};