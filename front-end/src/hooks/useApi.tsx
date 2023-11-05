import { useEffect, useState } from 'react'
import { IBackgroundResponse, useBackgroundConnection } from '../context/backgroundConnection'
import { DEVELOPMENT_EXTENSION_ID, LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'
import { useAuth } from '../context/auth.context'

const useApi = () => {
    const { connection } = useBackgroundConnection()
    const [isBackgroundConnectionEstablished, setIsBackgroundConnectionEstablished] = useState(false)
    const { logOutUser } = useAuth()

    useEffect(() => {
        if (!connection || connection?.send === null) {
            setIsBackgroundConnectionEstablished(false)
            return
        }
        setIsBackgroundConnectionEstablished(true)
    }, [connection, connection?.port])

    const getMessagsWithLinkedinUrl = async (
        leadUrl: string
    ): Promise<
        IBackgroundResponse<{
            about: string
            actualPosition: string
            avatar: string
            messages: {
                id: string
                content: string
                hasFeedback: boolean
            }[]
            hasButtonHandler?: boolean
            message?: string
            subMessage?: string
        }>
    > => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')
        const res = await connection.send<{
            about: string
            actualPosition: string
            avatar: string
            messages: {
                id: string
                content: string
                hasFeedback: boolean
            }[]
        }>({
            action: 'FETCH_PROFILE_MESSAGES',
            data: {
                leadUrl,
                access_token: window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
            },
        })

        if (!res || res.status === 403 || res.status === 401) {
            logOutUser()
        }

        return res!
    }

    const giveFeedback = async (messageId: string, isPositive: boolean, comment: string) => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')

        const res = await connection.send<void>({
            action: 'GIVE_FEEDBACK',
            data: {
                messageId,
                isPositive,
                comment,
                access_token: window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
            },
        })

        return res
    }

    const saveCopiedMessage = async (messageId: string, copiedMessage: string) => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')
        const res = await connection.send({
            action: 'SAVE_COPIED_MESSAGE',
            data: {
                messageId,
                copiedMessage,
                access_token: window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
            },
        })

        return res
    }

    const trackAnalyticEvent = async (eventName: string, eventProperties: any) => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')
        connection.send({
            action: 'TRACK_ANALYTIC_EVENT',
            data: {
                eventName,
                eventProperties,
            },
        })
    }

    const updateForbbidenWords = async (forbiddenWords: string[]) => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')
        await connection.send({
            action: 'UPDATE_FORBIDDEN_WORDS',
            data: {
                forbiddenWords,
                access_token: window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
            },
        })
    }

    return {
        getMessagsWithLinkedinUrl,
        isBackgroundConnectionEstablished,
        giveFeedback,
        saveCopiedMessage,
        trackAnalyticEvent,
        updateForbbidenWords,
    }
}

export default useApi
