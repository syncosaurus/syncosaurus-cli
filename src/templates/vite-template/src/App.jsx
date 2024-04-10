import {useState} from 'react'
import viteLogo from './assets/vite.svg'
import reactLogo from './assets/react.svg'
import syncosaurusLogo from './assets/syncosaurus.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://syncosaurus.github.io/" target="_blank">
          <img src={syncosaurusLogo} className="logo syncosaurus" alt="Syncosaurus logo" />
        </a>
      </div>
      <h1>Vite + React + Syncosaurus</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite, React, and Syncosaurus logos to learn more</p>
    </>
  )
}

export default App
