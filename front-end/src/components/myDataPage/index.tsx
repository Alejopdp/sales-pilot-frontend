import React from 'react'
import { Box, Typography } from '@mui/material'
import BackButton from '../backButton'
import { useAuth } from '../../context/auth.context'
import { useNavigation } from '../../context/navigation'

const MyDataPage = () => {
    const { user } = useAuth()
    const { setRoute } = useNavigation()

    return (
        <Box>
            <Box display={'block'}>
                <BackButton actualRoute="Mis datos" goBack={() => setRoute('profile')} />
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
                <Box display={'flex'} flexDirection={'column'} mb={2}>
                    <Typography variant="subtitle1" color="initial" fontSize={18} fontWeight={500}>
                        Nombre
                    </Typography>
                    <Typography variant="body1" color="initial" fontStyle={'italic'}>
                        {/* Name with the first letter upper case */}
                        {(user?.name ?? '').charAt(0).toUpperCase() + user?.name?.slice(1)}
                    </Typography>
                </Box>
                <Box display={'flex'} flexDirection={'column'} mb={2}>
                    <Typography variant="subtitle1" color="initial" fontSize={18} fontWeight={500}>
                        Compañía
                    </Typography>
                    <Typography variant="body1" color="initial" fontStyle={'italic'}>
                        {user?.company}
                    </Typography>
                </Box>
                <Box display={'flex'} flexDirection={'column'} mb={2}>
                    <Typography variant="subtitle1" color="initial" fontSize={18} fontWeight={500}>
                        Rol
                    </Typography>
                    <Typography variant="body1" color="initial" fontStyle={'italic'}>
                        {user?.company_role}
                    </Typography>
                </Box>
                <Box display={'flex'} flexDirection={'column'} mb={2}>
                    <Typography variant="subtitle1" color="initial" fontSize={18} fontWeight={500}>
                        Perfiles analizados
                    </Typography>
                    <Typography variant="body1" color="initial" fontStyle={'italic'}>
                        {user?.usage.qty_of_messages_created} de {user?.messages_limit} perfiles
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default MyDataPage
