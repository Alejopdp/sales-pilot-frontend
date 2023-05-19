import React, { useEffect } from 'react'
import { Box, Button, TextField } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import useApi from '../../hooks/useApi'
import Textarea from '../textarea'

const GeneratedMessage = ({
    message,
    handleMessageChange,
    messageId,
}: {
    message: string
    handleMessageChange: (newMessage: string, messageId: string) => void
    messageId: string
}) => {
    const [wasCopied, setWasCopied] = React.useState(false)
    const { saveCopiedMessage } = useApi()

    const handleCopyMessage = async (message: string) => {
        if (wasCopied) return
        setWasCopied(true)
        navigator.clipboard.writeText(message)

        window.setTimeout(() => {
            setWasCopied(false)
        }, 3000)
        saveCopiedMessage(messageId, message)
    }

    return (
        <Box display={'flex'} flexDirection="column" marginBottom={2} width="100%">
            <Box marginBottom={3} display="flex">
                <Textarea
                    handleMessageChange={(newMessage: string) => handleMessageChange(newMessage, messageId)}
                    value={message}
                />
                {/* <textarea
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
                /> */}
            </Box>

            <Button
                variant="contained"
                onClick={() => handleCopyMessage(message)}
                style={{
                    height: 42,
                    fontSize: 14,
                    backgroundColor: wasCopied ? '#00A642' : '#2967F6',
                    borderRadius: 60,
                }}
                startIcon={wasCopied ? <CheckCircleIcon /> : <FileCopyIcon />}
                fullWidth
            >
                {wasCopied ? 'Texto copiado en portapapeles' : 'Copiar mensaje'}
            </Button>
        </Box>
    )
}

export default GeneratedMessage
