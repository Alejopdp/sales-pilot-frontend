import './App.css'
import PreSearchSidebarContent from './components/preSearchSidebarContent'
import { SALES_PILOT_SIDEBAR_ID } from './constants'
import Navbar from './components/navbar'
import { useAuth } from './context/auth.context'
import SignIn from './components/signIn'
import { useNavigation } from './context/navigation'
import ProfileMenu from './components/profileMenu'
import FooterMenu from './components/footerMenu'
import { Box } from '@mui/material'
import ForbiddenWordsPage from './components/forbiddenWordsPage'
import MyDataPage from './components/myDataPage'

function App() {
    const { isAuthenticated } = useAuth()
    const { route } = useNavigation()
    console.log('Is authenticated: ', isAuthenticated)

    if (!isAuthenticated)
        return (
            <div id={SALES_PILOT_SIDEBAR_ID} className="sales-pilot-sidebar">
                <Navbar />
                <SignIn />
            </div>
        )

    return (
        <div id={SALES_PILOT_SIDEBAR_ID} className="sales-pilot-sidebar">
            <Navbar />
            <Box display={'flex'} flexDirection={'column'} height={'100%'} marginBottom={7} overflow={'auto'}>
                {route === 'home' ? (
                    <PreSearchSidebarContent />
                ) : route === 'forbidden_words' ? (
                    <ForbiddenWordsPage />
                ) : route === 'my_data' ? (
                    <MyDataPage />
                ) : (
                    <ProfileMenu />
                )}
            </Box>
            <FooterMenu />
        </div>
    )
}

export default App
