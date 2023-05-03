import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { isALinkedinProfile, isLinkedInURL } from '../../helpers'
import useApi from '../../hooks/useApi'
import EmptyState from '../emptyState/emptyState'
import GeneratedMessage from '../generatedMessage'
import { useNavigation } from '../../context/navigation'
import useLinkedinScraper from '../../hooks/useLinkedinScraper'
import Feedback from '../feedback'
import { SALES_PILOT_SIDEBAR_ACTIVE_CLASS, SALES_PILOT_SIDEBAR_ID } from '../../constants'
import ProfileInSidebar from '../profileInSidebar'
import { useMessageStore } from '../../context/messages.context'
import { MessageResponse } from '../../types'

const PreSearchSidebarContent = () => {
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { getMessagsWithLinkedinUrl, isBackgroundConnectionEstablished, giveFeedback } = useApi()
    const { response, setResponse, queue, setQueue } = useMessageStore()
    const { selectedProfile, setSelectedProfile } = useNavigation()
    const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false)
    const [isFeedbackGranted, setIsFeedbackGranted] = useState(false)
    const { getName, getPositon, getProfileImageSrc } = useLinkedinScraper()

    const triggerMessageSearchAfterSidebarIsOpened = useCallback(() => {
        if (!isBackgroundConnectionEstablished) return
        // TODO: Make a function of reinit
        setIsFeedbackGranted(false)
        setProfileIfScrape()
        handleSubmit()
        // fetchRecentActivity('https://www.linkedin.com/in/tomas-volonte')
    }, [isBackgroundConnectionEstablished])

    useEffect(() => {
        if (!isBackgroundConnectionEstablished) return
        // console.log('QUeue: ', queue)
        // if (queue[0] !== undefined) {
        //     setQueue(queue.slice(1))
        //     triggerMessageSearchAfterSidebarIsOpened()
        // }

        const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
        if (!sidebar) return
        //@ts-ignore
        if (sidebar[`${SALES_PILOT_SIDEBAR_ID}-observer`]) return

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                //@ts-ignore
                if (mutation.target.id === SALES_PILOT_SIDEBAR_ID) {
                    const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
                    if (!sidebar) return

                    if (sidebar.classList.contains(SALES_PILOT_SIDEBAR_ACTIVE_CLASS)) {
                        if (response.lastUrl === window.location.href && response.message !== '') return //TODO: El usuario puede abrir la sidebar desde otra URL, por lo que habría que cambiar esta validación

                        triggerMessageSearchAfterSidebarIsOpened()
                    }
                }
            })
        })

        //@ts-ignore
        sidebar[`${SALES_PILOT_SIDEBAR_ID}-observer`] = observer
        observer.observe(sidebar!, { attributes: true })

        return () => {
            console.log('Unmounting sidebar')
            observer.disconnect()
            //@ts-ignore
            sidebar[`${SALES_PILOT_SIDEBAR_ID}-observer`] = undefined
        }
    }, [triggerMessageSearchAfterSidebarIsOpened, response, queue])

    const handleSubmit = async () => {
        setIsSubmitting(true)
        const url = window.location.href

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
                setError(res.data.message)
            }
            const data = res.data as MessageResponse
            setResponse({ ...data, message: data.message, lastUrl: profileUrl })
        } catch (error) {
            console.log(error)
            setError('No se encontraron mensajes')
        }

        setIsSubmitting(false)
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
                <EmptyState title={error} subtitle="" />
            ) : isSubmitting ? (
                <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress size={16} />
                    <Typography fontSize={14} marginTop={2}>
                        Generando un mensaje para {selectedProfile?.name}
                    </Typography>
                </Box>
            ) : (
                <>
                    <GeneratedMessage
                        messageId={response.messageId}
                        message={response.message}
                        handleMessageChange={handleMessageChange}
                    />
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
