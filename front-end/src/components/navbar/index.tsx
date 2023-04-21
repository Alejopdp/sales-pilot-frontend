import React from 'react'
import SalesPilotLogo from '../../assets/sales-pilot-logo.png'
import { toggleSidebar } from '../../initialize-extension'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'
// const SalesPilotLogo = require('../../assets/sales-pilot-logo.png').default

const Navbar = () => {
    return (
        <Box display="flex" justifyContent="space-between" width="100%" marginBottom={4} paddingTop={3}>
            <img width={176} height={46} src={SalesPilotLogo} alt="logo" />
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => toggleSidebar()}
                    style={{ marginRight: -12, height: 48, width: 48, color: '#000000' }}
                >
                    <CloseIcon style={{ height: 24, width: 24, color: '#000000' }} />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Navbar
