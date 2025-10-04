"use client";
import { FaLink, FaDownload, FaMagic } from "react-icons/fa";

const steps = [
  { icon: FaLink, text: "Copy the media link from TikTok / Instagram / Spotify" },
  { icon: FaDownload, text: "Paste it into Vile Downloader and pick the engine" },
  { icon: FaMagic, text: "Hit Go! Your 3D download card appears instantly" },
];

export default function Tutorial() {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        {steps.map((s, idx) => (
          <div key={idx} className="text-center">
            <s.icon className="mx-auto text-5xl mb-4 text-cyan-300" />
            <p className="text-gray-300">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
