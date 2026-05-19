"use client";

import React, {JSX, useState} from "react";
import TChart from "@/app/components/TChart";

const ledCount = 3;
const chartCount = 3;

const TouchSensors: () => JSX.Element = (): JSX.Element => {

    const [ledStatuses, ] = useState<boolean[]>(Array(ledCount).fill(false));
    const [visibleCharts, setVisibleCharts] = useState<boolean[]>(Array(chartCount).fill(false));

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
                            onClick={handleAddChart}
                        >
                            Add chart
                        </button>

                        <button
                            id={"removeChartButton"}
                            className={"btn btn-danger btn-sm"}
                            onClick={handleRemoveChart}
                        >
                            Remove chart
                        </button>
                    </div>
                </div>

                <div className={"card-body"}>
                    <div className={"row g-3 mb-4"}>
                        {[...Array(ledCount)].map((_: undefined, index: number): JSX.Element => (
                            <div className={"col-md-4"} key={index}>
                                <div className={"border rounded p-3 text-center"}>
                                    <h6>LED {index + 1}</h6>

                                    <span
                                        id={`ledStatus${index + 1}`}
                                        className={ledStatuses[index] ? "badge text-bg-success" : "badge text-bg-secondary"}
                                    >
                                        {ledStatuses[index] ? "On" : "Off"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div id={"touchChartsContainer"}>
                        {[...Array(chartCount)].map(
                            (_: undefined, index: number): JSX.Element | null =>
                                visibleCharts[index] ? (
                                    <div key={index} className={"mb-4"}>
                                        <h6>Touch pin {index + 1}</h6>

                                        <div>
                                            <TChart label={`Touch ${index + 1}`} />
                                        </div>
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
