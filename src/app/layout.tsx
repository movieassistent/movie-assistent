import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Movie Assistent',
  description: 'Movie Assistent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-[#141414] text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}