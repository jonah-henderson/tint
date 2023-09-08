import { StrictMode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'
import NavigationBar from './components/NavigationBar'

const inter = Inter({ subsets: ['latin'], preload: true })

export const metadata: Metadata = {
  title: 'Tint',
  description: 'Trello clone demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex dark bg-gradient-to-br from-slate-600 to-slate-700`}>
        <StrictMode>
          <Providers>
            <div className="flex flex-col items-stretch w-full">
              <NavigationBar />
              <div className="flex h-full">
                {children}
              </div>
            </div>
          </Providers>
        </StrictMode>
      </body>
    </html>
  )
}
