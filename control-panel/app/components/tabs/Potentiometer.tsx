"use client";

import React, { JSX, RefObject, useEffect, useRef } from "react";
import TChart, { TChartHandle } from "@/app/components/TChart";
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

const getToleranceRange: (target: number, tolerance: number) => ToleranceRange =
    (target: number, tolerance: number): ToleranceRange => {

        const toleranceValue: number = target * tolerance;

        return {
            lower: target - toleranceValue,
            upper: target + toleranceValue,
        };
    };

const { lower: LOWER_BOUND, upper: UPPER_BOUND }: ToleranceRange = getToleranceRange(TARGET_VALUE, TOLERANCE);

const getStatus: (value: number) => Status = (value: number): Status => {
    if (value < LOWER_BOUND) {
        return STATUS.low;
    }

    if (value > UPPER_BOUND) {
        return STATUS.high;
    }
    return STATUS.ok;
};

const COLOR_CLASS_MAP: Record<StatusColor, string> = {
    blue: "primary",
    green: "success",
    red: "danger"
};

const Potentiometer: () => JSX.Element = (): JSX.Element => {

    const chartReference: RefObject<TChartHandle | null> = useRef<TChartHandle | null>(null);

    const { data, sendMessage } = useMessage("potentiometer");

    const lastSentStatus: RefObject<string | null> = useRef<string | null>(null);
    const lastValue: RefObject<number | null> = useRef<number | null>(null);

    const currentValue: number = data?.values?.[0] ?? 0;
    const status: Status = getStatus(currentValue);

    useEffect((): void => {
        if (!data?.values || !chartReference.current) {
            return;
        }

        const value: number = data.values[0];
        if (lastValue.current === value && value != 0 && value != 4095) {
            return;
        }

        lastValue.current = value;
        chartReference.current.addValue(value);
        chartReference.current?.setReferenceLine({id: "target", value: TARGET_VALUE, color: "red"});
    }, [data?.timestamp, data?.values]);

    useEffect((): (() => void) | undefined => {
        const nextStatus: string = status.id;

        if (lastSentStatus.current === nextStatus) {
            return;
        }

        const timeout: NodeJS.Timeout = setTimeout((): void => {
            lastSentStatus.current = nextStatus;
            sendMessage(JSON.stringify({
                name: "status",
                value: nextStatus
            }));
        }, 120);

        return (): void => {
            clearTimeout(timeout);
        };
    }, [status.id, sendMessage]);

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
                        <TChart
                            ref={chartReference}
                            label={"Potentiometer"}
                            lineColor={"#9ae67e"}
                        />
                        <div className={`rectangle ${status.color}`} />
                    </div>

                    <div className={"d-flex align-items-center gap-3 mb-3"}>
                        {Object.values(STATUS).map((statusItem: Status): JSX.Element => (
                            <span
                                key={statusItem.color}
                                className={`status-badge p-1 bg-${COLOR_CLASS_MAP[statusItem.color]} ${
                                    status.color === statusItem.color ? "is-active" : ""
                                }`}>
                                {statusItem.color.charAt(0).toUpperCase() + statusItem.color.slice(1)}:{" "}
                                {statusItem.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Potentiometer;
