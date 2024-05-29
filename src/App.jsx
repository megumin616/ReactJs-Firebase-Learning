import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Form from './pages/Form'
import Edit from './pages/Edit'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/form' element={<Form/>}/>
         <Route path='/edit/:id' element={<Edit/>}/>
       </Routes>
    </BrowserRouter>
  )
}

export default App
