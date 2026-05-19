#include "builder.h"

String Builder::createMessage(const char* name, int value, bool status, String error, String source) {
    JsonDocument jsonDocument;

    jsonDocument["name"] = name;
    jsonDocument["value"] = value;
    jsonDocument["status"] = status;
    jsonDocument["error"] = error;
    jsonDocument["source"] = source;

    String output;
    serializeJson(jsonDocument, output);

    return output;
}