import React, { useState } from 'react'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-light-svg-icons'
import { faThumbsDown as faThumbsDownSolid, faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons'
import { Send } from '@mui/icons-material'
import Textarea from '../textarea'
import useApi from '../../hooks/useApi'
import { useAuth } from '../../context/auth.context'
import { useMessageStore } from '../../context/messages.context'

type FeedbackProps = {
    isFeedbackGranted: boolean
    handleFeedback: (isPositive: boolean, comment: string) => void
    isFeedbackSubmitting: boolean
}

const Feedback = ({ handleFeedback, isFeedbackGranted, isFeedbackSubmitting }: FeedbackProps) => {
    const { getUserDataFromLocalStorage } = useAuth()
    const { trackAnalyticEvent } = useApi()
    const { response, messageIndex } = useMessageStore()
    const [showNegativeFeedbackInput, setShowNegativeFeedbackInput] = useState(false)
    const [negativeFeedback, setNegativeFeedback] = useState('')
    const [isNegativeFeedbackHovered, setIsNegativeFeedbackHovered] = useState(false)
    const [isPositiveFeedbackHovered, setIsPositiveFeedbackHovered] = useState(false)

    const handleSubmitFeedback = () => {
        trackAnalyticEvent('send-feedback', {
            ...getUserDataFromLocalStorage(),
            messageId: response.messages[messageIndex]?.id ?? '',
            feedback: negativeFeedback,
        })
        handleFeedback(false, negativeFeedback)
        setNegativeFeedback('')
        setShowNegativeFeedbackInput(false)
        setIsNegativeFeedbackHovered(false)
        setIsPositiveFeedbackHovered(false)
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
                                        icon={
                                            showNegativeFeedbackInput || isNegativeFeedbackHovered
                                                ? faThumbsDownSolid
                                                : faThumbsDown
                                        }
                                        size="2x"
                                        className={`fa-icon fa-thumbs-down${
                                            showNegativeFeedbackInput ? ' fa-thumbs-down-selected' : ''
                                        }`}
                                        onMouseEnter={() => setIsNegativeFeedbackHovered(true)}
                                        onMouseLeave={() => setIsNegativeFeedbackHovered(false)}
                                        onClick={
                                            isFeedbackSubmitting
                                                ? () => ''
                                                : () => {
                                                      setShowNegativeFeedbackInput(true)
                                                      trackAnalyticEvent('dislike-message', {
                                                          ...getUserDataFromLocalStorage(),
                                                          messageId: response.messages[messageIndex]?.id ?? '',
                                                      })
                                                  }
                                        }
                                    />
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="center" marginLeft={2}>
                                    <FontAwesomeIcon
                                        icon={isPositiveFeedbackHovered ? faThumbsUpSolid : faThumbsUp}
                                        size="2x"
                                        className="fa-icon fa-thumbs-up"
                                        onMouseEnter={() => setIsPositiveFeedbackHovered(true)}
                                        onMouseLeave={() => setIsPositiveFeedbackHovered(false)}
                                        onClick={() => {
                                            if (isFeedbackSubmitting) return ''
                                            trackAnalyticEvent('like-message', {
                                                ...getUserDataFromLocalStorage(),
                                                messageId: response.messages[messageIndex]?.id ?? '',
                                            })
                                            setShowNegativeFeedbackInput(false)
                                            handleFeedback(true, '')
                                        }}
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
                                    <Box marginBottom={3}>
                                        <Textarea
                                            placeholder={'Escribe aquí el feedback'}
                                            handleMessageChange={setNegativeFeedback}
                                            value={negativeFeedback}
                                        />
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleSubmitFeedback()}
                                        style={{
                                            height: 42,
                                            fontSize: 14,
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
