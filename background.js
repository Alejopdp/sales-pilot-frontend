// import { FETCH_PROFILE_MESSAGES } from './api_actions'
// import { getMessagsWithLinkedinUrl } from './requests'
importScripts('/api_actions.js', '/requests.js')

chrome.runtime.onConnectExternal.addListener((newPort) => {
    console.log('On connect listener')
    // Save the port globally
    port = newPort

    // Add a listener for incoming messages on the port
    port.onMessage.addListener(async (message) => {
        console.log('Received message from content script:', message)

        if (!message.action) return

        switch (message.action) {
            case FETCH_PROFILE_MESSAGES:
                const res = await getMessagsWithLinkedinUrl(message.data.leadUrl)
                console.log('Message res: ', res)
                if (res.status !== 201)
                    port.postMessage({
                        action: FETCH_PROFILE_MESSAGES,
                        data: { status: res.status, data: { message: 'Ocurrio un error' } },
                    })
                if (res.status === 201) {
                    // Send a message to the content script to confirm the connection
                    port.postMessage({
                        action: FETCH_PROFILE_MESSAGES,
                        data: { status: res.status, data: { messages: res.data.messages } },
                    })
                }

                break
        }
    })

    port.onDisconnect.addListener(() => {
        console.log('Disconencted')
    })
})

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('Mensajito en add listner:', request)
//     if (request.action === FETCH_PROFILE_MESSAGES) {
//         console.log('Fetching profile messages')
//         getMessagsWithLinkedinUrl(request.data.leadUrl).then((response) => {
//             sendResponse({ action: FETCH_PROFILE_MESSAGES, ...response })
//         })
//     }
//     return true
// })

// if (res.status !== 201)
// return {
//     action: FETCH_PROFILE_MESSAGES,
//     status: res.status,
//     data: { status: 'error', message: 'Ocurrio un error' },
// }
// if (res.status === 201) {
// // Send a message to the content script to confirm the connection
// return {
//     action: FETCH_PROFILE_MESSAGES,
//     status: 200,
//     data: { status: 'success', messages: res.data.messages },
// }
// }
