import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/common/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tutorly - AI-Powered Learning Platform',
  description:
    'Generate personalized courses with AI and track your learning progress',
  generator: 'v0.dev'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang='en' className="scroll-smooth" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="bottom-right" />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
