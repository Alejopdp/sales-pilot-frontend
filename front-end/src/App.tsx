import React from 'react'
import './App.css'
import PreSearchSidebarContent from './components/preSearchSidebarContent'
import { SALES_PILOT_SIDEBAR_ID } from './constants'
import Navbar from './components/navbar'
import { useAuth } from './context/auth.context'
import SignIn from './components/signIn'

function App() {
    const { isAuthenticated } = useAuth()

    return (
        <div id={SALES_PILOT_SIDEBAR_ID} className="sales-pilot-sidebar">
            <Navbar />
            {isAuthenticated ? <PreSearchSidebarContent /> : <SignIn />}
        </div>
    )
}

export default App
