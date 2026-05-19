#include "manager.h"

void (*WebSocketManager::commandCallback)(const JsonDocument&) = nullptr;

void WebSocketManager::begin(const char* address, int port, const char* path) {

    webSocket.beginSSL(address, port, path);
    webSocket.onEvent(onEvent);
    webSocket.setReconnectInterval(5000);
}

void WebSocketManager::loop() {
    webSocket.loop();
}

void WebSocketManager::send(String message) {
    webSocket.sendTXT(message);
}

void WebSocketManager::setCommandCallback(void (*callback)(const JsonDocument&)) {
    commandCallback = callback;
}

void WebSocketManager::onEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch (type) {
        case WStype_CONNECTED:
            Serial.println("WebSocket: connected");
            break;
        case WStype_DISCONNECTED:
            Serial.println("WebSocket: disconnected");
            break;
        case WStype_TEXT: {

            String message = String((char*)payload);
            message.trim();

            JsonDocument jsonDocument;
            DeserializationError error = deserializeJson(jsonDocument, message);

            if (!error && commandCallback != nullptr) {
                commandCallback(jsonDocument);
            }
            break;
        }
        default:
            break;
    }
}