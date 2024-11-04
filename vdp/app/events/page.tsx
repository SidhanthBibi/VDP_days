import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EventsPage() {
  const events = [
    { title: 'Welcome Week', date: '2023-09-01', location: 'Main Campus' },
    { title: 'Career Fair', date: '2023-09-15', location: 'Student Center' },
    { title: 'Guest Lecture: AI in Healthcare', date: '2023-09-22', location: 'Auditorium A' },
    { title: 'Homecoming Game', date: '2023-10-05', location: 'University Stadium' },
    { title: 'Fall Concert', date: '2023-10-20', location: 'Outdoor Amphitheater' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campus Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {events.map((event, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">Date: {event.date}</p>
              <p className="text-sm text-gray-600">Location: {event.location}</p>
              <Button className="mt-2">RSVP</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}