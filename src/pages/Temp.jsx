// Example usage in a React component
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function ExampleComponent() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')

      if (error) throw error

      setData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {/* Render your data here */}
      {data.map((club,index) => (
        <div className='flex gap-10' key={index}>
          <h2 className='text-white'>{club.event_name}</h2>
          <p className='text-white'>{club.description}</p>
        </div>
      ))}
    </div>
  )
}

export default ExampleComponent