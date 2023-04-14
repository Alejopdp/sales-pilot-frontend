import React, { useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import FileCopyIcon from '@mui/icons-material/FileCopy'

function resizeTextarea(event: any) {
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + 'px'
}

const GeneratedMessage = ({
    message,
    handleMessageChange,
}: {
    message: string
    handleMessageChange: (newMessage: string) => void
}) => {
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        resizeTextarea({ target: document.querySelector('textarea') })
    }, [message])

    const handleCopyMessage = async (message: string) => {
        enqueueSnackbar('Mensaje copiado', { variant: 'success' })
        navigator.clipboard.writeText(message)
    }

    return (
        <Box display={'flex'} flexDirection="column" marginBottom={2} width="100%">
            <Box marginBottom={3} display="flex">
                <textarea
                    value={message ?? ''}
                    style={{
                        border: 'none',
                        borderRadius: 8,
                        padding: 16,
                        backgroundColor: '#F3F2EF',
                        overflow: 'hidden',
                        resize: 'none',
                        flex: 1,
                        color: '#000',
                    }}
                    onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => resizeTextarea(e)}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleMessageChange(e.target.value)}
                />
            </Box>
            <Button
                variant="contained"
                onClick={() => handleCopyMessage(message)}
                style={{ height: 42, fontSize: 14, backgroundColor: '#2967F6', borderRadius: 60 }}
                startIcon={<FileCopyIcon />}
                fullWidth
            >
                Copiar mensaje
            </Button>
        </Box>
    )
}

export default GeneratedMessage
