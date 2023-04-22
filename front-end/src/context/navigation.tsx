import { createContext, useContext, useEffect, useState } from 'react'
import { LOCAL_ENV } from '../constants'

interface NavigationProviderProps {
    children: React.ReactNode
}

type NavigationRoute = 'home' | 'profile'

const navigationInitialState = 'home'

interface NavigationContext {
    route: NavigationRoute
    setRoute: (newRoute: NavigationRoute) => void
    profiles: Profile[]
    setProfiles: (newProfiles: Profile[]) => void
    selectedProfile: Profile | null
    setSelectedProfile: (profile: Profile | null) => void
}

const navigationContext = createContext<NavigationContext>({
    route: 'home',
    setRoute: (newRoute: NavigationRoute) => '',
    profiles: [],
    setProfiles: (profiles: Profile[]) => '',
    selectedProfile: null,
    setSelectedProfile: (profile: Profile | null) => '',
})

export type Profile = {
    name: string
    avatar: string
    about: string
    actualPosition: string
    experience: ProfileExperience[]
}

export type ProfileExperience = {
    jobTitle: string
    company: string
    modality: string
    dateRange: string
    time: string
    jobLocation: string
}

const initialProfilesState = [
    {
        name: 'Juan Roman Riquelme',
        avatar: '',
        about: 'El idolo n1 de Boca',
        actualPosition: 'Vice presidente de Boca',
        experience: [],
    },
    {
        name: 'Martin Palermo',
        avatar: '',
        about: 'El mejor 9 de la historia del futbol argentino',
        actualPosition: 'DT de Platense',
        experience: [],
    },
    { name: 'Diego Maradona', avatar: '', about: 'D10S', actualPosition: 'Alentando desde el cielo', experience: [] },
]

export const useNavigation = (): NavigationContext => {
    const { profiles, selectedProfile, route, setProfiles, setSelectedProfile, setRoute } =
        useContext(navigationContext)

    return { profiles, selectedProfile, route, setProfiles, setSelectedProfile, setRoute }
}

export const NavigationProvider = ({ children }: NavigationProviderProps): JSX.Element => {
    const [route, setRoute] = useState<NavigationRoute>(navigationInitialState)
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

    useEffect(() => {
        if (process.env.NODE_ENV === LOCAL_ENV) {
            setProfiles(initialProfilesState)
            setSelectedProfile(initialProfilesState[0])
        }
    }, [])

    return (
        <navigationContext.Provider
            value={{ route, setRoute, profiles, setProfiles, selectedProfile, setSelectedProfile }}
        >
            {children}
        </navigationContext.Provider>
    )
}
