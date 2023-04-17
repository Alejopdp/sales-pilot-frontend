import React, { useState } from 'react'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-light-svg-icons'
import { Send } from '@mui/icons-material'

type FeedbackProps = {
    isFeedbackGranted: boolean
    handleFeedback: (isPositive: boolean, comment: string) => void
    isFeedbackSubmitting: boolean
}

const Feedback = ({ handleFeedback, isFeedbackGranted, isFeedbackSubmitting }: FeedbackProps) => {
    const [showNegativeFeedbackInput, setShowNegativeFeedbackInput] = useState(false)
    const [negativeFeedback, setNegativeFeedback] = useState('')

    const handleSubmitFeedback = () => {
        handleFeedback(false, negativeFeedback)
        setNegativeFeedback('')
    }

    return (
        <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            {isFeedbackGranted ? (
                <Typography variant="h3">Gracias, tu mensaje nos ayuda a mejorar</Typography>
            ) : (
                <>
                    <Typography variant="h3">¿Qué te ha parecido el mensaje?</Typography>
                    <Typography variant="subtitle1">Tu feedback nos ayuda a seguir mejorando</Typography>
                    <Box display="flex" flexDirection="row" alignItems="center" marginTop={3} marginBottom={3}>
                        {isFeedbackSubmitting && !showNegativeFeedbackInput ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Box display="flex" flexDirection="column" alignItems="center" marginRight={2}>
                                    <FontAwesomeIcon
                                        icon={faThumbsDown}
                                        size="2x"
                                        className="fa-icon"
                                        onClick={() => (isFeedbackSubmitting ? '' : setShowNegativeFeedbackInput(true))}
                                        style={{ cursor: 'pointer', color: '#424242' }}
                                    />
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="center" marginLeft={2}>
                                    <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        size="2x"
                                        className="fa-icon"
                                        onClick={() => (isFeedbackSubmitting ? '' : handleFeedback(true, ''))}
                                        style={{ cursor: 'pointer', color: '#424242' }}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                    {showNegativeFeedbackInput && (
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography variant="subtitle1" marginBottom={3}>
                                Lamentamos que el mensaje no te haya parecido bueno. Nos ayudaría mucho que nos cuentes
                                qué es lo que no te ha gustado para poder mejorar nuestro producto
                            </Typography>

                            {isFeedbackSubmitting ? (
                                <CircularProgress style={{ marginLeft: 'auto', marginRight: 'auto' }} />
                            ) : (
                                <>
                                    <TextField
                                        placeholder="Escribe aquí el feedback"
                                        multiline
                                        style={{ marginBottom: 24 }}
                                        value={negativeFeedback}
                                        onChange={(e) => setNegativeFeedback(e.target.value)}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleSubmitFeedback()}
                                        style={{
                                            height: 42,
                                            fontSize: 14,
                                            backgroundColor: '#2967F6',
                                            borderRadius: 60,
                                        }} //TODO: Make a component for styles or add it to the theme
                                        startIcon={<Send />}
                                    >
                                        Enviar feedback
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}
                </>
            )}
        </Box>
    )
}

export default Feedback
