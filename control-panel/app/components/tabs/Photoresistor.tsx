"use client";

import React, {ChangeEvent, JSX, RefObject, useEffect, useRef} from "react";

import TChart, { TChartHandle } from "@/app/components/TChart";
import useMessage from "@/hooks/useMessage";

const Photoresistor: () => JSX.Element = (): JSX.Element => {

    const chartReference: RefObject<TChartHandle | null> = useRef<TChartHandle | null>(null);
    const lastSendTimeReference: RefObject<number> = useRef<number>(0);

    const { data, sendMessage } = useMessage("photoresistor");

    const isLedEnabled: boolean = data?.status ?? false;

    useEffect((): void => {
        chartReference.current?.addValue(data?.values?.[0]);
    }, [data?.timestamp, data?.values]);

    const handleButtonClick: () => void = (): void => {

        if (Date.now() - lastSendTimeReference.current < 500) {
            return;
        }

        lastSendTimeReference.current = Date.now();

        sendMessage(
            JSON.stringify({
                name: "mainButton",
                value: !isLedEnabled,
            })
        );
    };

    const handleThresholdChange: (event: ChangeEvent<HTMLInputElement>) => void =
        (event: ChangeEvent<HTMLInputElement>): void => {

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
                        onClick={handleButtonClick}>
                        {isLedEnabled ? "Turn off" : "Turn on"}
                    </button>
                </div>

                <div className={"card-body"}>
                    <div>
                        <TChart ref={chartReference} label={"Photoresistor"} />
                    </div>

                    <div className={"d-flex align-items-center mb-3"}>
                        <label
                            htmlFor={"threshold"}
                            className={"form-label me-2 mb-0"}>
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
                            {data?.error ? data.error : "No errors"}
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Photoresistor;
