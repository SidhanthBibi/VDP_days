'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<Array<{
    day: string;
    time: string;
    course: string;
    attendees: number;
    rsvp: boolean;
  }>>([])
  const [projects, setProjects] = useState<{ name: string; date: string }[]>([])
  const [projectName, setProjectName] = useState('')
  const [projectDate, setProjectDate] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const rows = content.split('\n').map(row => row.split(','))
        const newTimetable = rows.slice(1).map(row => ({
          day: row[0],
          time: row[1],
          course: row[2],
          attendees: 0,
          rsvp: false
        }))
        setTimetable(newTimetable)
      }
      reader.readAsText(file)
    }
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName && projectDate) {
      setProjects([...projects, { name: projectName, date: projectDate }])
      setProjectName('')
      setProjectDate('')
    }
  }

  const handleRSVP = (index: number) => {
    setTimetable(timetable.map((item, i) => 
      i === index 
        ? { ...item, attendees: item.rsvp ? item.attendees - 1 : item.attendees + 1, rsvp: !item.rsvp } 
        : item
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Timetable Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Upload Timetable</h2>
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Add Project Submission</h2>
            <form onSubmit={handleAddProject} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <Input
                type="date"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                required
              />
              <Button type="submit">Add Project</Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {timetable.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Class Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>RSVP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.day}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.course}</TableCell>
                    <TableCell>{item.attendees}</TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => handleRSVP(index)}
                        variant={item.rsvp ? "destructive" : "default"}
                      >
                        {item.rsvp ? "Cancel RSVP" : "RSVP"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {projects.map((project, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{project.name}</span>
                  <span>{project.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}