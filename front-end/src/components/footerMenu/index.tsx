import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import { NavigationRoute, useNavigation } from '../../context/navigation'
import MessageIcon from '@mui/icons-material/Message'
import SettingsIcon from '@mui/icons-material/Settings'
import { useEffect, useRef } from 'react'

const FooterMenu = () => {
    const { setRoute, route } = useNavigation()
    const [homeRef, profileRef] = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)]

    useEffect(() => {
        if (route === 'forbidden_words' || route === 'my_data' || route === 'profile') {
            profileRef.current?.classList.add('Mui-selected')
            homeRef.current?.classList.remove('Mui-selected')
        }
        if (route === 'home') {
            homeRef.current?.classList.add('Mui-selected')
            profileRef.current?.classList.remove('Mui-selected')
        }
    }, [route])

    return (
        <BottomNavigation
            showLabels
            value={route}
            onChange={(event, newValue: NavigationRoute) => {
                setRoute(newValue)
            }}
            style={{ position: 'fixed', bottom: 0, left: 0, width: '100%' }}
        >
            <BottomNavigationAction
                ref={homeRef}
                className="menuItem"
                label="Mensajes"
                value={'home'}
                icon={<MessageIcon fontSize="large" />}
            />
            <BottomNavigationAction
                ref={profileRef}
                className="menuItem"
                label="Perfil"
                value={'profile'}
                icon={<SettingsIcon fontSize="large" />}
            />
        </BottomNavigation>
    )
}

export default FooterMenu
