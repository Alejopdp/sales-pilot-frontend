import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useBackgroundConnection } from '../context/backgroundConnection'
import { MessageResponse } from '../types'
import { DEVELOPMENT_EXTENSION_ID, LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'

const useApi = () => {
    const { connection } = useBackgroundConnection()
    const [isBackgroundConnectionEstablished, setIsBackgroundConnectionEstablished] = useState(false)

    useEffect(() => {
        if (!connection || connection?.send === null) {
            setIsBackgroundConnectionEstablished(false)
            console.log("Background connecetion hasn't been established yet")
            return
        }
        setIsBackgroundConnectionEstablished(true)
        console.log('Background connecetion has been established')
    }, [connection, connection?.port])

    const getMessagsWithLinkedinUrl = async (
        leadUrl: string
    ): Promise<Pick<AxiosResponse<MessageResponse | { message: string }>, 'data' | 'status'>> => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')
        console.log('Sending message to port : ', connection?.port?.name)
        const res = await connection.send({
            action: 'FETCH_PROFILE_MESSAGES',
            data: {
                leadUrl,
                access_token: window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
                mockMessages: false,
                // mockMessages: process.env.REACT_APP_EXTENSION_ID === DEVELOPMENT_EXTENSION_ID,
            },
        })

        return res
    }

    const giveFeedback = async (messageId: string, isPositive: boolean, comment: string) => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')
        const res = await connection.send({
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

    return {
        getMessagsWithLinkedinUrl,
        isBackgroundConnectionEstablished,
        giveFeedback,
        saveCopiedMessage,
        trackAnalyticEvent,
    }
}

export default useApi
