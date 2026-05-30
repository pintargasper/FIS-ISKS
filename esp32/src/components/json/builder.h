#pragma once

#include <Arduino.h>
#include <ArduinoJson.h>
#include <vector>

class Builder {

    public:
        static String createMessage(const char* name, const std::vector<int>& values, bool status, String error, String source);
};