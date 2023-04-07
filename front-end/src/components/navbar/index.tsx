import React from 'react'
import SalesPilotLogo from '../../assets/sales-pilot-logo.png'
import { toggleSidebar } from '../../initialize-extension'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'

const Navbar = () => {
    return (
        <Box height={32} display="flex" justifyContent="space-between" width="100%" marginBottom={4} paddingTop={3}>
            <Box>
                <img src={SalesPilotLogo} alt="logo" />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => toggleSidebar()}
                    style={{ marginRight: -12 }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Navbar
