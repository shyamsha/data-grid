"use client";

import { DataGrid } from "../components/DataGrid/DataGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto h-screen">
        <DataGrid />
      </div>
    </main>
  );
}
