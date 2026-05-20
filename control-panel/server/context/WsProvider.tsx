"use client";

import {Dispatch, JSX, ReactNode, RefObject, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {WebSocketContext, WebSocketContextValue} from "@/server/context/WsContext";

const WsProvider: ({children}: { children: ReactNode; }) => JSX.Element = ({children}: {
    children: ReactNode;
}): JSX.Element => {

    const socketReference: RefObject<WebSocket | null> = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected]: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(false);
    const [lastMessage, setLastMessage]: [string | null, Dispatch<SetStateAction<string | null>>] = useState<string | null>(null);

    useEffect((): (() => void) => {
        const wsUrl: string = process.env.NEXT_PUBLIC_WS_URL ?? "";
        const socket: WebSocket = new WebSocket(wsUrl);

        socketReference.current = socket;

        socket.onopen = (): void => {
            setIsConnected(true);
        };

        socket.onerror = (): void => {
            setIsConnected(false);
        };

        socket.onclose = (): void => {
            setIsConnected(false);
        };

        socket.onmessage = (event: MessageEvent): void => {
            setLastMessage(event.data);
        };

        return (): void => {
            socket.close();
        };
    }, []);

    const sendMessage: (message: string) => void = useCallback(
        (message: string): void => {
            if (socketReference.current?.readyState === WebSocket.OPEN) {
                socketReference.current.send(message);
            }
        }, []
    );

    const value: WebSocketContextValue = {
        isConnected,
        sendMessage,
        lastMessage,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WsProvider;
