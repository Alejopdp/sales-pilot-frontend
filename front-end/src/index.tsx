import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { SnackbarProvider } from 'notistack'
import { BackgroundProvider } from './context/backgroundConnection'
import { closeSidebarOnOutsideClick, initializeExtension } from './initialize-extension'
import { SALES_PILOT_DOM_CONTAINER_ID, SALES_PILOT_SIDEBAR_ID } from './constants'
import { NavigationProvider } from './context/navigation'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme/theme'
import { AuthProvider } from './context/auth.context'
import DevelopmentApp from './App.development'
import { MessageProvider } from './context/messages.context'
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
                <BackgroundProvider>
                    <MessageProvider>
                        <AuthProvider>
                            <SnackbarProvider>
                                <NavigationProvider>
                                    <App />
                                </NavigationProvider>
                            </SnackbarProvider>
                        </AuthProvider>
                    </MessageProvider>
                </BackgroundProvider>
            </ThemeProvider>
        )
    }
} else {
    const domNode = document.getElementById('root')
    root = ReactDOM.createRoot(domNode!)
    root.render(
        <>
            <ThemeProvider theme={theme}>
                <BackgroundProvider>
                    <MessageProvider>
                        <AuthProvider>
                            <SnackbarProvider>
                                <NavigationProvider>
                                    <DevelopmentApp />
                                </NavigationProvider>
                            </SnackbarProvider>
                        </AuthProvider>
                    </MessageProvider>
                </BackgroundProvider>
            </ThemeProvider>
        </>
    )
    setTimeout(() => closeSidebarOnOutsideClick(), 2000)
}
