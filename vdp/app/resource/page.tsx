import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ResourcesPage() {
  const resources = [
    { title: 'Introduction to Calculus', type: 'PDF', url: '#' },
    { title: 'History of Ancient Rome', type: 'Video', url: '#' },
    { title: 'Python Programming Basics', type: 'Interactive Tutorial', url: '#' },
    { title: 'Organic Chemistry Formulas', type: 'Cheat Sheet', url: '#' },
    { title: 'English Literature Study Guide', type: 'PDF', url: '#' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {resources.map((resource, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded">
              <div>
                <h3 className="font-semibold">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.type}</p>
              </div>
              <Button asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">View</a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}