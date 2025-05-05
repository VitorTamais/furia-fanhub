'use client'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
