import React from "react";
import Header from "../components/header";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3rem)] bg-background flex flex-col">
      <Header
        text="Prutas"
        Image="/01.png"/>
    </div>
  );
}
