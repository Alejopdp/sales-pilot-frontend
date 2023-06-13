import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import EmptyBox from '../../assets/empty-box.png'

type EmptyStateProps = {
    title: string
    subtitle: string
    showHandler?: boolean
    handler?: (e: any) => void
}
const EmptyState = ({ title, subtitle, showHandler, handler }: EmptyStateProps) => {
    return (
        <Box display="flex" flexDirection={'column'} justifyContent={'center'} alignItems="center">
            <img src={EmptyBox} alt="empty-box" width={256} style={{ marginBottom: 16 }} />
            <Typography variant="h2" marginBottom={2} textAlign="center">
                {title}
            </Typography>
            <Typography variant="subtitle1" marginBottom={4} textAlign="center">
                <span dangerouslySetInnerHTML={{ __html: subtitle }} />
            </Typography>
            {showHandler && handler && (
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => handler(e)}
                    style={{
                        height: 42,
                        fontSize: 14,
                        borderRadius: 60,
                    }} //TODO: Make a component for styles or add it to the theme
                >
                    {title === 'Disculpa, has superado el límite de mensajes mensuales' ? 'CONTACTAR' : 'REINTENTAR'}
                </Button>
            )}
        </Box>
    )
}

export default EmptyState
