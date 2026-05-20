"use client";

import React, {JSX, RefObject, useEffect, useRef} from "react";
import TChart, {TChartHandle} from "@/app/components/TChart";
import useMessage from "@/hooks/useMessage";

type StatusColor = typeof STATUS[keyof typeof STATUS]["color"];
type Status = typeof STATUS[keyof typeof STATUS];

interface ToleranceRange {
    lower: number;
    upper: number;
}

const TARGET_VALUE: number = 2048;
const TOLERANCE: number = 0.05;

const STATUS = {
    low: { id: "low", color: "blue", text: "Too low" },
    ok: { id: "ok", color: "green", text: "OK" },
    high: { id: "high", color: "red", text: "Too high" }
} as const;

const getToleranceRange:(target: number, tolerance: number) => ToleranceRange = (target: number, tolerance: number): ToleranceRange => {
    const toleranceValue: number = target * tolerance;
    return {
        lower: target - toleranceValue,
        upper: target + toleranceValue,
    };
};

const { lower: LOWER_BOUND, upper: UPPER_BOUND }: ToleranceRange = getToleranceRange(TARGET_VALUE, TOLERANCE);

const getStatus: (value: number) => Status = (value: number): Status => {
    return value < LOWER_BOUND ? STATUS.low : value > UPPER_BOUND ? STATUS.high : STATUS.ok;
};

const COLOR_CLASS_MAP: Record<StatusColor, string> = {
    blue: "primary",
    green: "success",
    red: "danger"
};

const Potentiometer: () => JSX.Element = (): JSX.Element => {

    const chartReference: RefObject<TChartHandle | null> = useRef<TChartHandle | null>(null);
    const { data, sendMessage } = useMessage("potentiometer");
    const status: Status = getStatus(data?.value ?? 0);
    const lastSentStatus: RefObject<string | null> = useRef<string | null>(null);

    useEffect((): void => {
        chartReference.current?.addValue(data?.value ?? 0);
        chartReference.current?.setReferenceLine({id: "target", value: 2048, color: "red"});

        if (lastSentStatus.current === status.id) {
            return;
        }

        lastSentStatus.current = status.id;
        sendMessage(
            JSON.stringify({
                name: "status",
                value: status.id,
            })
        );
    }, [data?.timestamp, data?.value, sendMessage, status]);

    return (
        <section className={"tab-content-section"}>
            <div className={"card shadow-sm"}>
                <div className={"card-header d-flex align-items-center justify-content-between"}>
                    <span>Potentiometer</span>
                    <span className={"fw-bold"}>
                        Status: {status.text}
                    </span>
                </div>

                <div className={"card-body"}>
                    <div className={"chart-wrapper mb-3"}>
                        <TChart ref={chartReference} label={"Potentiometer"} lineColor={"#9ae67e"} />
                        <div className={`rectangle ${status.color}`} />
                    </div>

                    <div className={"d-flex align-items-center gap-3 mb-3"}>
                        {Object.values(STATUS).map((statusItem: Status): JSX.Element => (
                            <span
                                key={statusItem.color}
                                className={`status-badge p-1 bg-${COLOR_CLASS_MAP[statusItem.color]} ${
                                    status.color === statusItem.color ? "is-active" : ""
                                }`}>
                                {statusItem.color.charAt(0).toUpperCase() + statusItem.color.slice(1)}: {statusItem.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Potentiometer;
