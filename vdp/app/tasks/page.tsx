import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Initialize todos from localStorage
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [inputValue, setInputValue] = useState<string>('')
  const [showCompleted, setShowCompleted] = useState<boolean>(false)

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const activeTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (inputValue.trim() === '') return
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const toggleTodo = (id: number): void => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="app">
      <h1>Todo List</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>

      <div className="todos-container">
        <h2>Active Tasks</h2>
        <ul className="todo-list">
          {activeTodos.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>

        {completedTodos.length > 0 && (
          <div className="completed-section">
            <button 
              className="completed-toggle"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              Completed Tasks ({completedTodos.length}) {showCompleted ? '▼' : '▶'}
            </button>
            
            {showCompleted && (
              <ul className="todo-list completed-list">
                {completedTodos.map(todo => (
                  <li key={todo.id} className="completed">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span>{todo.text}</span>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App 
