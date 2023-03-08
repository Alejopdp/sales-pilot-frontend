import React from 'react'
import { Box, IconButton } from '@mui/material'
import './App.css'
import PreSearchSidebarContent from './components/preSearchSidebarContent'
import CloseIcon from '@mui/icons-material/Close'
import { toggleSidebar } from './initialize-extension'
import { SALES_PILOT_SIDEBAR_ID } from './constants'

function App() {
    return (
        <div id={SALES_PILOT_SIDEBAR_ID} className="sales-pilot-sidebar" style={{ backgroundColor: '#FAFAFA' }}>
            <Box height={32} display="flex" justifyContent="flex-end" width="100%" marginBottom={2}>
                <Box>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => toggleSidebar()}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            <PreSearchSidebarContent />
        </div>
    )
}

export default App
