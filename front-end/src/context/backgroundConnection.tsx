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
    port: any | null
    send: ((message: IMessage) => Promise<IBackgroundResponse>) | null
    close: (() => void) | null
}

interface IBackgroundContext {
    connection: IBackgroundConnection | null
}

const BackgroundContext = createContext<IBackgroundContext>({
    connection: null,
})

export const useBackgroundConnection = (): { connection: IBackgroundConnection | null } => {
    const { connection } = useContext(BackgroundContext)

    return { connection }
}

interface IBackgroundProviderProps {
    children: React.ReactNode
}

const connectionIniitialState: IBackgroundConnection = {
    port: null,
    send: null,
    close: null,
}
export const BackgroundProvider = ({ children }: IBackgroundProviderProps): JSX.Element => {
    const [connection, setConnection] = useState<IBackgroundConnection>(connectionIniitialState)

    const connectToBackground = () => {
        const port = chrome.runtime.connect(EXTENSION_ID, { name: `background-${Math.random()}` })
        // port.onMessage.addListener((message: any) => {
        //     if (message.action === 'keep-alive') port.postMessage({ action: 'keep-alive-response' })
        // })

        port.onDisconnect.addListener(() => {
            console.log('Disconnected from background...')
            setConnection({ ...connectionIniitialState })
            setTimeout(() => connectToBackground(), 1000)
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
            port,
        })
    }

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            try {
                console.log('Connecting to background...')
                connectToBackground()
                //@ts-ignore
            } catch (error) {
                console.error('Error connecting to background', error)
            }
        }

        return () => {
            if (process.env.NODE_ENV !== 'development') {
                console.log('Disconnecting from background...')
                connection.port.disconnect()
                setConnection(connectionIniitialState)
            }
        }
    }, [])

    return <BackgroundContext.Provider value={{ connection }}>{children}</BackgroundContext.Provider>
}
