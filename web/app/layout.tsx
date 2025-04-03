import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { cookies } from 'next/headers'
import { cn } from '@/lib/utils'
import { ActiveThemeProvider } from '@/components/active-theme'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Markify',
  description: 'Convert web pages and HTML snippets into Markdown',
}

const fontVariables = cn(
  geistSans.variable,
  geistMono.variable,
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get('active_theme')?.value
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        'bg-background overscroll-none font-sans antialiased',
        activeThemeValue ? `theme-${activeThemeValue}` : '',
        fontVariables,
      )}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableColorScheme
    >
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        {children}
      </ActiveThemeProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}
