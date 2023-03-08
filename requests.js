const getMessagsWithLinkedinUrl = async (leadUrl) => {
    const res = await fetch(`https://us-central1-smart-sales-gpt.cloudfunctions.net/api/linkedin`, {
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
