import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { MessageResponse } from '../types'
import useApi from '../hooks/useApi'

type MessageContextType = {
    response: MessageResponse
    setResponse: Dispatch<SetStateAction<MessageResponse>>
    messageIndex: number
    setMessageIndex: Dispatch<SetStateAction<number>>
    queue: string[]
    setQueue: Dispatch<SetStateAction<string[]>>
    fetchMessages: (leadUrl: string) => Promise<void>
    error:
        | {
              statusCode: number
              message: string
              subMessage: string
              hasButtonHandler: boolean
          }
        | undefined
    setError: Dispatch<
        SetStateAction<
            | {
                  statusCode: number
                  message: string
                  subMessage: string
                  hasButtonHandler: boolean
              }
            | undefined
        >
    >
}

export const MessageContextInitialState: MessageContextType = {
    response: {
        name: '',
        position: '',
        messages: [],
        avatar: '',
        lastUrl: '',
    },
    setResponse: () => {},
    queue: [],
    messageIndex: 0,
    setMessageIndex: () => {},
    setQueue: () => {},
    fetchMessages: async () => {},
    error: undefined,
    setError: () => {},
}

export const MessageContext = React.createContext<MessageContextType>(MessageContextInitialState)

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<
        { statusCode: number; message: string; subMessage: string; hasButtonHandler: boolean } | undefined
    >(undefined)
    const [response, setResponse] = useState<MessageResponse>(MessageContextInitialState.response)
    const [messageIndex, setMessageIndex] = useState<number>(0)
    const [queue, setQueue] = useState<string[]>([])
    const { getMessagsWithLinkedinUrl } = useApi()

    const fetchMessages = async (leadUrl: string) => {
        try {
            const res = await getMessagsWithLinkedinUrl(leadUrl)
            const data = res.data

            if (res.status !== 201) {
                setError({
                    hasButtonHandler: data.hasButtonHandler!,
                    message: data.message!,
                    subMessage: data.subMessage!,
                    statusCode: res.status,
                })
                return
            }

            setResponse({
                avatar: data.avatar,
                name: data.about,
                position: data.actualPosition,
                messages: data.messages ?? [],
                lastUrl: leadUrl,
            })
        } catch (error) {
            setError({
                statusCode: 400,
                message: 'Ocurrió un error inesperado',
                subMessage: '',
                hasButtonHandler: false,
            })
        }
    }
    return (
        <MessageContext.Provider
            value={{
                response,
                setResponse,
                queue,
                setQueue,
                messageIndex,
                setMessageIndex,
                fetchMessages,
                error,
                setError,
            }}
        >
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageStore = (): MessageContextType => {
    const { response, setResponse, queue, setQueue, messageIndex, setMessageIndex, fetchMessages, error, setError } =
        useContext(MessageContext)

    return { messageIndex, response, setResponse, queue, setQueue, setMessageIndex, fetchMessages, error, setError }
}
