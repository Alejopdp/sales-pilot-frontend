import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { isALinkedinProfile, isLinkedInURL } from '../../helpers'
import { useSnackbar } from 'notistack'
import useApi from '../../hooks/useApi'
import EmptyState from '../emptyState/emptyState'
import GeneratedMessage from '../generatedMessage'
import { useNavigation } from '../../context/navigation'
import useLinkedinScraper from '../../hooks/useLinkedinScraper'
import Feedback from '../feedback'
import { MessageResponse } from '../../types'
import { SALES_PILOT_SIDEBAR_ACTIVE_CLASS, SALES_PILOT_SIDEBAR_ID } from '../../constants'
import ProfileInSidebar from '../profileInSidebar'

const PreSearchSidebarContent = () => {
    const [error, setError] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { getMessagsWithLinkedinUrl, isBackgroundConnectionEstablished } = useApi({
        enviroment: process.env.NODE_ENV as 'development' | 'production',
        fail: false,
    })
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

    const triggerMessageSearchAfterSidebarIsOpened = useCallback(() => {
        const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
        console.log(isBackgroundConnectionEstablished)
        if (!isBackgroundConnectionEstablished && process.env.NODE_ENV === 'production') return
        if (!sidebar) return

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if (sidebar.classList.contains(SALES_PILOT_SIDEBAR_ACTIVE_CLASS)) {
                        setProfileIfScrape()
                        handleSubmit()
                    }
                }
            })
        })

        observer.observe(sidebar, { attributes: true })
    }, [isBackgroundConnectionEstablished])

    useEffect(() => {
        triggerMessageSearchAfterSidebarIsOpened()
    }, [triggerMessageSearchAfterSidebarIsOpened])

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
            experience: [],
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
        <Box display="flex" flexDirection="column" flex="1" width="100%">
            {selectedProfile && (
                <ProfileInSidebar
                    actualPosition={selectedProfile.actualPosition}
                    name={selectedProfile.name}
                    profileImageSrc={getProfileImageSrc()}
                />
            )}
            {error ? (
                <EmptyState
                    title="No encontramos mensajes"
                    subtitle="Revisa que la URL ingresada sea de un usuario existente"
                    handler={() => tryAgain('')}
                />
            ) : isSubmitting ? (
                <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress size={16} />
                    <Typography fontSize={14} marginTop={2}>
                        Generando un mensaje para {selectedProfile?.name}
                    </Typography>
                </Box>
            ) : (
                <>
                    <GeneratedMessage message={response.message} handleMessageChange={handleMessageChange} />
                    <Box marginTop="auto" marginBottom={5}>
                        <Feedback isFeedbackGranted={isFeedbackGranted} handleFeedback={handleFeedback} />
                    </Box>
                </>
            )}
        </Box>
    )
}

export default PreSearchSidebarContent
