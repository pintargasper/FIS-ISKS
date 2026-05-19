"use client";

import type { ReactNode } from "react";
import type { JSX } from "react";


export default function RootLayout({children,}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
      <html lang="en">
        <body className={"container"}>
          <main className={"mt-2"}>{children}</main>
        </body>
      </html>
  );
}
