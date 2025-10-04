"use client";
import { motion } from "framer-motion";

export default function Result({ data, engine }: { data: any; engine: string }) {
  const list = Array.isArray(data) ? data : [data];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 grid gap-6 md:grid-cols-2"
    >
      {list.map((item: any, i: number) => (
        <motion.a
          key={i}
          href={item.url || item.mp3DownloadLink || item.download}
          target="_blank"
          rel="noreferrer"
          className="block p-5 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl hover:scale-105 transition"
        >
          <img
            src={item.thumbnail || item.coverImage || item.image}
            alt="thumb"
            className="rounded-xl mb-3 h-40 w-full object-cover"
          />
          <h3 className="font-bold truncate">{item.title || item.songTitle}</h3>
          <p className="text-sm text-gray-300">{item.artist || item.creator}</p>
        </motion.a>
      ))}
    </motion.div>
  );
}
