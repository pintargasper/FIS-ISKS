"use client";

import { useMemo } from "react";
import { useWebSocket } from "@/server/context/WsContext";

interface ServerMessage {
    name: string;
    value?: number;
    status?: boolean;
    error?: string;
    timestamp?: number;
}

interface UseSensorMessageReturn {
    data: ServerMessage | null;
    sendMessage: (message: string) => void;
}

const useMessage: (sensorName: string) => UseSensorMessageReturn = (sensorName: string): UseSensorMessageReturn => {

    const { lastMessage, sendMessage } = useWebSocket();

    const data: ServerMessage | null = useMemo(
        (): ServerMessage | null => {

            if (!lastMessage) {
                return null;
            }

            try {
                const parsedMessage: ServerMessage = JSON.parse(lastMessage);
                if (parsedMessage.name !== sensorName) {
                    return null;
                }
                return parsedMessage;
            } catch {
                console.error("Invalid websocket message");
                return null;
            }
        },
        [lastMessage, sensorName]
    );

    return {
        data,
        sendMessage
    };
};

export default useMessage;
