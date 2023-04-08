import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-light-svg-icons'

type FeedbackProps = {
    isFeedbackGranted: boolean
    handleFeedback: (isPositive: boolean) => void
}

const Feedback = ({ handleFeedback, isFeedbackGranted }: FeedbackProps) => {
    // const [showNegativeFeedbackInput, setShowNegativeFeedbackInput] = useState(false)
    // const [negativeFeedback, setNegativeFeedback] = useState('')

    // const handleNegativeFeedback = () => {

    // }

    return (
        <Box display="flex" flexDirection={'column'} alignItems={'center'}>
            {isFeedbackGranted ? (
                <Typography variant="h3">Gracias, tu mensaje nos ayuda a mejorar</Typography>
            ) : (
                <>
                    <Typography variant="h3">¿Qué te ha parecido el mensaje?</Typography>
                    <Typography variant="subtitle1">Tu feedback nos ayuda a seguir mejorando</Typography>
                    <Box display="flex" flexDirection="row" alignItems="center" marginTop={3}>
                        <Box display="flex" flexDirection="column" alignItems="center" marginRight={2}>
                            <FontAwesomeIcon
                                icon={faThumbsDown}
                                size="2x"
                                className="fa-icon"
                                onClick={() => handleFeedback(false)}
                                style={{ cursor: 'pointer', color: '#424242' }}
                            />
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="center" marginLeft={2}>
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                size="2x"
                                className="fa-icon"
                                onClick={() => handleFeedback(true)}
                                style={{ cursor: 'pointer', color: '#424242' }}
                            />
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    )
}

export default Feedback
