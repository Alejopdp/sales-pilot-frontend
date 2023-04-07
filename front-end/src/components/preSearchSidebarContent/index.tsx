import React, { useEffect, useState } from 'react'
import { Avatar, Box, CircularProgress, Typography } from '@mui/material'
import { isALinkedinProfile, isLinkedInURL } from '../../helpers'
import { useSnackbar } from 'notistack'
import useApi from '../../hooks/useApi'
import RocketSpinner from '../../assets/rocket-spinner.gif'
import EmptyState from '../emptyState/emptyState'
import GeneratedMessage from '../generatedMessage'
import { useNavigation } from '../../context/navigation'
import useLinkedinScraper from '../../hooks/useLinkedinScraper'
import Feedback from '../feedback'
import { MessageResponse } from '../../types'

const PreSearchSidebarContent = () => {
    const [error, setError] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { getMessagsWithLinkedinUrl, isBackgroundConnectionEstablished } = useApi({
        enviroment: process.env.NODE_ENV as 'development' | 'production',
        fail: false,
    })
    const [showPostSearch, setShowPostSearch] = useState(false)
    const [response, setResponse] = useState<MessageResponse>({
        name: '',
        position: '',
        message: '',
        avatar: '',
    })
    const [isLoadingTryingAgain, setIsLoadingTryingAgain] = useState(false)
    const { selectedProfile, setSelectedProfile } = useNavigation()
    const [isFeedbackGranted, setIsFeedbackGranted] = useState(false)
    const { getExperience, getName, getPositon, getProfileImageSrc } = useLinkedinScraper()

    useEffect(() => {
        console.log(isBackgroundConnectionEstablished)
        if (!isBackgroundConnectionEstablished && process.env.NODE_ENV === 'production') return
        handleSubmit()
    }, [isBackgroundConnectionEstablished])

    const handleSubmit = async () => {
        setIsSubmitting(true)
        const url =
            process.env.NODE_ENV === 'development' ? 'https://www.linkedin.com/in/damisanchez/' : window.location.href

        if (!isLinkedInURL(url)) {
            setError('La URL ingresada no es de Linkedin')
            setIsSubmitting(false)

            return
        }

        if (!isALinkedinProfile(url)) {
            const splittedUrl = url.split('/')
            setError(`No se ha encontrado el perfil ${splittedUrl[splittedUrl.length - 1]}`)
            setIsSubmitting(false)

            return
        }

        await fetchMessages(url)
    }

    const fetchMessages = async (profileUrl: string) => {
        try {
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) {
                enqueueSnackbar(res.data?.message ?? 'Error')
                throw new Error('Respuesta no exitosa')
            }

            setResponse({ ...res.data, message: res.data.message })
            setShowPostSearch(true)
        } catch (error) {
            console.log(error)
            setError('No se encontraron mensajes')
        }

        setIsSubmitting(false)
    }

    const tryAgain = async (profileUrl: string) => {
        setIsLoadingTryingAgain(true)
        try {
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) enqueueSnackbar(res.data?.message ?? 'Error')

            setResponse({ ...response, message: res.data.message })
        } catch (error) {
            console.log('Error: ', error)
        }
        setIsLoadingTryingAgain(false)
    }

    const setProfileIfScrape = () => {
        setSelectedProfile({
            about: getPositon(), // TODO: Check if its ok the position or about
            avatar: getProfileImageSrc(),
            name: getName(),
            actualPosition: getPositon(),
            experience: getExperience(),
        })
    }

    const handleMessageChange = (newMessage: string) => {
        setResponse({ ...response, message: newMessage })
    }

    const handleFeedback = (isPositive: boolean) => {
        // TODO: Send feedback
        setIsFeedbackGranted(true)
    }
    return (
        <Box display="flex" flexDirection="column" height="100%" width="100%">
            {selectedProfile ? (
                <Box display="flex" marginBottom={4} alignItems={'center'}>
                    <Avatar alt="Avatar" sx={{ width: 86, height: 86 }} src={getProfileImageSrc()} />
                    <Box
                        display="flex"
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems="flex-start"
                        paddingLeft={2}
                    >
                        <Typography marginBottom={1} style={{ fontSize: 18, fontWeight: 700 }}>
                            {selectedProfile?.name}
                        </Typography>
                        <Typography variant="body1" fontSize={14} color={'#424242'}>
                            {selectedProfile?.actualPosition}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <CircularProgress />
            )}
            {error ? (
                <EmptyState
                    title="No encontramos mensajes"
                    subtitle="Revisa que la URL ingresada sea de un usuario existente"
                    handler={() => tryAgain('')}
                />
            ) : showPostSearch || true ? (
                <GeneratedMessage message={response.message} handleMessageChange={handleMessageChange} />
            ) : isSubmitting ? (
                <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <img src={RocketSpinner} height={83} width={77.5} style={{ marginBottom: 16 }} />
                    <Typography fontSize={14}>Estamos generando los mejores mensajes!</Typography>
                </Box>
            ) : (
                <></>
            )}

            <Box marginTop="auto" marginBottom={5}>
                <Feedback isFeedbackGranted={isFeedbackGranted} handleFeedback={handleFeedback} />
            </Box>
        </Box>
    )
}

export default PreSearchSidebarContent
