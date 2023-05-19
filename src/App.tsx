import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './components/Home/Home'
import FlexGround from './components/FlexGround'
import axios from 'axios'
import './App.css'

function App() {
    if (process.env.NODE_ENV === 'development') {
        axios.defaults.baseURL = 'http://localhost:3000'
    }
    else {
        axios.defaults.baseURL = 'http://localhost:3000'
    }

    return (
        <>
            
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/flexground" element={<FlexGround />} />
                </Routes>

            </BrowserRouter>
        </>
    )
}

export default App
