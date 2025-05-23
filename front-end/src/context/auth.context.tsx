import React, { ReactNode, useContext, useEffect, useState } from 'react'
import {
    LOCAL_STORAGE_ACCESS_TOKEN,
    LOCAL_STORAGE_USER_EMAIL_ADDRESS,
    LOCAL_STORAGE_USER_ID,
    VALIDATE_SESSION,
    WS_EVENT_SIGN_IN_SUCCESSFUL,
} from '../constants'
import { useBackgroundConnection } from './backgroundConnection'
import { useMessageStore } from './messages.context'
import useApi from '../hooks/useApi'
import { User } from '../types'

type AuthContextType = {
    user: User | null
    setUser: (user: User | null) => void
    handleSignIn: () => void
    isAuthenticating: boolean
    isAuthenticated: boolean
    getUserDataFromLocalStorage: () => {
        user_id: string | null
        user_email_address: string | null
        access_token: string | null
    }
    logOutUser: () => void
}

export const AuthContextInitialState: AuthContextType = {
    handleSignIn: () => {},
    isAuthenticating: false,
    isAuthenticated: false,
    getUserDataFromLocalStorage: () => ({ user_id: '', user_email_address: '', access_token: '' }),
    logOutUser: () => {},
    user: null,
    setUser: () => {},
}

export const AuthContext = React.createContext<AuthContextType>(AuthContextInitialState)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { connection } = useBackgroundConnection()
    const { setQueue } = useMessageStore()
    const { trackAnalyticEvent } = useApi()
    const [user, setUser] = useState<User | null>(null)
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

    const getUserDataFromLocalStorage = () => {
        const user_id = window.localStorage.getItem(LOCAL_STORAGE_USER_ID)
        const user_email_address = window.localStorage.getItem(LOCAL_STORAGE_USER_EMAIL_ADDRESS)
        const access_token = window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)

        return { user_id, user_email_address, access_token }
    }

    const validateAccessToken = async (access_token: string) => {
        try {
            const res = await validateAccessTokenProductionRes(access_token)
            if (res?.status === 200) {
                setIsAuthenticating(false)
                setUser(res.data!.user) // TODO: Agregarlo en la respuesta delñ back
                setIsAuthenticated(true)
            } else {
                setIsAuthenticating(false)
                setIsAuthenticated(false)
                if (res && res.status !== 499) {
                    window.localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
                    window.localStorage.removeItem(LOCAL_STORAGE_USER_ID)
                }
            }
        } catch (error) {
            setIsAuthenticating(false)
            setIsAuthenticated(false)
            window.localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
            window.localStorage.removeItem(LOCAL_STORAGE_USER_ID)
        }
    }

    const validateAccessTokenProductionRes = async (access_token: string) => {
        if (connection === null || connection.send === null) return { status: 499, data: null }

        const res = await connection.send<{ user: User }>({ action: VALIDATE_SESSION, data: { access_token } })

        return res
    }
    const handleSignIn = () => {
        handleProductionSignIn()
        trackAnalyticEvent('login-linkedin-sidebar', { authMethod: 'Linkedin' })
    }

    const logOutUser = () => {
        window.localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
        window.localStorage.removeItem(LOCAL_STORAGE_USER_ID)
        window.localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL_ADDRESS)
        setIsAuthenticated(false)
        setIsAuthenticating(false)
    }

    const handleProductionSignIn = async () => {
        setIsAuthenticating(true)
        const redirect_uri = `${process.env.REACT_APP_API_URL}/auth/sign-in`

        if (connection === null || connection.send === null) {
            setIsAuthenticating(false)
            return
        }

        connection.port.onMessage.addListener(
            (message: { action: string; data: { status: number; user: User; access_token: string } }, port: any) => {
                if (message.action === WS_EVENT_SIGN_IN_SUCCESSFUL) {
                    if (message.data.status === 200) {
                        window.localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, message.data.access_token)
                        window.localStorage.setItem(LOCAL_STORAGE_USER_ID, message.data.user.id)
                        window.localStorage.setItem(LOCAL_STORAGE_USER_EMAIL_ADDRESS, message.data.user.email)

                        setIsAuthenticating(false)
                        setIsAuthenticated(true)
                        setUser(message.data.user)
                        setQueue(['scrape'])
                    }
                }
            }
        )
        const res = await connection.send<{ socketId: string }>({ action: 'SIGN_IN' })

        window
            .open(
                `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${redirect_uri}&state=${res?.data.socketId}&scope=r_liteprofile%20r_emailaddress`
            )
            ?.focus()
    }

    return (
        <AuthContext.Provider
            value={{
                handleSignIn,
                isAuthenticating,
                isAuthenticated,
                getUserDataFromLocalStorage,
                logOutUser,
                user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const { handleSignIn, isAuthenticating, isAuthenticated, getUserDataFromLocalStorage, logOutUser, user, setUser } =
        useContext(AuthContext)

    return { handleSignIn, isAuthenticating, isAuthenticated, getUserDataFromLocalStorage, logOutUser, user, setUser }
}
