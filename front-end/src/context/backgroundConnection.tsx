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
}

const BackgroundContext = createContext<IBackgroundContext>({
    connection: null,
})

export const useBackgroundConnection = (): IBackgroundConnection | null => {
    const { connection } = useContext(BackgroundContext)

    return connection
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

    useEffect(() => {
        let port: any = null

        if (process.env.NODE_ENV !== 'development') {
            try {
                console.log('Connecting to background...')
                //@ts-ignore
                port = chrome.runtime.connect(EXTENSION_ID, { name: 'background' })

                setConnection({
                    send: (message: IMessage) =>
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
            } catch (error) {
                console.error('Error connecting to background', error)
            }
        }

        return () => {
            if (process.env.NODE_ENV !== 'development') {
                port.disconnect()
                setConnection(connectionIniitialState)
            }
        }
    }, [])

    return <BackgroundContext.Provider value={{ connection }}>{children}</BackgroundContext.Provider>
}
