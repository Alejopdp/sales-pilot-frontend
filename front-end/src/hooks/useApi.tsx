import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useBackgroundConnection } from '../context/backgroundConnection'
import { MessageResponse } from '../types'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'

const useApi = () => {
    const { connection } = useBackgroundConnection()
    const [isBackgroundConnectionEstablished, setIsBackgroundConnectionEstablished] = useState(false)

    useEffect(() => {
        if (!connection || connection?.send === null) return
        setIsBackgroundConnectionEstablished(true)
    }, [connection])

    const getMessagsWithLinkedinUrl = async (
        leadUrl: string
    ): Promise<Pick<AxiosResponse<MessageResponse | { message: string }>, 'data' | 'status'>> => {
        if (!connection || connection?.send === null) throw new Error('Connection to background not yet establsihed')

        const res = await connection.send({
            action: 'FETCH_PROFILE_MESSAGES',
            data: {
                leadUrl,
                access_token: window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
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

    return { getMessagsWithLinkedinUrl, isBackgroundConnectionEstablished, giveFeedback, saveCopiedMessage }
}

export default useApi
