import "../app/globals.css"; // ✅ Import Tailwind styles
import ReactQueryProvider from "../providers/ReactQueryProvider";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
