import fetchAdapter from '@vespaiach/axios-fetch-adapter'
import axios from 'axios'
import { useMemo } from 'react'
import { EXTENSION_ID } from '../constants'
import { useBackgroundConnection } from '../context/backgroundConnection'

type useApiProps = {
    enviroment: 'development' | 'production'
    fail?: boolean
}
const useApi = ({ enviroment, fail }: useApiProps) => {
    const bacgroundConnection = useBackgroundConnection()
    const SUCCESS_STATUS = useMemo(() => {
        if (fail) return 400

        return 201
    }, [fail])

    const getMessagsWithLinkedinUrl = async (leadUrl: string) => {
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
                    messages: [
                        'asdsadsadsadsad asdas dsa dasds a',
                        'asdds fdsf ds fds fds f dsf ds asdds fdsf ds fds fds f dsf ds asdds fdsf ds fds fds f dsf ds asdds fdsf ds fds fds f dsf ds',
                        'asfsadsadsadasdsad',
                    ],
                },
            }
        }
    }

    return { getMessagsWithLinkedinUrl }
}

export default useApi
