import React from 'react'
import { toggleSidebar } from '../../initialize-extension'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'
import SalesPilotLogo from '../../assets/logoSalesPilot.png'
import useApi from '../../hooks/useApi'
import { useAuth } from '../../context/auth.context'

const Navbar = () => {
    const { trackAnalyticEvent } = useApi()
    const { getUserDataFromLocalStorage } = useAuth()
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems={'center'}
            width="100%"
            marginBottom={4}
            paddingTop={3}
        >
            <img height={40} src={SalesPilotLogo} alt="logo" />
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => {
                        trackAnalyticEvent('close-sidebar', { ...getUserDataFromLocalStorage() })
                        toggleSidebar()
                    }}
                    style={{ marginRight: -12, height: 48, width: 48, color: '#000000' }}
                >
                    <CloseIcon style={{ height: 24, width: 24, color: '#000000' }} />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Navbar
