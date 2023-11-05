import React, { useState } from 'react'
import './App.css'
import { SALES_PILOT_PROFILE_BUTTON_ID, SALES_PILOT_SIDEBAR_ACTIVE_CLASS, SALES_PILOT_SIDEBAR_ID } from './constants'
import Navbar from './components/navbar'
import PreSearchSidebarContent from './components/preSearchSidebarContent'
import { useAuth } from './context/auth.context'
import { CircularProgress } from '@mui/material'
import SignIn from './components/signIn'
import FooterMenu from './components/footerMenu'

function toggleSidebar() {
    const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
    if (!sidebar) {
        console.error('Sidebar is null')
        return
    }
    sidebar.classList.toggle(SALES_PILOT_SIDEBAR_ACTIVE_CLASS)
}

function DevelopmentApp() {
    const { handleSignIn, isAuthenticating, isAuthenticated } = useAuth()
    const [test, setTest] = useState('')

    return (
        <>
            <button
                id={SALES_PILOT_PROFILE_BUTTON_ID}
                style={{ marginLeft: 'auto', position: 'fixed', right: 0 }}
                onClick={toggleSidebar}
            >
                toggle sidebar
            </button>
            {isAuthenticated ? (
                <></>
            ) : isAuthenticating ? (
                <CircularProgress style={{ marginLeft: 'auto', position: 'fixed', right: 0, marginTop: 32 }} />
            ) : (
                <button
                    style={{ marginLeft: 'auto', position: 'fixed', right: 0, marginTop: 32 }}
                    onClick={handleSignIn}
                >
                    sign in w linkedin
                </button>
            )}
            <div id={SALES_PILOT_SIDEBAR_ID} className="sales-pilot-sidebar">
                <Navbar />
                {isAuthenticated ? <PreSearchSidebarContent /> : <SignIn />}
                <FooterMenu />
            </div>
        </>
    )
}

export default DevelopmentApp
