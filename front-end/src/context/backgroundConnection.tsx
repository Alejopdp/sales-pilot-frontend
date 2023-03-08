import React, { createContext, useContext, useEffect, useState } from 'react'
import { EXTENSION_ID } from '../constants'

interface IMessage {
    action: string
    data?: any
}

interface IBackgroundResponse {
    success: boolean
    data?: any
    error?: string
}

interface IBackgroundConnection {
    send: (message: IMessage) => Promise<IBackgroundResponse> | any
    close: () => void
}

interface IBackgroundContext {
    connection: IBackgroundConnection | null
}

const BackgroundContext = createContext<IBackgroundContext>({
    connection: null,
})

export const useBackgroundConnection = (): IBackgroundConnection | null => {
    const { connection } = useContext(BackgroundContext)

    // if (!connection) {
    //     throw new Error('No background connection available')
    // }

    return connection
}

interface IBackgroundProviderProps {
    children: React.ReactNode
}

const connectionIniitialState = {
    send: () => alert('No connection established'),
    close: () => alert('No connection'),
}
export const BackgroundProvider = ({ children }: IBackgroundProviderProps): JSX.Element => {
    const [connection, setConnection] = useState<IBackgroundConnection>(connectionIniitialState)

    useEffect(() => {
        let port: any = null

        if (process.env.NODE_ENV !== 'development') {
            try {
                //@ts-ignore
                port = chrome.runtime.connect(EXTENSION_ID, { name: 'background' })

                setConnection({
                    send: (message) =>
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
