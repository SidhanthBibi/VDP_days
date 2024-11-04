import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Student Portal',
  description: 'A comprehensive platform for students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-blue-600 text-white p-4">
            <nav className="container mx-auto flex flex-wrap justify-between items-center">
              <Link href="/" className="text-2xl font-bold">Student Portal</Link>
              <ul className="flex flex-wrap space-x-4">
                <li><Link href="/timetable">Timetable</Link></li>
                <li><Link href="/chat">Chat</Link></li>
                <li><Link href="/resources">Resources</Link></li>
                <li><Link href="/tasks">Tasks</Link></li>
                <li><Link href="/grades">Grades</Link></li>
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/attendance">Attendance</Link></li>
              </ul>
            </nav>
          </header>
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-gray-200 p-4 text-center">
            <p>&copy; {new Date().getFullYear()} Student Portal. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}