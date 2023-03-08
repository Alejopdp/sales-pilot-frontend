import React from 'react'
import PropTypes from 'prop-types'
import { Box, Typography, Button } from '@mui/material'
import { useSnackbar } from 'notistack'

const GeneratedMessage = ({ message }: { message: string }) => {
    const { enqueueSnackbar } = useSnackbar()

    const handleCopyMessage = async (message: string) => {
        enqueueSnackbar('Mensaje copiado', { variant: 'success' })
        navigator.clipboard.writeText(message)
    }

    return (
        <Box display={'flex'} justifyContent="space-between" alignItems="center" marginBottom={2}>
            <Typography maxWidth={'80%'} fontSize={14}>
                {message}
            </Typography>
            <Button
                variant="text"
                onClick={() => handleCopyMessage(message)}
                style={{ height: 'fit-content', fontSize: 14 }}
            >
                Copiar
            </Button>
        </Box>
    )
}

GeneratedMessage.propTypes = {}

export default GeneratedMessage
