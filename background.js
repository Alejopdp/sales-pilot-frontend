/* eslint-disable default-case */
import { io } from 'socket.io-client'
import {
    FETCH_PROFILE_MESSAGES,
    GIVE_FEEDBACK,
    SAVE_COPIED_MESSAGE,
    SIGN_IN,
    UPDATE_FORBBIDEN_WORDS,
    VALIDATE_SESSION,
    WS_EVENT_SIGN_IN_SUCCESSFUL,
} from './api_actions'
import {
    getMessagsWithLinkedinUrl,
    giveFeedback,
    saveCopiedMessage,
    updateForbiddenWords,
    validateSession,
} from './requests'
import { init, track } from '@amplitude/analytics-browser'
// const WS_API_URL = 'ws://localhost:3000'
const WS_API_URL = 'ws://api.development.salespilot.app'
const AMPLITUDE_ID = '84794981b424b69ef82526112d599fcd'

init(AMPLITUDE_ID)

if (chrome.action) {
    chrome.action.onClicked.addListener(function (tab) {
        track('open-tab-extension', {})
    })
}

const onMessageHandler = (newPort) => {
    const port = newPort

    setInterval(() => {
        port.postMessage({ action: 'keep-alive' })
    }, 1000 * 29)

    port.onMessage.addListener(async (message) => {
        if (!message.action) return

        switch (message.action) {
            case FETCH_PROFILE_MESSAGES:
                const res = await getMessagsWithLinkedinUrl(
                    message.data.leadUrl,
                    message.data.access_token,
                    message.data.mockMessages
                )
                if (res.status !== 201)
                    port.postMessage({
                        action: FETCH_PROFILE_MESSAGES,
                        data: { status: res.status, data: { ...res.data } },
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

                port.postMessage({
                    action: VALIDATE_SESSION,
                    data: { status: validate_session_res.status, data: { ...validate_session_res.data } },
                })

                break

            case SIGN_IN:
                const socket = io(WS_API_URL, { transports: ['websocket'] }) // TODO: Change w env var

                socket.on('connect', () => {
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
                        port.postMessage({
                            action: WS_EVENT_SIGN_IN_SUCCESSFUL,
                            data: {
                                status: 200,
                                access_token: event.access_token,
                                user: event.user,
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

                if (feedback_res.status !== 200)
                    port.postMessage({
                        action: GIVE_FEEDBACK,
                        data: { status: feedback_res.status, data: { ...feedback_res.data } },
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

                if (save_copied_message_res.status !== 200) {
                    port.postMessage({
                        action: SAVE_COPIED_MESSAGE,
                        data: {
                            status: save_copied_message_res.status,
                            data: { ...save_copied_message_res.data },
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

            case UPDATE_FORBBIDEN_WORDS:
                const forbidden_words_res = await updateForbiddenWords(
                    message.data.forbiddenWords,
                    message.data.access_token
                )

                if (forbidden_words_res.status !== 200) {
                    port.postMessage({
                        action: UPDATE_FORBBIDEN_WORDS,
                        data: { status: forbidden_words_res.status, data: { ...forbidden_words_res.data } },
                    })
                } else {
                    port.postMessage({
                        action: UPDATE_FORBBIDEN_WORDS,
                        data: {
                            status: forbidden_words_res.status,
                        },
                    })
                }
        }
    })

    port.onDisconnect.removeListener(onMessageHandler)
}

chrome.runtime.onConnectExternal.addListener(onMessageHandler)

function forceReconnect(port) {
    deleteTimer(port)
    port.disconnect()
}
function deleteTimer(port) {
    if (port._timer) {
        clearTimeout(port._timer)
        delete port._timer
    }
}
