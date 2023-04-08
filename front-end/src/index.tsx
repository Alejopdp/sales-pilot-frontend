import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack'
import { BackgroundProvider } from './context/backgroundConnection'
import { closeSidebarOnOutsideClick, initializeExtension } from './initialize-extension'
import { SALES_PILOT_DOM_CONTAINER_ID, SALES_PILOT_SIDEBAR_ACTIVE_CLASS, SALES_PILOT_SIDEBAR_ID } from './constants'
import { NavigationProvider } from './context/navigation'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme/theme'

let root
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

//@ts-ignore
if (process.env.NODE_ENV !== 'development') {
    initializeExtension()
    const linkedinDOMContainer = document.querySelector(`#${SALES_PILOT_DOM_CONTAINER_ID}`)
    const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
    if (!sidebar && linkedinDOMContainer) {
        root = ReactDOM.createRoot(linkedinDOMContainer!)
        root.render(
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <BackgroundProvider>
                        <NavigationProvider>
                            <App />
                        </NavigationProvider>
                    </BackgroundProvider>
                </SnackbarProvider>
            </ThemeProvider>
        )
    }
} else {
    const domNode = document.getElementById('root')
    root = ReactDOM.createRoot(domNode!)
    root.render(
        <>
            {process.env.NODE_ENV === 'development' && (
                <button
                    id="sales-pilot-button"
                    style={{ marginLeft: 'auto', position: 'fixed', right: 0 }}
                    onClick={toggleSidebar}
                >
                    toggle sidebar
                </button>
            )}
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <BackgroundProvider>
                        <NavigationProvider>
                            <App />
                        </NavigationProvider>
                    </BackgroundProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </>
    )
    setTimeout(() => closeSidebarOnOutsideClick(), 2000)
}

function toggleSidebar() {
    const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
    if (!sidebar) {
        alert('Sidebar is null')
        return
    }
    sidebar.classList.toggle(SALES_PILOT_SIDEBAR_ACTIVE_CLASS)
}
