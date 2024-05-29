import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AddData from "./pages/AddData";
// import Update from "./pages/Update";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/adddata" element={<AddData/>}/>
          <Route path="/adddata/:id" element={<AddData/>}/>
          {/* <Route path="/update/:id" element={<Update/>}/> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
