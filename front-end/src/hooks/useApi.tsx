import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useBackgroundConnection } from '../context/backgroundConnection'
import { MessageResponse } from '../types'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'

type useApiProps = {
    enviroment: 'development' | 'production'
    fail?: boolean
}

const TEST_MESSAGE =
    'Hola Alejo!\n\nTe he visto ayer en el evento #NoCode for Devsde Sharing Away y me pareció muy bueno tuenfoque para construir MVPs con No-code.\n\nMe encantaría poder charlar contigo paraprofundizar sobre el tema y ver si existe laposibilidad de colaboración.\n\n¿Qué tal te queda esta semana?'

const useApi = ({ enviroment, fail }: useApiProps) => {
    const { connection } = useBackgroundConnection()
    const SUCCESS_STATUS = useMemo(() => {
        if (fail) return 400

        return 201
    }, [fail])
    const [isBackgroundConnectionEstablished, setIsBackgroundConnectionEstablished] = useState(false)

    useEffect(() => {
        if (!connection || connection?.send === null) return
        setIsBackgroundConnectionEstablished(true)
    }, [connection])

    const getMessagsWithLinkedinUrl = async (
        leadUrl: string
    ): Promise<Pick<AxiosResponse<MessageResponse>, 'data' | 'status'>> => {
        if (process.env.NODE_ENV !== 'development') {
            if (!connection || connection?.send === null)
                throw new Error('Connection to background not yet establsihed')

            const res = await connection.send({
                action: 'FETCH_PROFILE_MESSAGES',
                data: {
                    leadUrl,
                    access_token: window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN),
                },
            })

            return res
        } else {
            return {
                status: SUCCESS_STATUS,
                data: {
                    messageId: 'asd',
                    avatar: '/asd',
                    name: 'Max Carlucho',
                    position: 'Co fouonder and CRO of novolabs',
                    message: TEST_MESSAGE,
                    lastUrl: 'https://www.linkedin.com/in/maxcarlucho/',
                },
            }
        }
    }

    const giveFeedback = async (messageId: string, isPositive: boolean, comment: string) => {
        if (process.env.NODE_ENV !== 'development') {
            if (!connection || connection?.send === null)
                throw new Error('Connection to background not yet establsihed')

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
        } else {
            return {
                status: SUCCESS_STATUS,
                data: {
                    avatar: '/asd',
                    name: 'Max Carlucho',
                    position: 'Co fouonder and CRO of novolabs',
                    message: TEST_MESSAGE,
                },
            }
        }
    }

    return { getMessagsWithLinkedinUrl, isBackgroundConnectionEstablished, giveFeedback }
}

export default useApi
