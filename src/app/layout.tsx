import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { DataGridProvider } from "../contexts/DataGridContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Custom Data Grid",
  description: "A custom data grid component built with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <DataGridProvider>{children}</DataGridProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
