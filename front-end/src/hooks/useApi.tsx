import fetchAdapter from '@vespaiach/axios-fetch-adapter'
import axios, { AxiosResponse } from 'axios'
import { useMemo } from 'react'
import { EXTENSION_ID } from '../constants'
import { useBackgroundConnection } from '../context/backgroundConnection'
import { MessageResponse } from '../types'

type useApiProps = {
    enviroment: 'development' | 'production'
    fail?: boolean
}

const TEST_MESSAGE =
    'Hola Alejo!\n\nTe he visto ayer en el evento #NoCode for Devsde Sharing Away y me pareció muy bueno tuenfoque para construir MVPs con No-code.\n\nMe encantaría poder charlar contigo paraprofundizar sobre el tema y ver si existe laposibilidad de colaboración.\n\n¿Qué tal te queda esta semana?'

const useApi = ({ enviroment, fail }: useApiProps) => {
    const bacgroundConnection = useBackgroundConnection()
    const SUCCESS_STATUS = useMemo(() => {
        if (fail) return 400

        return 201
    }, [fail])

    const getMessagsWithLinkedinUrl = async (
        leadUrl: string
    ): Promise<Pick<AxiosResponse<MessageResponse>, 'data' | 'status'>> => {
        if (process.env.NODE_ENV !== 'development') {
            const res = await bacgroundConnection?.send({
                action: 'FETCH_PROFILE_MESSAGES',
                data: {
                    leadUrl,
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

    return { getMessagsWithLinkedinUrl }
}

export default useApi
