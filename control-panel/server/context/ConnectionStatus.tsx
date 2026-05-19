"use client";

import {JSX} from "react";

interface ConnectionStatusProps {
    isConnected: boolean;
}

const ConnectionStatus: (props: ConnectionStatusProps) => JSX.Element = (
    props: ConnectionStatusProps
): JSX.Element => {
    return (
        <div className={"card shadow-sm mb-4"}>
            <div className={"card-body"}>
                <p className={"mb-0"}>
                    Server connection:{" "}
                    <span
                        id={"connectionStatus"}
                        className={`fw-bold ${props.isConnected ? "text-success" : "text-danger"}`}>
                        { props.isConnected ? "Connected" : "Not connected"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default ConnectionStatus;
