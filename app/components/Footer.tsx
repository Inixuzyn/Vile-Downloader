export default function Footer() {
  return (
    <footer className="py-8 text-center text-gray-400 text-sm">
      © {new Date().getFullYear()} Vile Downloader — Built with ❤️ & Next.js 14
      <br />
      <a
        href="https://github.com/yourname/vile-downloader"
        target="_blank"
        rel="noreferrer"
        className="underline hover:text-white"
      >
        Open-source on GitHub
      </a>
    </footer>
  );
}
