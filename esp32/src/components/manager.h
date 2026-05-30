#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>

class Photoresistor {

    public:
        void setup();
        void loop(WebSocketsClient& webSocket);
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

class TouchSensors {

    public:
        void setup();
        void loop(WebSocketsClient& webSocket);
        void handleServerCommand(const JsonDocument &jsonDocument);

    private:
        int touchSensorPin1 = 13;
        int touchSensorPin2 = 12;
        int touchSensorPin3 = 14;
        int pushButtonPin = 33;
        int blueLedPin = 27;
        int greenLedPin = 26;
        int redLedPin = 25;

        void setLedState(bool blue, bool green, bool red);
};

class Potentiometer {

    public:
        void setup();
        void loop(WebSocketsClient& webSocket);
        void handleServerCommand(const JsonDocument &jsonDocument);
        
    private:
        int potentiometerPin = 32;
        int blueLedPin = 27;
        int greenLedPin = 26;
        int redLedPin = 25;

        void setLedState(bool blue, bool green, bool red);
};