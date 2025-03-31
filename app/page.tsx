import MarkdownConverter from "./components/MarkdownConverter";

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-24 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-primary">Markify</h1>
      <p className="text-lg mb-12 text-muted-foreground text-center max-w-2xl">
        Convert any web page to clean, formatted markdown with a single click
      </p>
      <MarkdownConverter />
    </main>
  );
}
