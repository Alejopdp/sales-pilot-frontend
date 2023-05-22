import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { MessageResponse } from '../types'

type MessageContextType = {
    response: MessageResponse
    setResponse: Dispatch<SetStateAction<MessageResponse>>
    messageIndex: number
    setMessageIndex: Dispatch<SetStateAction<number>>
    queue: string[]
    setQueue: Dispatch<SetStateAction<string[]>>
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
}

export const MessageContext = React.createContext<MessageContextType>(MessageContextInitialState)

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [response, setResponse] = useState<MessageResponse>(MessageContextInitialState.response)
    const [messageIndex, setMessageIndex] = useState<number>(0)
    const [queue, setQueue] = useState<string[]>([])

    useEffect(() => {
        // TODO: Fetch messages for the profile where the user is if exists, otherwise generate them
    }, [])

    return (
        <MessageContext.Provider value={{ response, setResponse, queue, setQueue, messageIndex, setMessageIndex }}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageStore = (): MessageContextType => {
    const { response, setResponse, queue, setQueue, messageIndex, setMessageIndex } = useContext(MessageContext)

    return { messageIndex, response, setResponse, queue, setQueue, setMessageIndex }
}
