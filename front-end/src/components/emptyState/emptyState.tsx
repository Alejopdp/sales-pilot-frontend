import React from 'react'
import { Button, Typography } from '@mui/material'
import Paper from '../paper/paper'

type EmptyStateProps = {
    title: string
    subtitle: string
    handler: (e: any) => void
}
const EmptyState = ({ title, subtitle, handler }: EmptyStateProps) => {
    return (
        <Paper>
            <Typography variant="h2" marginBottom={2} textAlign="center">
                {title}
            </Typography>
            <Typography variant="body1" marginBottom={4} textAlign="center">
                {subtitle}
            </Typography>
            <Button variant="contained" fullWidth onClick={(e) => handler(e)}>
                VOLVER A INTENTAR
            </Button>
        </Paper>
    )
}

export default EmptyState
