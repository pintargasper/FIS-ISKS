import path from "path";
import next from "next";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { fileURLToPath } from "url";
import { AddressInfo } from "net";
import {Duplex} from "node:stream";
import {RequestHandler} from "next/dist/server/next";
import {Server} from "node:net";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
const dev: boolean = process.env.NODE_ENV !== "production";

type UnknownErrorRecord = Record<string, unknown> & Error;
type WsPrimitive = string | number | boolean | null;

interface ExtendedWebSocket extends WebSocket {
    remoteAddress?: string;
}

interface WsMessage {
    name: string;
    value?: WsPrimitive | Record<string, unknown>;
    status?: WsPrimitive;
    error?: string;
    source?: string;
    timestamp?: number;
}

process.on("unhandledRejection", (reason: unknown): void => {
    console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err: unknown): void => {
    const error = err as UnknownErrorRecord;
    const code: unknown = error?.code;
    const message: string = error?.message ?? "";

    if (code === "WS_ERR_INVALID_CLOSE_CODE"
        || message.includes("Invalid WebSocket frame")
        || message.includes("invalid status code")) {
        console.warn("Non-fatal ws error ignored:", message || code);
        return;
    }
    console.error("Uncaught exception:", err);
    process.exit(1);
});

const app: ReturnType<typeof next> = next({ dev, dir: path.join(__dirname, "..") });
const handle: RequestHandler = app.getRequestHandler();

const port: number = Number(process.env.PORT ?? 3004);

const isIgnorableWebSocketError: (error: UnknownErrorRecord) => boolean = (error: UnknownErrorRecord): boolean => {
    const message: string = error.message ?? "";
    const code: unknown = error.code;

    return (
        code === "WS_ERR_INVALID_CLOSE_CODE" ||
        code === "WS_ERR_INVALID_UTF8" ||
        message.includes("Invalid WebSocket frame") ||
        /invalid status code/i.test(message)
    );
};

const extractRemoteAddress: (request: IncomingMessage) => string = (request: IncomingMessage): string => {
    return request.socket.remoteAddress ?? "unknown";
};

app.prepare().then((): void => {
    const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse): Promise<void> => {
        return handle(req as never, res as never);
    });

    const webSocketServer = new WebSocketServer({ noServer: true });

    webSocketServer.on("error", (error: UnknownErrorRecord): void => {
        if (isIgnorableWebSocketError(error)) {
            console.warn("Ignored WS server error:", error.message ?? error.code);
            return;
        }
        console.error("WebSocketServer error:", error);
    });

    server.on("error", (error: UnknownErrorRecord): void => {
        const message: string = error.message ?? "";

        if (message.includes("ECONNRESET") || message.includes("EPIPE")) {
            console.warn("Ignored HTTPS server error:", message);
            return;
        }
        console.error("HTTPS server error:", error);
    });

    server.on("upgrade", (req: IncomingMessage, socket: Duplex, head: Buffer): void => {
        const pathName: string = (req.url ?? "").split("?")[0];

        if (pathName !== "/ws") {
            return;
        }

        socket.once("error", (): Duplex => socket.destroy());
        try {
            webSocketServer.handleUpgrade(req as IncomingMessage, socket as never, head, (ws: WebSocket): void => {
                const extendedWs = ws as ExtendedWebSocket;
                extendedWs.remoteAddress = extractRemoteAddress(req);
                webSocketServer.emit("connection", ws, req);
            });
        } catch {
            socket.destroy();
        }
    });

    const broadcastToAll: (message: string, sender: WebSocket) => void = (message: string, sender: WebSocket): void => {
        webSocketServer.clients.forEach((client: WebSocket): void => {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                try {
                    client.send(message);
                } catch (error: unknown) {
                    console.warn("Broadcast failed:", error);
                }
            }
        });
    };

    webSocketServer.on("connection", (socket: WebSocket): void => {
        const extendedSocket = socket as ExtendedWebSocket;
        const remoteAddress: string = extendedSocket.remoteAddress ?? "unknown";

        console.log("[WS] Client connected", { remoteAddress });
        try {
            socket.send(JSON.stringify({
                name: "connection",
                status: "connected"
            }));
        } catch (error: unknown) {
            console.warn("Failed welcome message:", remoteAddress, error);
        }

        socket.on("message", (data: Buffer | string): void => {
            const messageText: string = typeof data === "string" ? data : data.toString();
            let parsed: WsMessage;
            try {
                parsed = JSON.parse(messageText) as WsMessage;
            } catch {
                parsed = {
                    name: "raw",
                    value: messageText,
                    source: "unknown"
                };
            }
            broadcastToAll(JSON.stringify(parsed), socket);
        });

        socket.on("close", (code: number, reason: Buffer): void => {
            console.log("[WS] Client disconnected", {remoteAddress, code, reason: reason?.toString()});
        });

        socket.on("error", (error: UnknownErrorRecord): void => {
            if (isIgnorableWebSocketError(error)) {
                console.warn("[WS] Ignored client error:", remoteAddress, error.message ?? error.code);
                return;
            }
            console.error("[WS] Client error:", remoteAddress, error);
        });
    });

    server.listen(port, (): void => {
        const address = server.address() as AddressInfo;

        const appProtocol: string = process.env.NEXT_PUBLIC_APP_PROTOCOL ?? "http";
        const appHost: string = process.env.NEX_PUBLIC_APP_HOST ?? "localhost";

        console.log(`[${appProtocol.toUpperCase()} + Next] Server running on ${appProtocol}://${appHost}:${address.port}`);
    });
}).catch((error: unknown): void => {
    console.error(error);
    process.exit(1);
});
