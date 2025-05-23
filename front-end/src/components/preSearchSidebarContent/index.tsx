import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/material'
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
import FetchMessageSpinner from '../fetchMessageSpinner'
import { useAuth } from '../../context/auth.context'

const PreSearchSidebarContent = () => {
    const { getUserDataFromLocalStorage, setUser, user } = useAuth()
    const { isBackgroundConnectionEstablished, giveFeedback, trackAnalyticEvent } = useApi()
    const {
        response,
        setResponse,
        fetchMessages,
        queue,
        setQueue,
        messageIndex,
        setMessageIndex,
        error,
        setError,
        isFetching,
    } = useMessageStore()
    const { selectedProfile, setSelectedProfile } = useNavigation()
    const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false)
    const [isFeedbackGranted, setIsFeedbackGranted] = useState(false)
    const { getName, getPositon, getProfileImageSrc } = useLinkedinScraper()

    const reinitFetch = () => {
        setError(undefined)
        setMessageIndex(0)
        setIsFeedbackGranted(false)
        setProfileIfScrape()
        handleSubmit()
    }

    const triggerMessageSearchAfterSidebarIsOpened = useCallback(() => {
        if (!isBackgroundConnectionEstablished) return
        reinitFetch()
    }, [isBackgroundConnectionEstablished])

    useEffect(() => {
        if (!isBackgroundConnectionEstablished) return
        if (queue[0] !== undefined) {
            setQueue(queue.slice(1))
            triggerMessageSearchAfterSidebarIsOpened()
        }

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
                        trackAnalyticEvent('open-tab-extension', { ...getUserDataFromLocalStorage() })
                        if (response.lastUrl === window.location.href && response.messages.length !== 0) return //TODO: El usuario puede abrir la sidebar desde otra URL, por lo que habría que cambiar esta validación

                        triggerMessageSearchAfterSidebarIsOpened()
                    }
                }
            })
        })

        //@ts-ignore
        sidebar[`${SALES_PILOT_SIDEBAR_ID}-observer`] = observer
        observer.observe(sidebar!, { attributes: true })

        return () => {
            observer?.disconnect()
            //@ts-ignore
            sidebar[`${SALES_PILOT_SIDEBAR_ID}-observer`] = undefined
        }
    }, [triggerMessageSearchAfterSidebarIsOpened, response, queue])

    const handleSubmit = async () => {
        setError(undefined)
        const url = window.location.href

        if (!isLinkedInURL(url)) {
            setError({
                statusCode: -1,
                message: 'La URL ingresada no es de Linkedin',
                subMessage: '',
                hasButtonHandler: false,
            })

            return
        }

        if (!isALinkedinProfile(url)) {
            const splittedUrl = url.split('/')
            setError({
                statusCode: -1,
                message: `No se ha encontrado el perfil ${splittedUrl[splittedUrl.length - 1]}`,
                subMessage: '',
                hasButtonHandler: false,
            })

            return
        }

        await getMessages(url)
    }

    const getMessages = async (profileUrl: string) => {
        await fetchMessages(profileUrl)

        if (!error && !!user) {
            setUser({
                ...user,
                usage: { ...user.usage, qty_of_messages_created: user.usage.qty_of_messages_created + 1 },
            })
        }
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

    const handleMessageChange = (newMessage: string, messageId: string) => {
        setResponse({
            ...response,
            messages: response.messages.map((message) =>
                message.id === messageId ? { ...message, content: newMessage } : message
            ),
        })
    }

    const handleFeedback = async (isPositive: boolean, comment: string) => {
        setIsFeedbackSubmitting(true)
        const messageId = response.messages[messageIndex].id
        const res = await giveFeedback(messageId, isPositive, comment)

        if (res?.status !== 200) alert('Error')
        if (res?.status === 200) {
            setResponse({
                ...response,
                messages: response.messages.map((message) =>
                    message.id === messageId ? { ...message, hasFeedback: true } : message
                ),
            })
        }
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
                    title={error.message}
                    subtitle={error.subMessage}
                    handler={handleSubmit}
                    showHandler={error.hasButtonHandler}
                />
            ) : isFetching ? (
                <FetchMessageSpinner />
            ) : (
                <>
                    <GeneratedMessage handleMessageChange={handleMessageChange} />
                    <Box marginTop="auto" marginBottom={5}>
                        <Feedback
                            isFeedbackGranted={response.messages[messageIndex]?.hasFeedback}
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
