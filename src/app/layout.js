import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TimeFrame',
  description: '',
  manifest: "/manifest.json",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
            <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/logo/192x192.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
