import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Timetable Manager</CardTitle>
          <CardDescription>Manage your class schedule, project deadlines, and RSVP to classes</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/timetable" className="text-blue-600 hover:underline">Go to Timetable</Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Community Chat</CardTitle>
          <CardDescription>Connect with your classmates and discuss coursework</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/chat" className="text-blue-600 hover:underline">Join Chat</Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Study Resources</CardTitle>
          <CardDescription>Access a library of study materials and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/resources" className="text-blue-600 hover:underline">Browse Resources</Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Keep track of your assignments and to-dos</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/tasks" className="text-blue-600 hover:underline">Manage Tasks</Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Grade Calculator</CardTitle>
          <CardDescription>Calculate your GPA and track your academic progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/grades" className="text-blue-600 hover:underline">Calculate Grades</Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Campus Events</CardTitle>
          <CardDescription>Stay updated with the latest campus events and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/events" className="text-blue-600 hover:underline">View Events</Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Attendance Calculator</CardTitle>
          <CardDescription>Track your attendance and calculate attendance percentages</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/attendance" className="text-blue-600 hover:underline">Calculate Attendance</Link>
        </CardContent>
      </Card>
    </div>
  )
}