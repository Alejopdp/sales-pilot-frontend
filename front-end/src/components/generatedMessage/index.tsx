import React, { useEffect } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import useApi from '../../hooks/useApi'
import Textarea from '../textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/pro-light-svg-icons'
import { useMessageStore } from '../../context/messages.context'

const GeneratedMessage = ({
    handleMessageChange,
}: {
    handleMessageChange: (newMessage: string, messageId: string) => void
}) => {
    const { response, messageIndex, setMessageIndex } = useMessageStore()
    const [wasCopied, setWasCopied] = React.useState(false)
    const { saveCopiedMessage } = useApi()

    const handleCopyMessage = async (message: string) => {
        if (wasCopied) return
        setWasCopied(true)
        navigator.clipboard.writeText(message)

        window.setTimeout(() => {
            setWasCopied(false)
        }, 3000)
        saveCopiedMessage(response.messages[messageIndex].id, message)
    }

    const handleMessageCarousel = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            if (messageIndex === 0) return
            setMessageIndex(messageIndex - 1)
        } else {
            if (messageIndex === response.messages.length - 1) return
            setMessageIndex(messageIndex + 1)
        }
    }

    return (
        <Box display={'flex'} flexDirection="column" marginBottom={2} width="100%">
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h6">Mensaje {`(${messageIndex + 1} de ${response.messages.length})`}</Typography>
                {response.messages.length > 0 && (
                    <Box display="flex" marginBottom={1}>
                        {messageIndex !== 0 && (
                            <FontAwesomeIcon
                                icon={faCircleChevronLeft}
                                onClick={() => handleMessageCarousel('left')}
                                size="2x"
                                style={{ cursor: 'pointer', color: '#2967F6' }}
                            />
                        )}
                        {messageIndex !== response.messages.length - 1 && (
                            <FontAwesomeIcon
                                icon={faCircleChevronRight}
                                onClick={() => handleMessageCarousel('right')}
                                size="2x"
                                style={{ cursor: 'pointer', color: '#2967F6', marginLeft: 8 }}
                            />
                        )}
                    </Box>
                )}
            </Box>
            <Box marginBottom={3} display="flex">
                <Textarea
                    handleMessageChange={(newMessage: string) =>
                        handleMessageChange(newMessage, response.messages[messageIndex].id)
                    }
                    value={response.messages[messageIndex]?.content ?? ''}
                />
            </Box>

            <Button
                variant="contained"
                onClick={() => handleCopyMessage(response.messages[messageIndex]?.content ?? '')}
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
