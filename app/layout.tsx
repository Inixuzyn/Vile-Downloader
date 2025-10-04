import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vile Downloader | AIO Media Scraper",
  description: "Modern 3D-powered downloader for TikTok, Instagram, Spotify",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white`}>
        <Toaster position="top-center" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
