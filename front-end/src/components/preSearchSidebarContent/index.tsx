import React, { useState } from 'react'
import { Avatar, Box, Button, CircularProgress, Typography } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { isALinkedinProfile, isLinkedInURL } from '../../helpers'
import { useSnackbar } from 'notistack'
import useApi from '../../hooks/useApi'
import RocketIcon from '../../assets/rocket2.png'
import RocketSpinner from '../../assets/rocket-spinner.gif'
import EmptyState from '../emptyState/emptyState'
import GeneratedMessage from '../generatedMessage'
import {
    IMAGE_HTML_SOURCE_ATRIBUTE,
    LOCAL_ENV,
    PROFILE_AVATAR_CLASS_SELECTOR,
    PROFILE_NAME_CLASS_SELECTOR,
    PROFILE_POSITION_CLASS_SELECTOR,
} from '../../constants'

const useStyles: () => any = makeStyles(() =>
    createStyles({
        button: {
            displat: 'flex',
            justifyContent: 'flex-start',
            position: 'relative',
            zIndex: 0,
            overflow: 'hidden',
            '&:before': {
                content: '""',
                position: 'absolute',
                zIndex: -1,
                top: '-10%',
                left: '-110%',
                width: '25%',
                height: '120%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'skewX(30deg)',
                transition: 'transform 0.5s, opacity 0.5s, left 0.5s',
                opacity: 0,
            },
            '&:hover:before': {
                transform: 'translateX(10%) skewX(30deg)',
                opacity: 1,
                left: '110%',
            },
        },
        icon: {
            height: 32,
            marginRight: 8,
        },
    })
)

const PreSearchSidebarContent = () => {
    const classes = useStyles()
    const [error, setError] = useState('')
    const { enqueueSnackbar } = useSnackbar()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { getMessagsWithLinkedinUrl } = useApi({
        enviroment: process.env.NODE_ENV as 'development' | 'production',
        fail: false,
    })
    const [showPostSearch, setShowPostSearch] = useState(false)
    const [response, setResponse] = useState({
        name: '',
        position: '',
        messages: [],
        avatar: '',
    })
    const [isLoadingMoreOptions, setIsLoadingMoreOptions] = useState(false)
    const [isLoadingTryingAgain, setIsLoadingTryingAgain] = useState(false)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsSubmitting(true)
        const url =
            process.env.NODE_ENV === 'development' ? 'https://www.linkedin.com/in/damisanchez/' : window.location.href

        if (!isLinkedInURL(url)) {
            setError('La URL ingresada no es de Linkedin')
            setIsSubmitting(false)

            return
        }

        if (!isALinkedinProfile(url)) {
            const splittedUrl = url.split('/')
            setError(`No se ha encontrado el perfil ${splittedUrl[splittedUrl.length - 1]}`)
            setIsSubmitting(false)

            return
        }

        await fetchMessages(url)
    }

    const fetchMessages = async (profileUrl: string) => {
        try {
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) {
                enqueueSnackbar(res.data?.message ?? 'Error')
                throw new Error('Respuesta no exitosa')
            }

            setResponse({ ...res.data, messages: res.data.messages })
            setShowPostSearch(true)
        } catch (error) {
            console.log(error)
            setError('No se encontraron mensajes')
        }

        setIsSubmitting(false)
    }

    const tryAgain = async (profileUrl: string) => {
        setIsLoadingTryingAgain(true)
        try {
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) enqueueSnackbar(res.data?.message ?? 'Error')

            setResponse({ ...response, messages: res.data.messages })
        } catch (error) {
            console.log('Error: ', error)
        }
        setIsLoadingTryingAgain(false)
    }

    const addMessages = async (profileUrl: string) => {
        setIsLoadingMoreOptions(true)
        try {
            const res = await getMessagsWithLinkedinUrl(profileUrl)
            if (res.status !== 201) {
                enqueueSnackbar(res.data?.message ?? 'Error')
                return
            }

            // setResponse({ ...response, messages: [...response.messages, ...res.data.messages] })
        } catch (error) {
            console.log('Error: ', error)
        }
        setIsLoadingMoreOptions(false)
    }

    const getProfileImageSrc = () => {
        if (process.env.NODE_ENV === LOCAL_ENV) return ''

        const avatarElement = document.querySelector(PROFILE_AVATAR_CLASS_SELECTOR)

        return avatarElement?.getAttribute(IMAGE_HTML_SOURCE_ATRIBUTE) ?? ''
    }

    const getPositon = () => {
        if (process.env.NODE_ENV === LOCAL_ENV) return ''

        const positionElement = document.querySelector(PROFILE_POSITION_CLASS_SELECTOR)

        return positionElement?.textContent ?? ''
    }

    const getName = () => {
        if (process.env.NODE_ENV === LOCAL_ENV) return ''

        const nameElement = document.querySelector(PROFILE_NAME_CLASS_SELECTOR)

        return nameElement?.textContent ?? ''
    }
    return (
        <Box display="flex" flexDirection="column" height="100%" width="100%">
            <Box display="flex" marginBottom={4}>
                <Avatar alt="Avatar" sx={{ width: 64, height: 64 }} src={getProfileImageSrc()} />
                <Box display="flex" flexDirection={'column'} alignItems="flex-start" paddingLeft={4}>
                    <Typography marginBottom={1} style={{ fontSize: 18, fontWeight: 700 }}>
                        {getName()}
                    </Typography>
                    <Typography variant="body1" marginBottom={2} fontSize={12}>
                        {getPositon()}
                    </Typography>
                </Box>
            </Box>
            {error ? (
                <EmptyState
                    title="No encontramos mensajes"
                    subtitle="Revisa que la URL ingresada sea de un usuario existente"
                    handler={() => tryAgain('')}
                />
            ) : showPostSearch ? (
                <Box width="fit-content">
                    {response.messages?.map((message: string, idx: number) => (
                        <GeneratedMessage key={`message-${idx}`} message={message} />
                    ))}
                    {isLoadingMoreOptions ? (
                        <Box display="flex" width="100%">
                            <CircularProgress style={{ margin: 'auto' }} />
                        </Box>
                    ) : (
                        <></>
                        // <Button
                        //     style={{ height: 52, fontSize: 18 }}
                        //     variant="contained"
                        //     fullWidth
                        //     onClick={() => addMessages('')}
                        // >
                        //     VER MAS OPCIONES
                        // </Button>
                    )}
                </Box>
            ) : isSubmitting ? (
                <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <img src={RocketSpinner} height={83} width={77.5} style={{ marginBottom: 16 }} />
                    <Typography fontSize={14}>Estamos generando los mejores mensajes!</Typography>
                </Box>
            ) : (
                <Button
                    className={classes.button}
                    style={{ height: 52, fontSize: 18 }}
                    variant="contained"
                    fullWidth
                    onClick={(e) => handleSubmit(e)}
                    disabled={isSubmitting}
                >
                    <img src={RocketIcon} alt="icon" className={classes.icon} />
                    OBTENER MENSAJES
                </Button>
            )}
        </Box>
    )
}

export default PreSearchSidebarContent
