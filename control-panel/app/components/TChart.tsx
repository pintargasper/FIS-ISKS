"use client";

import React, {ForwardedRef, forwardRef, ForwardRefExoticComponent, JSX,
    RefAttributes, RefObject, useEffect, useImperativeHandle, useRef} from "react";

import {Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale,
    ChartData, ChartOptions, Point, ChartDataset} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

interface TChartProps {
    label: string;
    lineColor?: string;
    maxValue?: number;
}

interface ReferenceLine {
    id: string;
    value: number;
    color: string;
}

interface TChartHandle {
    addValue: (sensorValue: number | undefined) => void;
    clear: () => void;
    destroy: () => void;
    setReferenceLine: (line: ReferenceLine) => void;
}

const TChart: ForwardRefExoticComponent<TChartProps & RefAttributes<TChartHandle>> =
    forwardRef<TChartHandle, TChartProps>((props: TChartProps, ref: ForwardedRef<TChartHandle>): JSX.Element => {

        const canvasReference: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(null);
        const chartInstanceReference: RefObject<Chart<"line"> | null> = useRef<Chart<"line"> | null>(null);
        const labelsReference: RefObject<string[]> = useRef<string[]>([]);
        const dataValuesReference: RefObject<number[]> = useRef<number[]>([]);

        useEffect((): (() => void) => {
            if (!canvasReference.current) {
                return (): void => {};
            }

            const context: CanvasRenderingContext2D | null = canvasReference.current.getContext("2d");
            if (!context) {
                return (): void => {};
            }

            const chartData: ChartData<"line"> = {
                labels: labelsReference.current,
                datasets: [
                    {
                        label: props.label,
                        data: dataValuesReference.current,
                        borderColor: props.lineColor ?? "#cac7c7",
                        backgroundColor: "transparent",
                        pointRadius: 2
                    }
                ]
            };

            const chartOptions: ChartOptions<"line"> = {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: props.maxValue ?? 4095,
                        grid: { display: false }
                    }
                }
            };

            chartInstanceReference.current = new Chart(context, {
                type: "line",
                data: chartData,
                options: chartOptions
            });

            return (): void => {
                chartInstanceReference.current?.destroy();
                chartInstanceReference.current = null;
            };
        }, [props.label, props.lineColor, props.maxValue]);

        const addValue: (sensorValue: number | undefined) => void = (sensorValue: number | undefined): void => {
            const timestamp: string = new Date().toLocaleTimeString();

            labelsReference.current.push(timestamp);
            dataValuesReference.current.push(sensorValue ?? 0);

            if (labelsReference.current.length > 10) {
                labelsReference.current.shift();
                dataValuesReference.current.shift();
            }
            chartInstanceReference.current?.update();
        };

        const clear: () => void = (): void => {
            labelsReference.current.length = 0;
            dataValuesReference.current.length = 0;
            chartInstanceReference.current?.update();
        };

        const destroy: () => void = (): void => {
            chartInstanceReference.current?.destroy();
            chartInstanceReference.current = null;
        };

        const setReferenceLine: (line: ReferenceLine) => void = (line: ReferenceLine): void => {
            if (!chartInstanceReference.current) {
                return;
            }

            const chart: Chart<"line", (number | Point | null)[]> = chartInstanceReference.current;
            const index: number = chart.data.datasets.findIndex(
                (dataset: ChartDataset<"line", (number | Point | null)[]>): boolean => dataset.label === line.id
            );

            const lineData: (number | Point | null)[] = Array(labelsReference.current.length).fill(line.value);
            if (index === -1) {
                chart.data.datasets.push({
                    label: line.id,
                    data: lineData,
                    borderColor: line.color,
                    borderDash: [6, 4],
                    pointRadius: 0
                });
            } else {
                chart.data.datasets[index].data = lineData;
                chart.data.datasets[index].borderColor = line.color;
            }
            chart.update();
        };

        useImperativeHandle(ref, (): TChartHandle => ({
            addValue,
            clear,
            destroy,
            setReferenceLine
        }));

        return (
            <div>
                <canvas ref={canvasReference} />
            </div>
        );
    }
);

TChart.displayName = "TChart";

export type {
    TChartHandle
}

export default TChart;
