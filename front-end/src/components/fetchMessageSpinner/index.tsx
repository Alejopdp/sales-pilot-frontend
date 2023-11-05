import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const messages = [
    'Analizando el perfil del usuario',
    'Analizando la empresa del usuario',
    'Consultando fuentes de información',
    'Combinando la información de los perfiles para definir los mejores ice-breakers',
    'Creando una intro empática con la información scrappeada',
    'Seleccionando las mejores variables para las preguntas de cierre',
    'Creando preguntas de cierre en base a tus producto/servicio',
    'Generando mensajes con olor a humano',
    'Detectamos que ChatGPT está tardando mas de lo normal, por favor espera un poco mas',
    'Ya casi tenemos tus mensajes',
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
        const intervalId = setInterval(intervalCallback, 10000)

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
