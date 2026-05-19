"use client";

import type { ReactNode } from "react";
import type { JSX } from "react";
import WsProvider from "@/server/context/WsProvider";


export default function RootLayout({children,}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
      <html lang="en">
        <body className={"container"}>
            <WsProvider>
                <main className={"mt-2"}>{children}</main>
            </WsProvider>
        </body>
      </html>
  );
}
