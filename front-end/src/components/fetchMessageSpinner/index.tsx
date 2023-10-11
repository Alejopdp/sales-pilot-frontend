import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const messages = [
    'Analizando el perfil del usuario',
    'Analizando la empresa del usuario',
    'Consultando fuentes de información',
    'Creando introducciones empáticas',
    'Creando preguntas de cierre',
    'Generando mensajes con olor a humano',
]

const FetchMessageSpinner = () => {
    const [spinnerIndex, setSpinnerIndex] = useState(0)

    const intervalCallback = useCallback(() => {
        setSpinnerIndex((actualState) => {
            if (actualState + 1 === messages.length) return actualState

            return actualState + 1
        })
    }, [spinnerIndex])

    useEffect(() => {
        const intervalId = setInterval(intervalCallback, 7000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            <CircularProgress size={50} />
            <Typography variant="subtitle1" marginTop={2}>
                {messages[spinnerIndex]}
            </Typography>
        </Box>
    )
}

export default FetchMessageSpinner
