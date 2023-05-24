import React, { createContext, useContext, useEffect, useState } from 'react'
import { EXTENSION_ID } from '../constants'

interface IMessage {
    action: string
    data?: any
}

interface IBackgroundResponse {
    status: number
    data: any
    error?: string
}

interface IBackgroundConnection {
    send: ((message: IMessage) => Promise<IBackgroundResponse>) | null
    close: (() => void) | null
}

interface IBackgroundContext {
    connection: IBackgroundConnection | null
    port: any | null
}

const BackgroundContext = createContext<IBackgroundContext>({
    connection: null,
    port: null,
})

export const useBackgroundConnection = (): { connection: IBackgroundConnection | null; port: any | null } => {
    const { connection, port } = useContext(BackgroundContext)

    return { connection, port }
}

interface IBackgroundProviderProps {
    children: React.ReactNode
}

const connectionIniitialState: IBackgroundConnection = {
    send: null,
    close: null,
}
export const BackgroundProvider = ({ children }: IBackgroundProviderProps): JSX.Element => {
    const [connection, setConnection] = useState<IBackgroundConnection>(connectionIniitialState)
    const [port, setPort] = useState<any | null>(null)

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            try {
                console.log('Connecting to background...')
                //@ts-ignore
                const port = chrome.runtime.connect(EXTENSION_ID, { name: 'background' })
                port.onMessage.addListener((message: any) => {
                    if (message.action === 'keep-alive') port.postMessage({ action: 'keep-alive-response' })
                })
                setConnection({
                    send: (message: IMessage, callback?: () => void) =>
                        new Promise<IBackgroundResponse>((resolve) => {
                            port.postMessage(message)

                            port.onMessage.addListener((response: any) => {
                                if (response.action === message.action) {
                                    resolve(response.data)
                                }
                            })
                        }),
                    close: () => port.disconnect(),
                })
                setPort(port)
            } catch (error) {
                console.error('Error connecting to background', error)
            }
        }

        return () => {
            if (process.env.NODE_ENV !== 'development') {
                console.log('Disconnecting from background...')
                port.disconnect()
                setConnection(connectionIniitialState)
            }
        }
    }, [])

    return <BackgroundContext.Provider value={{ connection, port }}>{children}</BackgroundContext.Provider>
}
