import React from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../../context/auth.context'
import { LinkedIn } from '@mui/icons-material'

const SignIn = () => {
    const { handleSignIn, isAuthenticating } = useAuth()
    return (
        <Box display={'flex'} flexDirection={'column'} marginTop={'auto'} marginBottom={'auto'}>
            <Typography variant="h3" textAlign="center" marginBottom={1}>
                Hola 👋 Te damos la bienvenida a SalesPilot
            </Typography>
            <Typography variant="subtitle1" textAlign="center" marginBottom={4}>
                Ingresa a la herramienta que te ayudará a potenciar tus ventas a través de LinkedIn
            </Typography>
            {isAuthenticating ? (
                <Box display="flex" justifyContent={'center'} width="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <Button
                    variant="contained"
                    onClick={handleSignIn}
                    fullWidth
                    style={{ marginBottom: 16, height: 42, fontSize: 14, backgroundColor: '#2967F6', borderRadius: 60 }}
                    startIcon={<LinkedIn />}
                >
                    Continuar con Linkedin
                </Button>
            )}{' '}
            <Typography variant="subtitle1" textAlign="center">
                Al ingresar aceptas los términos y condiciones y políticas de privacidad de SalesPilot
            </Typography>
        </Box>
    )
}

export default SignIn
