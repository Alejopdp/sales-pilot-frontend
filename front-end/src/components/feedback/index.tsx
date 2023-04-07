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
                <Typography fontSize={16} fontWeight={500}>
                    Gracias, tu mensaje nos ayuda a mejorar
                </Typography>
            ) : (
                <>
                    <Typography fontSize={16} fontWeight={500}>
                        ¿Qué te ha parecido el mensaje?
                    </Typography>
                    <Typography fontSize={14} fontWeight={400} color={'#424242'}>
                        Tu feedback nos ayuda a seguir mejorando
                    </Typography>
                    <Box display="flex" flexDirection="row" alignItems="center" marginTop={3}>
                        <Box display="flex" flexDirection="column" alignItems="center" marginRight={2}>
                            <FontAwesomeIcon
                                icon={faThumbsDown}
                                size="2x"
                                className="fa-icon"
                                onClick={() => handleFeedback(false)}
                            />
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="center" marginLeft={2}>
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                size="2x"
                                className="fa-icon"
                                onClick={() => handleFeedback(true)}
                            />
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    )
}

export default Feedback
