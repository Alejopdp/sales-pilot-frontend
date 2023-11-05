import { Box, TextField, Typography } from '@mui/material'
import BackButton from '../backButton'
import { useNavigation } from '../../context/navigation'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import useApi from '../../hooks/useApi'
import { useRef, useState } from 'react'
import { useAuth } from '../../context/auth.context'
import EmptyState from '../emptyState/emptyState'
import EmptyFolder from '../../assets/empty-folder.png'

const ForbiddenWordsPage = () => {
    const { user, setUser } = useAuth()
    const { setRoute } = useNavigation()
    const { updateForbbidenWords } = useApi()
    const [words, setWords] = useState<string[]>(user?.forbidden_words ?? [])
    const inputRef = useRef<HTMLInputElement>(null)
    const [isUdating, setIsUpdating] = useState(false)

    const addWord = async (word: string) => {
        if (word === '') return
        if (words.some((wd) => wd.toLocaleLowerCase() === word.toLocaleLowerCase())) return
        setIsUpdating(true)

        await updateForbbidenWords([...user!.forbidden_words, word])

        setWords([...words, word])
        setUser({ ...user!, forbidden_words: [...user!.forbidden_words, word] })
        setIsUpdating(false)
    }

    const clearWord = async (word: string) => {
        setIsUpdating(true)
        const newWords = words.filter((wd) => wd !== word)

        await updateForbbidenWords(newWords)

        setWords(newWords)
        setUser({ ...user!, forbidden_words: newWords })
        setIsUpdating(false)
    }

    return (
        <Box>
            <Box display={'block'}>
                <BackButton actualRoute="Palabras prohibidas" goBack={() => setRoute('profile')} />
            </Box>
            <TextField
                inputRef={inputRef}
                helperText={'Ingresa una palabra y presiona enter para agregarla'}
                FormHelperTextProps={{
                    style: {
                        fontSize: 14,
                        backgroundColor: 'transparent',
                        fontStyle: 'italic',
                        color: 'rgba(0, 0, 0, 0.6)',
                    },
                }}
                style={{ marginBottom: 32, backgroundColor: 'transparent' }}
                fullWidth
                hiddenLabel
                variant="filled"
                InputProps={{ disableUnderline: true, style: { color: '#000' } }}
                inputProps={{ color: '#000', style: { color: '#000' } }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        addWord(inputRef.current?.value ?? 'Null')
                        inputRef.current!.value = ''
                    }
                }}
                disabled={isUdating}
            />
            {words.length === 0 && (
                <Box>
                    <EmptyState
                        title={'Aún no has prohibido ninguna palabra'}
                        subtitle={
                            'Aquí veras las palabras que no quieres que la IA utilice al momento de generar tus mensajes.'
                        }
                        img={EmptyFolder}
                    />
                </Box>
            )}
            {words.map((word) => (
                <Box display="flex" alignItems={'center'} width={'100%'}>
                    <IconButton size="large" onClick={() => clearWord(word)} style={{ marginRight: 8 }}>
                        <ClearIcon fontSize="large" color="error" />
                    </IconButton>
                    <Typography variant="body1" color="initial" fontSize={18}>
                        {word}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}

export default ForbiddenWordsPage
