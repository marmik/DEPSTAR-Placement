import { useState } from 'react'
import './App.css'
import { AiFillApi } from "react-icons/ai";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <AiFillApi size = '25px' color='gray'/>
      <AiFillApi size = '50px' color='black'/>
      <AiFillApi size = '100px' color='red'/>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </div>
    </>
  )
}

export default App
