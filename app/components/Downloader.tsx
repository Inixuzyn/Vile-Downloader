"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import useDownloader from "@/hooks/useDownloader";
import Result from "@/components/Result";

const engines = [
  { id: "tiktok", name: "TikTok", color: "bg-pink-600" },
  { id: "igdl", name: "Instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "spotify", name: "Spotify", color: "bg-green-600" },
];

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [engine, setEngine] = useState<typeof engines[0]>(engines[0]);
  const { data, error, isLoading, trigger } = useDownloader(engine.id);

  const onDownload = () => {
    if (!url.trim()) return toast.error("Paste a link first");
    trigger(url.trim());
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-wrap gap-3 mb-4">
          {engines.map((e) => (
            <button
              key={e.id}
              onClick={() => setEngine(e)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${e.color} ${
                engine.id === e.id ? "ring-4 ring-white/50" : ""
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`Paste ${engine.name} link here…`}
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            onClick={onDownload}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-white text-black font-bold disabled:opacity-50"
          >
            {isLoading ? "…" : "Go"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

      {data && <Result data={data} engine={engine.id} />}
    </div>
  );
}
