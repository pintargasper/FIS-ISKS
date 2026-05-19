"use client";

import ConnectionStatus from "@/server/context/ConnectionStatus";
import {useWebSocket} from "@/server/context/WsContext";
import {JSX} from "react";

const Tabs: () => JSX.Element = (): JSX.Element => {

    const { isConnected } = useWebSocket();

    return (
        <div>
            <ConnectionStatus isConnected={isConnected} />
        </div>
    );
}

export default Tabs;
