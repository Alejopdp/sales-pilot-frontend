const API_URL = 'http://localhost:3000/api'

export const getMessagsWithLinkedinUrl = async (leadUrl, access_token, mockMessages) => {
    const res = await fetch(`${API_URL}/linkedin?mockMessages=${mockMessages}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: access_token,
        },
        body: JSON.stringify({
            leadUrl,
        }),
    })
    const data = await res.json()
    return { status: res.status, data }
}

export const validateSession = async (access_token) => {
    try {
        const res = await fetch(`${API_URL}/auth/validate-session`, { headers: { authorization: access_token } })
        const data = await res.json()

        return { status: res.status, data }
    } catch (error) {
        return { status: 500, data: { status: 'error', message: 'Ocurrio un error al validar la sesión' } }
    }
}

export const giveFeedback = async (messageId, isPositive, comment, access_token) => {
    try {
        const res = await fetch(`${API_URL}/linkedin/give-feedback/${messageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: access_token,
            },
            body: JSON.stringify({
                isPositive,
                comment,
            }),
        })
        return { status: res.status, data: res.data }
    } catch (error) {
        return { status: 500, data: { status: 'error', message: 'Ocurrio un error al dar feedback' } }
    }
}

export const saveCopiedMessage = async (messageId, copiedMessage, access_token) => {
    try {
        const res = await fetch(`${API_URL}/linkedin/save-copied-message/${messageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: access_token,
            },
            body: JSON.stringify({
                copiedMessage,
            }),
        })
        return { status: res.status, data: res.data }
    } catch (error) {
        console.log('ERROR: ', error)
        return { status: 500, data: { status: 'error', message: 'Ocurrio un error al guardar el mensaje' } }
    }
}

export const updateForbiddenWords = async (forbiddenWords, access_token) => {
    try {
        const res = await fetch(`${API_URL}/linkedin/forbidden-words`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: access_token,
            },
            body: JSON.stringify({
                forbiddenWords,
            }),
        })
        return { status: res.status, data: res.data }
    } catch (error) {
        console.log('ERROR: ', error)
        return {
            status: 500,
            data: { status: 'error', message: 'Ocurrio un error al guardar las palabras prohibidas' },
        }
    }
}
