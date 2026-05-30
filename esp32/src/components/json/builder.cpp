#include "builder.h"

String Builder::createMessage(const char* name, const std::vector<int>& values, bool status, String error, String source) {
    JsonDocument jsonDocument;

    jsonDocument["name"] = name;
    
    JsonArray jsonArray = jsonDocument["values"].to<JsonArray>();
    for (int value : values) {
        jsonArray.add(value);
    }

    jsonDocument["status"] = status;
    jsonDocument["error"] = error;
    jsonDocument["source"] = source;
    jsonDocument["timestamp"] = millis();

    String output;
    serializeJson(jsonDocument, output);

    return output;
}