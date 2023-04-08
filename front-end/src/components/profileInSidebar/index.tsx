import React from 'react'
import { Avatar, Box, Typography } from '@mui/material'

type ProfileInSidebarProps = {
    name: string
    actualPosition: string
    profileImageSrc: string
}

const ProfileInSidebar = ({ name, actualPosition, profileImageSrc }: ProfileInSidebarProps) => {
    return (
        <Box display="flex" marginBottom={4} alignItems={'center'}>
            <Avatar alt="Avatar" sx={{ width: 86, height: 86 }} src={profileImageSrc} />
            <Box
                display="flex"
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems="flex-start"
                paddingLeft={2}
            >
                <Typography variant="h2" marginBottom={1}>
                    {name}
                </Typography>
                <Typography variant="subtitle1">{actualPosition}</Typography>
            </Box>
        </Box>
    )
}

export default ProfileInSidebar
