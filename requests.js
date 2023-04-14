const API_URL = 'https://api.development.salespilot.app/api'

export const getMessagsWithLinkedinUrl = async (leadUrl) => {
    const res = await fetch(`${API_URL}/linkedin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
        const res = await fetch(`${API_URL}/auth/validate-session`, { headers: { authrization: access_token } })
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
                Authorization: access_token,
            },
            body: {
                isPositive,
                comment,
            },
        })
        return { status: res.status }
    } catch (error) {
        return { status: res.status, data: { status: 'error', message: 'Ocurrio un error al dar feedback' } }
    }
}
