"use client";

import {Context, createContext, useContext,} from "react";

interface WebSocketContextValue {
    isConnected: boolean;
    sendMessage: (message: string) => void;
    lastMessage: string | null;
}

const WebSocketContext: Context<WebSocketContextValue | undefined>  = createContext<WebSocketContextValue | undefined>(undefined);

const useWebSocket: () => WebSocketContextValue = (): WebSocketContextValue => {

    const context: WebSocketContextValue | undefined = useContext(WebSocketContext);

    if (!context) {
        throw new Error("useWebSocket must be used within WebSocketProvider");
    }
    return context;
};

export type {
    WebSocketContextValue
}

export {
    WebSocketContext,
    useWebSocket
}
