import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-light-svg-icons'
import { Send } from '@mui/icons-material'

type FeedbackProps = {
    isFeedbackGranted: boolean
    handleFeedback: (isPositive: boolean, comment: string) => void
}

const Feedback = ({ handleFeedback, isFeedbackGranted }: FeedbackProps) => {
    const [showNegativeFeedbackInput, setShowNegativeFeedbackInput] = useState(false)
    const [negativeFeedback, setNegativeFeedback] = useState('')

    return (
        <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            {isFeedbackGranted ? (
                <Typography variant="h3">Gracias, tu mensaje nos ayuda a mejorar</Typography>
            ) : (
                <>
                    <Typography variant="h3">¿Qué te ha parecido el mensaje?</Typography>
                    <Typography variant="subtitle1">Tu feedback nos ayuda a seguir mejorando</Typography>
                    <Box display="flex" flexDirection="row" alignItems="center" marginTop={3} marginBottom={3}>
                        <Box display="flex" flexDirection="column" alignItems="center" marginRight={2}>
                            <FontAwesomeIcon
                                icon={faThumbsDown}
                                size="2x"
                                className="fa-icon"
                                onClick={() => setShowNegativeFeedbackInput(true)}
                                style={{ cursor: 'pointer', color: '#424242' }}
                            />
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="center" marginLeft={2}>
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                size="2x"
                                className="fa-icon"
                                onClick={() => handleFeedback(true, '')}
                                style={{ cursor: 'pointer', color: '#424242' }}
                            />
                        </Box>
                    </Box>
                    {showNegativeFeedbackInput && (
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography variant="subtitle1" marginBottom={3}>
                                Lamentamos que el mensaje no te haya parecido bueno. Nos ayudaría mucho que nos cuentes
                                qué es lo que no te ha gustado para poder mejorar nuestro producto
                            </Typography>

                            <TextField
                                placeholder="Escribe aquí el feedback"
                                multiline
                                style={{ marginBottom: 24 }}
                                value={negativeFeedback}
                                onChange={(e) => setNegativeFeedback(e.target.value)}
                            />

                            <Button
                                variant="outlined"
                                onClick={() => handleFeedback(false, negativeFeedback)}
                                style={{ height: 42 }}
                                startIcon={<Send />}
                            >
                                Enviar feedback
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    )
}

export default Feedback
