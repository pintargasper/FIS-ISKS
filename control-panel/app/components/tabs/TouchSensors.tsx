"use client";

import React, {JSX, RefObject, useEffect, useRef, useState} from "react";
import TChart, {TChartHandle} from "@/app/components/TChart";
import useMessage from "@/hooks/useMessage";

const ledCount: number = 3;
const chartCount: number = 3;
const TOUCH_THRESHOLD: number = 30;

const TouchSensors: () => JSX.Element = (): JSX.Element => {

    const [visibleCharts, setVisibleCharts] = useState<boolean[]>(Array(chartCount).fill(false));
    const [ledStates, setLedStates] = useState<boolean[]>([false, false, false]);
    const chartReferences: RefObject<(TChartHandle | null)[]> = useRef<(TChartHandle | null)[]>([]);
    const lastButtonValue: React.RefObject<number> = useRef<number>(1);
    const chartIndex: React.RefObject<number> = useRef<number>(0);
    const lastTouchState: RefObject<boolean[]> = useRef<boolean[]>([false, false, false]);
    const lastSentRef: React.RefObject<string> = useRef<string>("");

    const { data, sendMessage } = useMessage("touchSensors");

    useEffect((): void => {
        if (!data?.values) {
            return;
        }

        data.values.forEach((value: number, index: number): void => {
            chartReferences.current[index]?.addValue(value);
        });
    }, [data?.timestamp, data?.values]);

    useEffect((): void => {
        if (!data?.values) {
            return;
        }

        const nextTouchStates: boolean[] = [...lastTouchState.current];

        for (let index: number = 0; index < ledCount; index++) {
            const sensorValue: number = data.values[index] ?? 999;
            const isActive: boolean = sensorValue < TOUCH_THRESHOLD;
            const wasActive: boolean = lastTouchState.current[index];

            if (isActive && !wasActive) {
                setLedStates((previousStates: boolean[]): boolean[] => {
                    const updated: boolean[] = [...previousStates];
                    updated[index] = !updated[index];
                    return updated;
                });
            }
            nextTouchStates[index] = isActive;
        }
        lastTouchState.current = nextTouchStates;
    }, [data?.values]);

    useEffect((): void => {
        const previousState: string = lastSentRef.current;
        const currentState: string = JSON.stringify(ledStates);

        if (previousState === currentState) {
            return;
        }
        lastSentRef.current = currentState;

        sendMessage(
            JSON.stringify({
                name: "led",
                value: ledStates,
            })
        );
    }, [ledStates, sendMessage]);

    const buttonValue: number | undefined =
        data?.values && data.values.length > 0
            ? data.values[data.values.length - 1]
            : undefined;

    useEffect((): void => {

        if (buttonValue === undefined) {
            return;
        }

        if (lastButtonValue.current === 1 && buttonValue === 0) {
            if (chartIndex.current < chartCount) {
                const updated: boolean[] = [...visibleCharts];
                updated[chartIndex.current] = true;

                setVisibleCharts(updated);
                chartIndex.current += 1;
            } else {
                setVisibleCharts(Array(chartCount).fill(false));
                chartIndex.current = 0;
            }
        }
        lastButtonValue.current = buttonValue;
    }, [buttonValue, visibleCharts]);

    const handleAddChart: () => void = (): void => {
        const index: number = visibleCharts.indexOf(false);
        if (index !== -1) {
            const updated: boolean[] = [...visibleCharts];
            updated[index] = true;
            setVisibleCharts(updated);
        }
    };

    const handleRemoveChart: () => void = (): void => {
        const index: number = visibleCharts.lastIndexOf(true);
        if (index !== -1) {
            const updated: boolean[] = [...visibleCharts];
            updated[index] = false;
            setVisibleCharts(updated);
        }
    };

    return (
        <section className={"tab-content-section"}>
            <div className={"card shadow-sm"}>
                <div className={"card-header d-flex justify-content-between align-items-center"}>
                    <span>Touch Sensors</span>
                    <div className={"d-flex gap-2 ms-auto"}>
                        <button
                            id={"toggleChartsButton"}
                            className={"btn btn-primary btn-sm"}
                            onClick={handleAddChart}>
                            Add chart
                        </button>
                        <button
                            id={"removeChartButton"}
                            className={"btn btn-danger btn-sm"}
                            onClick={handleRemoveChart}>
                            Remove chart
                        </button>
                    </div>
                </div>

                <div className={"card-body"}>
                    <div className={"row g-3 mb-4"}>
                        {Array.from({ length: ledCount }, (_: unknown, index: number): JSX.Element => (
                            <div className={"col-md-4"} key={index}>
                                <div className={"border rounded p-3 text-center"}>
                                    <h6>LED {index + 1}</h6>
                                    <span
                                        id={`ledStatus${index + 1}`}
                                        className={ledStates[index] ? "badge text-bg-success" : "badge text-bg-secondary"}>
                                        {ledStates[index] ? "On" : "Off"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div id={"touchChartsContainer"}>
                        {Array.from({ length: chartCount }, (_: unknown, index: number): JSX.Element | null =>
                            visibleCharts[index] ? (
                                <div key={index} className={"mb-4"}>
                                    <h6>Touch pin {index + 1}</h6>
                                    <TChart
                                        label={`Touch ${index + 1}`}
                                        maxValue={100}
                                        ref={(element: TChartHandle | null): void => {
                                            chartReferences.current[index] = element;
                                        }}
                                    />
                                </div>
                            ) : null
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TouchSensors;
