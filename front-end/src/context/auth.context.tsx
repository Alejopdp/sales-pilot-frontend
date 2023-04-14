import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { LOCAL_STORAGE_ACCESS_TOKEN, VALIDATE_SESSION, WS_EVENT_SIGN_IN_SUCCESSFUL } from '../constants'
import axios from 'axios'
import { useBackgroundConnection } from './backgroundConnection'

type AuthContextType = {
    handleSignIn: () => void
    isAuthenticating: boolean
    isAuthenticated: boolean
}

export const AuthContextInitialState: AuthContextType = {
    handleSignIn: () => {},
    isAuthenticating: false,
    isAuthenticated: false,
}

export const AuthContext = React.createContext<AuthContextType>(AuthContextInitialState)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { connection, port } = useBackgroundConnection()
    const [isAuthenticating, setIsAuthenticating] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (isAuthenticated || connection === null) return
        const access_token = window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        if (access_token) {
            setIsAuthenticating(true)
            validateAccessToken(access_token)
        } else {
            setIsAuthenticating(false)
        }
    }, [connection])

    const validateAccessToken = async (access_token: string) => {
        try {
            const res =
                process.env.NODE_ENV === 'production'
                    ? await validateAccessTokenProductionRes(access_token)
                    : await validateAccessTokenDevelopmentRes(access_token)

            if (res.status === 200) {
                setIsAuthenticating(false)
                setIsAuthenticated(true)
            }
        } catch (error) {
            setIsAuthenticating(false)
            setIsAuthenticated(false)
        }
    }

    //TODO: Change environment logic
    const validateAccessTokenDevelopmentRes = async (access_token: string) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/auth/validate-session`, {
            headers: { authorization: access_token },
        })
    }

    const validateAccessTokenProductionRes = async (access_token: string) => {
        console.log('Validating token in prod')
        if (connection === null) return { status: 500 }
        console.log('Sending request...')
        //@ts-ignore
        const res = await connection.send({ action: VALIDATE_SESSION, data: { access_token } })
        console.log('Res validate: ', res)
        return res
    }
    const handleSignIn = () => {
        if (process.env.NODE_ENV === 'production') {
            handleProductionSignIn()
        } else {
            handleDevelopmentSignIn()
        }
    }

    const handleProductionSignIn = async () => {
        setIsAuthenticating(true)
        const redirect_uri = `${process.env.REACT_APP_API_URL}/auth/sign-in`

        if (connection === null) return
        port.onMessage.addListener((message: any, port: any) => {
            // TODO: REmove listener after sign in
            console.log('Successful message: ', message)
            if (message.action === WS_EVENT_SIGN_IN_SUCCESSFUL) {
                if (message.data.status === 200) {
                    window.localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, message.data.access_token) //TODO: Magic String
                    setIsAuthenticating(false)
                    setIsAuthenticated(true)
                }
            }
        })
        //@ts-ignore
        const res = await connection.send({ action: 'SIGN_IN' })
        console.log('RESPONSE: ', res)

        window
            .open(
                `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${redirect_uri}&state=${res.data.socketId}&scope=r_liteprofile%20r_emailaddress`,
                '_blank'
            )
            ?.focus()
    }

    const handleDevelopmentSignIn = () => {
        const socket = io(process.env.REACT_APP_WS_API_URL!)
        socket.on('connect', () => {
            console.log('Connected to server, socket id: ', socket.id)
            socket.emit('sign_in')
            setIsAuthenticating(true)

            socket.on(WS_EVENT_SIGN_IN_SUCCESSFUL, (event) => {
                console.log('sign_in_successful: ', event)
                window.localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, event.access_token)
                setIsAuthenticating(false)
                setIsAuthenticated(true)
            })

            const redirect_uri = `${process.env.REACT_APP_API_URL}/auth/sign-in`
            console.log(redirect_uri)
            window
                .open(
                    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${redirect_uri}&state=${socket.id}&scope=r_liteprofile%20r_emailaddress`,
                    '_blank'
                )
                ?.focus()
        })
    }

    return (
        <AuthContext.Provider value={{ handleSignIn, isAuthenticating, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const { handleSignIn, isAuthenticating, isAuthenticated } = useContext(AuthContext)

    return { handleSignIn, isAuthenticating, isAuthenticated }
}
