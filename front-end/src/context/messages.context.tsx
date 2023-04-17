import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { MessageResponse } from '../types'

type MessageContextType = {
    response: MessageResponse
    setResponse: Dispatch<SetStateAction<MessageResponse>>
    queue: string[]
    setQueue: Dispatch<SetStateAction<string[]>>
}

export const MessageContextInitialState: MessageContextType = {
    response: {
        messageId: '',
        name: '',
        position: '',
        message: '',
        avatar: '',
        lastUrl: '',
    },
    setResponse: () => {},
    queue: [],
    setQueue: () => {},
}

export const MessageContext = React.createContext<MessageContextType>(MessageContextInitialState)

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [response, setResponse] = useState<MessageResponse>(MessageContextInitialState.response)
    const [queue, setQueue] = useState<string[]>([])

    useEffect(() => {
        // TODO: Fetch messages for the profile where the user is if exists, otherwise generate them
    }, [])

    return (
        <MessageContext.Provider value={{ response, setResponse, queue, setQueue }}>{children}</MessageContext.Provider>
    )
}

export const useMessageStore = (): MessageContextType => {
    const { response, setResponse, queue, setQueue } = useContext(MessageContext)

    return { response, setResponse, queue, setQueue }
}
