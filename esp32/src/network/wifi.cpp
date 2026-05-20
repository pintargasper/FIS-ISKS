#include "manager.h"

void WifiManager::connect(const char* ssid, const char* password) {

    Serial.print("\nConnecting to WiFi network: ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nConnection established");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}