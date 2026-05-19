"use client";

import React, {JSX, useState} from "react";
import Photoresistor from "@/app/components/tabs/Photoresistor";
import TouchSensors from "@/app/components/tabs/TouchSensors";
import ConnectionStatus from "@/server/context/ConnectionStatus";
import { useWebSocket } from "@/server/context/WsContext";
import PotentiometerTab from "./components/tabs/Potentiometer";

const Tabs: () => JSX.Element = (): JSX.Element => {

    const [activeTab, setActiveTab] = useState<number>(1);
    const { isConnected } = useWebSocket();

    return (
        <div className={"container mt-4"}>
            <div className={"main-tabs-sticky"}>
                <ConnectionStatus isConnected={isConnected} />
                <ul className={"nav nav-tabs"}>
                    <li className={"nav-item"}>
                        <button
                            className={`nav-link${activeTab === 1 ? " active" : ""}`}
                            onClick={(): void => setActiveTab(1)}
                            type={"button"}>
                            Photoresistor
                        </button>
                    </li>
                    <li className={"nav-item"}>
                        <button
                            className={`nav-link${activeTab === 2 ? " active" : ""}`}
                            onClick={(): void => setActiveTab(2)}
                            type={"button"}>
                            Touch Sensors
                        </button>
                    </li>
                    <li className={"nav-item"}>
                        <button
                            className={`nav-link${activeTab === 3 ? " active" : ""}`}
                            onClick={(): void => setActiveTab(3)}
                            type={"button"}>
                            Potentiometer
                        </button>
                    </li>
                </ul>
            </div>
            <div className={"tab-content mt-3 main-tabs-content"}>
                {activeTab === 1 && <Photoresistor />}
                {activeTab === 2 && <TouchSensors />}
                {activeTab === 3 && <PotentiometerTab />}
            </div>
        </div>
    );
};

export default Tabs;
