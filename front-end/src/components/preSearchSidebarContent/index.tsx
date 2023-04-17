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
import { SALES_PILOT_SIDEBAR_ACTIVE_CLASS, SALES_PILOT_SIDEBAR_ID } from '../../constants'
import ProfileInSidebar from '../profileInSidebar'
import { useMessageStore } from '../../context/messages.context'

const PreSearchSidebarContent = () => {
    const [error, setError] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { getMessagsWithLinkedinUrl, isBackgroundConnectionEstablished, giveFeedback } = useApi({
        enviroment: process.env.NODE_ENV as 'development' | 'production',
        fail: false,
    })
    const { response, setResponse, queue, setQueue } = useMessageStore()
    const [isLoadingTryingAgain, setIsLoadingTryingAgain] = useState(false)
    const { selectedProfile, setSelectedProfile } = useNavigation()
    const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false)
    const [isFeedbackGranted, setIsFeedbackGranted] = useState(false)
    const { getName, getPositon, getProfileImageSrc } = useLinkedinScraper()

    const triggerMessageSearchAfterSidebarIsOpened = useCallback(() => {
        console.log('triggerMessageSearchAfterSidebarIsOpened')
        console.log('isBackgroundConnectionEstablished:', isBackgroundConnectionEstablished)
        if (!isBackgroundConnectionEstablished && process.env.NODE_ENV === 'production') return
        // TODO: Make a function of reinit
        setIsFeedbackGranted(false)
        setProfileIfScrape()
        handleSubmit()
    }, [isBackgroundConnectionEstablished])

    useEffect(() => {
        if (!isBackgroundConnectionEstablished && process.env.NODE_ENV !== 'development') return
        console.log('Has connection, and is auth')
        console.log('QUeue: ', queue)
        if (queue[0] !== undefined) {
            setQueue(queue.slice(1))
            triggerMessageSearchAfterSidebarIsOpened()
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                console.log('Mutation')
                //@ts-ignore
                if (mutation.target.id === SALES_PILOT_SIDEBAR_ID) {
                    console.log('Mutation was on sales pilot sidebar')
                    const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
                    if (!sidebar) return
                    console.log('Sidebar exists')

                    if (sidebar.classList.contains(SALES_PILOT_SIDEBAR_ACTIVE_CLASS)) {
                        console.log("Sidebar is opened, let's scrape the profile")
                        console.log('Response last url: ', response)
                        console.log('Window location: ', window.location.href)
                        if (response.lastUrl === window.location.href && response.message !== '') return //TODO: El usuario puede abrir la sidebar desde otra URL, por lo que habría que cambiar esta validación

                        triggerMessageSearchAfterSidebarIsOpened()
                    }
                }
            })
        })

        observer.observe(document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)!, { attributes: true })

        return () => {
            console.log('Sidebar unmounted, last resposne state: ', response)
            observer.disconnect()
        }
    }, [triggerMessageSearchAfterSidebarIsOpened, response, queue])

    const handleSubmit = async () => {
        console.log('Submitting...')
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
            console.log('Fetching messages...')
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) {
                enqueueSnackbar(res.data?.message ?? 'Error')
                throw new Error('Respuesta no exitosa')
            }
            console.log('Setting response: ', res.data)
            setResponse({ ...res.data, message: res.data.message, lastUrl: profileUrl })
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

    const handleFeedback = async (isPositive: boolean, comment: string) => {
        setIsFeedbackSubmitting(true)
        console.log('Making request: ', response.messageId)
        const res = await giveFeedback(response.messageId, isPositive, comment)

        if (res.status !== 200) alert('Error')
        if (res.status === 200) setIsFeedbackGranted(true)
        setIsFeedbackSubmitting(false)
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
                        <Feedback
                            isFeedbackGranted={isFeedbackGranted}
                            handleFeedback={handleFeedback}
                            isFeedbackSubmitting={isFeedbackSubmitting}
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}

export default PreSearchSidebarContent
