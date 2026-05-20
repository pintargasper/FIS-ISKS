#pragma once

#include <WebSocketsClient.h>
#include <ArduinoJson.h>

class WifiManager {

    public:
        void connect(const char* ssid, const char* password);
};

class WebSocketManager {

    public:
        WebSocketsClient webSocket;
        
        void begin(const char* address, int port, const char* path);
        void loop();
        void send(String message);
        void setCommandCallback(void (*callback)(const JsonDocument&));

    private:
        static void onEvent(WStype_t type, uint8_t * payload, size_t length);
        static void (*commandCallback)(const JsonDocument&);
};