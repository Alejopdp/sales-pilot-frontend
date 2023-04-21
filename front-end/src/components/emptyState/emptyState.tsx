import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import EmptyBox from '../../assets/empty-box.png'

type EmptyStateProps = {
    title: string
    subtitle: string
    handler?: (e: any) => void
}
const EmptyState = ({ title, subtitle, handler }: EmptyStateProps) => {
    return (
        <Box display="flex" flexDirection={'column'} justifyContent={'center'} alignItems="center">
            <img src={EmptyBox} alt="empty-box" width={256} style={{ marginBottom: 16 }} />
            <Typography variant="h2" marginBottom={2} textAlign="center">
                {title}
            </Typography>
            <Typography variant="body1" marginBottom={4} textAlign="center">
                {subtitle}
            </Typography>
            {handler && (
                <Button variant="contained" fullWidth onClick={(e) => handler(e)}>
                    VOLVER A INTENTAR
                </Button>
            )}
        </Box>
    )
}

export default EmptyState
