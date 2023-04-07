import React, { useState } from 'react'
import { Box, Button, CircularProgress, Grid, Paper, Typography, Avatar, Container } from '@mui/material'
import { useSnackbar } from 'notistack'
import useApi from '../../hooks/useApi'
import EmptyState from '../emptyState/emptyState'
import GeneratedMessage from '../generatedMessage'

const PostSearchSidebarContent = ({ response, setResponse }: any) => {
    const [error, setError] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMoreOptions, setIsLoadingMoreOptions] = useState(false)
    const [isLoadingTryingAgain, setIsLoadingTryingAgain] = useState(false)
    const { getMessagsWithLinkedinUrl } = useApi({
        enviroment: process.env.NODE_ENV as 'development' | 'production',
        fail: true,
    })

    const addMessages = async (profileUrl: string) => {
        setIsLoadingMoreOptions(true)
        try {
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) {
                enqueueSnackbar(res.data?.message ?? 'Error')
                return
            }

            setResponse({ ...response, messages: [...response.messages, ...res.data.message] })
        } catch (error) {
            console.log('Error: ', error)
        }
        setIsLoadingMoreOptions(false)
    }

    const tryAgain = async (profileUrl: string) => {
        setIsLoadingTryingAgain(true)
        try {
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) enqueueSnackbar(res.data?.message ?? 'Error')

            setResponse({ ...response, messages: res.data.message })
        } catch (error) {
            console.log('Error: ', error)
        }
        setIsLoadingTryingAgain(false)
    }

    return (
        <></>
        // <Container style={{ paddingTop: 16, paddingBottom: 16 }}>
        //     <Grid xs={12}>
        //         {!error && response.name && (
        //             <Box display="flex" marginBottom={6}>
        //                 <Avatar alt="Remy Sharp" src={response.avatar} sx={{ width: 112, height: 112 }} />
        //                 <Box display="flex" flexDirection={'column'} alignItems="flex-start" paddingLeft={4}>
        //                     <Typography variant="h2" marginBottom={1}>
        //                         {response.name}
        //                     </Typography>
        //                     <Typography variant="body1" marginBottom={2}>
        //                         {response.position}
        //                     </Typography>
        //                 </Box>
        //             </Box>
        //         )}
        //     </Grid>
        //     <Grid xs={12} padding={0}>
        //         {error ? (
        //             <EmptyState
        //                 title="No encontramos mensajes"
        //                 subtitle="Revisa que la URL ingresada sea de un usuario existente"
        //                 handler={() => tryAgain('')}
        //             />
        //         ) : (
        //             <Paper elevation={0}>
        //                 <Typography variant="h4" marginBottom={8}>
        //                     Mensajes personalizados
        //                 </Typography>
        //                 {response.messages?.map((message: string, idx: number) => (
        //                     <GeneratedMessage key={`message-${idx}`} message={message} handleMessageChange={() => ''} />
        //                 ))}
        //                 {isLoadingMoreOptions ? (
        //                     <Box display="flex" width="100%">
        //                         <CircularProgress style={{ margin: 'auto' }} />
        //                     </Box>
        //                 ) : (
        //                     <Button
        //                         style={{ height: 52, fontSize: 18 }}
        //                         variant="contained"
        //                         fullWidth
        //                         onClick={() => addMessages('')}
        //                     >
        //                         VER MAS OPCIONES
        //                     </Button>
        //                 )}
        //             </Paper>
        //         )}
        //     </Grid>
        // </Container>
    )
}

export default PostSearchSidebarContent
