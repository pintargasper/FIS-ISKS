"use client";

import React, { JSX, useState } from "react";
import Photoresistor from "@/app/components/tabs/Photoresistor";
import TouchSensors from "@/app/components/tabs/TouchSensors";
import PotentiometerTab from "./components/tabs/Potentiometer";
import ConnectionStatus from "@/server/context/ConnectionStatus";
import { useWebSocket } from "@/server/context/WsContext";

interface TabDefinition {
    id: number;
    label: string;
    component: JSX.Element;
}

const Tabs: () => JSX.Element = (): JSX.Element => {

    const [activeTab, setActiveTab] = useState<number>(1);
    const { isConnected } = useWebSocket();

    const tabs: TabDefinition[] = [
        { id: 1, label: "Photoresistor", component: <Photoresistor /> },
        { id: 2, label: "Touch Sensors", component: <TouchSensors /> },
        { id: 3, label: "Potentiometer", component: <PotentiometerTab /> },
    ];

    const activeTabComponent: JSX.Element = tabs.find((tab: TabDefinition): boolean => tab.id === activeTab)?.component ?? <></>;

    return (
        <div className={"container mt-4"}>
            <div className={"main-tabs-sticky"}>
                <ConnectionStatus isConnected={isConnected} />

                <ul className={"nav nav-tabs justify-content-center flex-wrap"}>
                    {tabs.map((tab: TabDefinition): JSX.Element => (
                        <li className={"nav-item"} key={tab.id}>
                            <button
                                type={"button"}
                                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                                onClick={(): void => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={"tab-content mt-3 main-tabs-content"}>
                {activeTabComponent}
            </div>
        </div>
    );
};

export default Tabs;
