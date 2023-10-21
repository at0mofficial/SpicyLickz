import './globals.css'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Spicy Lickz',
  description: 'Spicy Lickz is a online food delivery website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='font-poppins'>{children}</body>
    </html>
  )
}
