import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import StoreProvider from '@/redux/StoreProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Modern Blog',
  description: 'A modern blog management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster position="top-right" />
        </StoreProvider>
      </body>
    </html>
  )
}
