import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import CommentsDisabled from '@mui/icons-material/CommentsDisabled'
import UserIcon from '@mui/icons-material/Person'
import styles from './profileMenu.module.css'
import { useNavigation } from '../../context/navigation'

const ProfileMenu = () => {
    const { setRoute } = useNavigation()

    return (
        <List>
            <ListItemButton onClick={() => setRoute('my_data')}>
                <ListItemIcon>
                    <UserIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText className={styles.itemText} primary="Mis datos" />
            </ListItemButton>
            <ListItemButton onClick={() => setRoute('forbidden_words')}>
                <ListItemIcon>
                    <CommentsDisabled fontSize="large" />
                </ListItemIcon>
                <ListItemText className={styles.itemText} primary="Palabras prohibidas" />
            </ListItemButton>
        </List>
    )
}

export default ProfileMenu
