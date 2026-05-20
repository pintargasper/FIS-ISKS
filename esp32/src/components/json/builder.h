#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>

class Builder {

    public:
        static String createMessage(const char* name, int value, bool status, String error, String source);
};