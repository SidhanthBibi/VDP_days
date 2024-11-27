'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AttendancePage() {
  const [courses, setCourses] = useState<{ name: string; attended: number; total: number }[]>([])
  const [courseName, setCourseName] = useState('')
  const [attendedClasses, setAttendedClasses] = useState('')
  const [totalClasses, setTotalClasses] = useState('')

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (courseName && attendedClasses && totalClasses) {
      setCourses([...courses, { 
        name: courseName, 
        attended: Number(attendedClasses), 
        total: Number(totalClasses) 
      }])
      setCourseName('')
      setAttendedClasses('')
      setTotalClasses('')
    }
  }

  const calculateAttendance = (attended: number, total: number) => {
    return ((attended / total) * 100).toFixed(2)
  }

  const calculateOverallAttendance = () => {
    const totalAttended = courses.reduce((sum, course) => sum + course.attended, 0)
    const totalClasses = courses.reduce((sum, course) => sum + course.total, 0)
    return calculateAttendance(totalAttended, totalClasses)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddCourse} className="space-y-4 mb-4">
          <Input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            required
          />
          <Input
            type="number"
            value={attendedClasses}
            onChange={(e) => setAttendedClasses(e.target.value)}
            placeholder="Attended Classes"
            min="0"
            required
          />
          <Input
            type="number"
            value={totalClasses}
            onChange={(e) => setTotalClasses(e.target.value)}
            placeholder="Total Classes"
            min="1"
            required
          />
          <Button type="submit">Add Course</Button>
        </form>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{course.name}</span>
              <Badge variant="secondary">
                Attendance: {calculateAttendance(course.attended, course.total)}% 
                ({course.attended}/{course.total})
              </Badge>
            </div>
          ))}
        </div>
        {courses.length > 0 && (
          <div className="mt-4 text-xl font-bold">
            Overall Attendance: <Badge variant="default">{calculateOverallAttendance()}%</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
