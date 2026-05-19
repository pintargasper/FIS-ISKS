#include <Arduino.h>
#include "secrets.h"
#include "network/manager.h"
#include "components/manager.h"

WebSocketsClient webSocket;
WifiManager wifiManager;
WebSocketManager webSocketManager;
Photoresistor photoresistor;

void handleServerCommand(const JsonDocument &jsonDocument);

void setup() {
    Serial.begin(115200);
    wifiManager.connect(WIFI_SSID, WIFI_PASSWORD);
    webSocketManager.begin(WEB_SOCKET_ADDRESS, WEB_SOCKET_PORT, WEB_SOCKET_PATH);
    webSocketManager.setCommandCallback(handleServerCommand);

    photoresistor.begin();
}

void loop() {
    webSocketManager.loop();

    photoresistor.update(webSocketManager.webSocket);
    delay(100);
}


void handleServerCommand(const JsonDocument &jsonDocument) {
    photoresistor.handleServerCommand(jsonDocument);
}
