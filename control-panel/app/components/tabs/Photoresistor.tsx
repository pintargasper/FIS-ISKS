"use client";

import React, {
    ChangeEvent,
    JSX,
    RefObject,
    useEffect,
    useReducer,
    useRef
} from "react";

import { useWebSocket } from "@/server/context/WsContext";
import TChart, {TChartHandle} from "@/app/components/TChart";

type PhotoresistorAction =
    | { type: "SET_LED"; value: boolean }
    | { type: "SET_ERROR"; value: string | null };

interface ServerMessage {
    name: string;
    value?: number;
    status?: boolean;
    error?: string;
}

interface PhotoresistorState {
    isLedEnabled: boolean;
    error: string | null;
}

const photoresistorReducer: (
    state: PhotoresistorState,
    action: PhotoresistorAction
) => PhotoresistorState = (
    state: PhotoresistorState,
    action: PhotoresistorAction
): PhotoresistorState => {
    switch (action.type) {
        case "SET_LED":
            return {
                ...state,
                isLedEnabled: action.value,
            };
        case "SET_ERROR":
            return {
                ...state,
                error: action.value,
            };
        default:
            return state;
    }
};

const Photoresistor: () => JSX.Element = (): JSX.Element => {

    const chartReference: RefObject<TChartHandle | null> = useRef<TChartHandle | null>(null);
    const { sendMessage, lastMessage } = useWebSocket();
    const [state, dispatch] = useReducer(photoresistorReducer, {isLedEnabled: false, error: null});
    const lastSendTimeReference: RefObject<number> = useRef<number>(0);

    useEffect((): void => {
        if (!lastMessage) {
            return;
        }

        const data: ServerMessage = JSON.parse(lastMessage);

        if (!data?.name) {
            return;
        }

        if (data.name === "photoresistor") {
            if (typeof data.value === "number") {
                chartReference.current?.addValue(data.value);
            }

            if (typeof data.status === "boolean") {
                dispatch({
                    type: "SET_LED",
                    value: data.status,
                });
            }

            dispatch({
                type: "SET_ERROR",
                value: data.error ?? null,
            });
        }
    }, [lastMessage]);

    const handleButtonClick: () => void = (): void => {

        if (Date.now() - lastSendTimeReference.current < 500) {
            return;
        }

        lastSendTimeReference.current = Date.now();
        sendMessage(
            JSON.stringify({
                name: "mainButton",
                value: !state.isLedEnabled,
            })
        );
    };

    const handleThresholdChange: (event: ChangeEvent<HTMLInputElement>) =>
        void = (event: ChangeEvent<HTMLInputElement>): void => {

        const thresholdValue: number = parseFloat(event.target.value);

        if (isNaN(thresholdValue)) {
            return;
        }

        sendMessage(
            JSON.stringify({
                name: "threshold",
                value: thresholdValue,
            })
        );
    };

    return (
        <section className={"tab-content-section"}>
            <div className={"card shadow-sm"}>
                <div className={"card-header"}>
                    <span className={"mb-0"}>Photoresistor</span>

                    <button
                        className={"btn btn-primary btn-sm float-end"}
                        onClick={handleButtonClick}
                    >
                        {state.isLedEnabled ? "Turn off" : "Turn on"}
                    </button>
                </div>

                <div className={"card-body"}>
                    <div>
                        <TChart
                            ref={chartReference}
                            label={"Photoresistor"}
                        />
                    </div>

                    <div className={"d-flex align-items-center mb-3"}>
                        <label
                            htmlFor={"threshold"}
                            className={"form-label me-2 mb-0"}
                        >
                            Threshold
                        </label>

                        <input
                            type={"text"}
                            id={"threshold"}
                            className={"form-control shadow-none"}
                            placeholder={"Threshold"}
                            onChange={handleThresholdChange}
                        />
                    </div>

                    <p className={"mb-0"}>
                        Notice:{" "}
                        <span>
                            {state.error ? state.error : "No errors"}
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Photoresistor;
