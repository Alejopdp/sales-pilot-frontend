import React from 'react'
import './App.css'
import PreSearchSidebarContent from './components/preSearchSidebarContent'
import { SALES_PILOT_SIDEBAR_ID } from './constants'
import Navbar from './components/navbar'

function App() {
    return (
        <div id={SALES_PILOT_SIDEBAR_ID} className="sales-pilot-sidebar">
            <Navbar />
            <PreSearchSidebarContent />
        </div>
    )
}

export default App
