/* eslint-disable default-case */
import { io } from 'socket.io-client'
import {
    FETCH_PROFILE_MESSAGES,
    GIVE_FEEDBACK,
    SAVE_COPIED_MESSAGE,
    SIGN_IN,
    VALIDATE_SESSION,
    WS_EVENT_SIGN_IN_SUCCESSFUL,
} from './api_actions'
import { getMessagsWithLinkedinUrl, giveFeedback, saveCopiedMessage, validateSession } from './requests'
import { init, track } from '@amplitude/analytics-browser'

init('84794981b424b69ef82526112d599fcd')

if (chrome.action) {
    chrome.action.onClicked.addListener(function (tab) {
        track('open-tab-extension', {})
    })
}
chrome.runtime.onConnectExternal.addListener((newPort) => {
    console.log('On connect listener')

    // Save the port globally
    const port = newPort

    setInterval(() => {
        port.postMessage({ action: 'keep-alive' })
    }, 1000 * 60)

    // Add a listener for incoming messages on the port
    port.onMessage.addListener(async (message) => {
        console.log('Received message from content script:', message)

        if (!message.action) return

        switch (message.action) {
            case FETCH_PROFILE_MESSAGES:
                const res = await getMessagsWithLinkedinUrl(
                    message.data.leadUrl,
                    message.data.access_token,
                    message.data.mockMessages
                )
                console.log('Message res: ', res)
                if (res.status !== 201)
                    port.postMessage({
                        action: FETCH_PROFILE_MESSAGES,
                        data: { status: res.status, data: { message: res.data.message } },
                    })
                if (res.status === 201) {
                    port.postMessage({
                        action: FETCH_PROFILE_MESSAGES,
                        data: {
                            status: res.status,
                            data: {
                                ...res.data,
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
                                user_id: event.user_id,
                                user_email_address: event.user_email_address,
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

                if (feedback_res.status !== 200)
                    port.postMessage({
                        action: GIVE_FEEDBACK,
                        data: { status: feedback_res.status, data: { message: 'Ocurrio un error' } },
                    })
                if (feedback_res.status === 200) {
                    port.postMessage({
                        action: GIVE_FEEDBACK,
                        data: {
                            status: feedback_res.status,
                        },
                    })
                }
                break
            case SAVE_COPIED_MESSAGE:
                const save_copied_message_res = await saveCopiedMessage(
                    message.data.messageId,
                    message.data.copiedMessage,
                    message.data.access_token
                )
                console.log('COPIED MESSAGE RES: ', save_copied_message_res)

                if (save_copied_message_res.status !== 200) {
                    port.postMessage({
                        action: SAVE_COPIED_MESSAGE,
                        data: {
                            status: save_copied_message_res.status,
                            data: { message: save_copied_message_res.data.message },
                        },
                    })
                } else {
                    port.postMessage({
                        action: SAVE_COPIED_MESSAGE,
                        data: { status: save_copied_message_res.status, data: undefined },
                    })
                }

                break
            case 'TRACK_ANALYTIC_EVENT':
                track(message.data.eventName, message.data.eventProperties)
                break
        }
    })

    port.onDisconnect.addListener(() => {
        console.log('Disconencted')
    })
})
