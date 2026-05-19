import type { ReactNode } from "react";
import type { JSX } from "react";
import WsProvider from "@/server/context/WsProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/style.css"
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "ISKS Control Panel",
    description: "Real time sensor monitoring system",
    authors: [{ name: "Gašper Pintar" }],
    creator: "Gašper Pintar"
};

const RootLayout: ({children}: Readonly<{ children: ReactNode }>) => JSX.Element = ({children}: Readonly<{
    children: ReactNode
}>): JSX.Element => {
    return (
        <html lang={"en"}>
            <body className={"container"}>
                <WsProvider>
                    <main className={"mt-2"}>
                        {children}
                    </main>
                </WsProvider>
            </body>
        </html>
    );
};

export default RootLayout
