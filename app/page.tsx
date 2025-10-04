"use client";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Downloader from "@/components/Downloader";
import Tutorial from "@/components/Tutorial";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Scene3D />
      <div className="relative z-10 container mx-auto px-6">
        <Hero />
        <Downloader />
        <Tutorial />
      </div>
    </main>
  );
}
