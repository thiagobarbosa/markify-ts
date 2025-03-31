import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";


export const metadata: Metadata = {
  title: "Markify - Convert Websites to Markdown",
  description: "Easily convert any website to clean, formatted markdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
