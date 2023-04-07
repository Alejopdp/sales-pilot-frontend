import { Avatar, Box, Icon, Typography } from '@mui/material'
import React from 'react'
import { Profile, useNavigation } from '../../context/navigation'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    profile: {
        '&:hover': {
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
        },
    },
})

const Home = () => {
    const { profiles, setRoute, setSelectedProfile } = useNavigation()
    const styles = useStyles()

    const handleProfileClick = (index: number) => {
        setRoute('profile')
        setSelectedProfile(profiles[index])
    }

    return (
        <Box>
            {profiles.map((profile: Profile, index: number) => (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={2}
                    className={styles.profile}
                    paddingY={1}
                    onClick={() => handleProfileClick(index)}
                >
                    <Box display="flex" alignItems="center">
                        <Box marginRight={2}>
                            <Avatar sizes="" />
                        </Box>
                        <Box display="flex" flexDirection="column">
                            <Typography>{profile.name}</Typography>
                            <Typography fontSize={12}>{profile.actualPosition}</Typography>
                        </Box>
                    </Box>
                    <ChevronRightIcon />
                </Box>
            ))}
        </Box>
    )
}

export default Home
