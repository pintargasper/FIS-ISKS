"use client";

import React, { JSX, useState } from "react";
import TChart from "@/app/components/TChart";

const TARGET_VALUE: number = 2048;
const TOLERANCE: number = 0.05;
const LOWER_BOUND: number = TARGET_VALUE * (1 - TOLERANCE);
const UPPER_BOUND: number = TARGET_VALUE * (1 + TOLERANCE);

const STATUS: Record<"low" | "ok" | "high", Status> = {
    low: { color: "blue", text: "Too low" },
    ok: { color: "green", text: "OK" },
    high: { color: "red", text: "Too high" },
} as const;

type StatusColor = typeof STATUS[keyof typeof STATUS]["color"];

interface Status {
    color: "blue" | "green" | "red";
    text: "Too low" | "OK" | "Too high";
}

const getStatus: (value: number) => Status = (value: number): Status =>
    value < LOWER_BOUND
        ? STATUS.low
        : value > UPPER_BOUND
            ? STATUS.high
            : STATUS.ok;

const COLOR_CLASS_MAP: Record<StatusColor, string> = {
    blue: "primary",
    green: "success",
    red: "danger",
};

const Potentiometer: () => JSX.Element = (): JSX.Element => {

    const [potValue] = useState<number>(2000);
    const status: Status = getStatus(potValue);

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
                        <TChart label={"Potentiometer"} />
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
