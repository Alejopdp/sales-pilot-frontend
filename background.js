import { io } from 'socket.io-client'
import {
    FETCH_PROFILE_MESSAGES,
    GIVE_FEEDBACK,
    SIGN_IN,
    VALIDATE_SESSION,
    WS_EVENT_SIGN_IN_SUCCESSFUL,
} from './api_actions'
import { getMessagsWithLinkedinUrl, giveFeedback, validateSession } from './requests'

chrome.runtime.onConnectExternal.addListener((newPort) => {
    console.log('On connect listener')
    // Save the port globally
    const port = newPort

    // Add a listener for incoming messages on the port
    port.onMessage.addListener(async (message) => {
        console.log('Received message from content script:', message)

        if (!message.action) return

        switch (message.action) {
            case FETCH_PROFILE_MESSAGES:
                const res = await getMessagsWithLinkedinUrl(message.data.leadUrl, message.data.access_token)
                console.log('Message res: ', res)
                if (res.status !== 201)
                    port.postMessage({
                        action: FETCH_PROFILE_MESSAGES,
                        data: { status: res.status, data: { message: 'Ocurrio un error' } },
                    })
                if (res.status === 201) {
                    port.postMessage({
                        action: FETCH_PROFILE_MESSAGES,
                        data: {
                            status: res.status,
                            data: {
                                id: res.data.messageId,
                                message: res.data.message,
                                avatar: res.data.avatar,
                                name: res.data.name,
                                position: res.data.position,
                            },
                        },
                    })
                }
                break
            case VALIDATE_SESSION:
                const validate_session_res = await validateSession(message.data.access_token)

                if (validate_session_res.status !== 200) {
                    port.postMessage({
                        action: VALIDATE_SESSION,
                        data: { status: validate_session_res.status, data: { message: 'Ocurrio un error' } },
                    })
                } else {
                    console.log('Successful reuqest')
                    port.postMessage({
                        action: VALIDATE_SESSION,
                        data: {
                            status: validate_session_res.status,
                            data: undefined,
                        },
                    })
                }

                break

            case SIGN_IN:
                console.log('Connecting to socket')
                const socket = io(`ws://api.development.salespilot.app`, { transports: ['websocket'] }) // TODO: Change w env var

                socket.on('connect', () => {
                    console.log('Connected to server, socket id: ', socket.id)
                    socket.emit('sign_in')
                    port.postMessage({
                        action: SIGN_IN,
                        data: {
                            status: 200,
                            data: {
                                socketId: socket.id,
                            },
                        },
                    })

                    socket.on(WS_EVENT_SIGN_IN_SUCCESSFUL, (event) => {
                        console.log('sign_in_successful: ', event)
                        port.postMessage({
                            action: WS_EVENT_SIGN_IN_SUCCESSFUL,
                            data: {
                                status: 200,
                                access_token: event.access_token,
                            },
                        })
                    })
                })
                break

            case GIVE_FEEDBACK:
                const feedback_res = await giveFeedback(
                    message.data.messageId,
                    message.data.isPositive,
                    message.data.comment,
                    message.data.access_token
                )
                console.log('Message res: ', feedback_res)

                if (feedback_res.status !== 201)
                    port.postMessage({
                        action: GIVE_FEEDBACK,
                        data: { status: feedback_res.status, data: { message: 'Ocurrio un error' } },
                    })
                if (res.status === 201) {
                    port.postMessage({
                        action: GIVE_FEEDBACK,
                        data: {
                            status: feedback_res.status,
                        },
                    })
                }
                break
        }
    })

    port.onDisconnect.addListener(() => {
        console.log('Disconencted')
    })
})
