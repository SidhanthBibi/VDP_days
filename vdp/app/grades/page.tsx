'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GradesPage() {
  const [courses, setCourses] = useState<{ name: string; grade: number; credits: number }[]>([])
  const [courseName, setCourseName] = useState('')
  const [grade, setGrade] = useState('')
  const [credits, setCredits] = useState('')

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (courseName && grade && credits) {
      setCourses([...courses, { name: courseName, grade: Number(grade), credits: Number(credits) }])
      setCourseName('')
      setGrade('')
      setCredits('')
    }
  }

  const calculateGPA = () => {
    if (courses.length === 0) return 0
    const totalPoints = courses.reduce((sum, course) => sum + course.grade * course.credits, 0)
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
    return totalPoints / totalCredits
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Calculator</CardTitle>
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
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade (0-4)"
            min="0"
            max="4"
            step="0.1"
            required
          />
          <Input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="Credits"
            min="1"
            required
          />
          <Button type="submit">Add Course</Button>
        </form>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{course.name}</span>
              <span>Grade: {course.grade.toFixed(1)} | Credits: {course.credits}</span>
            </div>
          ))}
        </div>
        {courses.length > 0 && (
          <div className="mt-4 text-xl font-bold">
            GPA: {calculateGPA().toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}