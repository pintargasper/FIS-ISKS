#include <Arduino.h>
#include "secrets.h"
#include "network/manager.h"
#include "components/manager.h"

WifiManager wifiManager;
WebSocketManager webSocketManager;
Photoresistor photoresistor;
TouchSensors touchSensors;
Potentiometer potentiometer;

void handleServerCommand(const JsonDocument &jsonDocument);

void setup() {
    Serial.begin(115200);
    wifiManager.connect(WIFI_SSID, WIFI_PASSWORD);
    webSocketManager.begin(WEB_SOCKET_ADDRESS, WEB_SOCKET_PORT, WEB_SOCKET_PATH);
    webSocketManager.setCommandCallback(handleServerCommand);

    //photoresistor.setup();
    //touchSensors.setup();
    //potentiometer.setup();
}

void loop() {
    webSocketManager.loop();

    //photoresistor.loop(webSocketManager.webSocket);
    //touchSensors.loop(webSocketManager.webSocket);
    //potentiometer.loop(webSocketManager.webSocket);
    delay(100);
}


void handleServerCommand(const JsonDocument &jsonDocument) {
    //photoresistor.handleServerCommand(jsonDocument);
    //touchSensors.handleServerCommand(jsonDocument);
    //potentiometer.handleServerCommand(jsonDocument);
}
