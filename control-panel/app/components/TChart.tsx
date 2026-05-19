"use client";

import React, {
    ForwardedRef, forwardRef, ForwardRefExoticComponent,
    JSX, RefAttributes, RefObject,
    useEffect,
    useImperativeHandle,
    useRef
} from "react";

import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    ChartData,
    ChartOptions
} from "chart.js";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
);

interface TChartProps {
    label: string;
}

export interface TChartHandle {
    addValue: (sensorValue: number) => void;
    clear: () => void;
    destroy: () => void;
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
                        data: dataValuesReference.current
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
                        max: 4095,
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
        }, [props.label]);

        const addValue: (sensorValue: number) => void = (sensorValue: number): void => {
            const timestamp: string = new Date().toLocaleTimeString();

            labelsReference.current.push(timestamp);
            dataValuesReference.current.push(sensorValue);

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

        useImperativeHandle(ref, (): TChartHandle => ({
            addValue,
            clear,
            destroy
        }));

        return (
            <div>
                <canvas ref={canvasReference} />
            </div>
        );
    }
);

TChart.displayName = "TChart";
export default TChart;
