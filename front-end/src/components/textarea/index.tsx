import React, { useEffect } from 'react'

type TextareaProps = {
    value: string
    handleMessageChange: (newMessage: string) => void
    placeholder?: string
}

const Textarea = ({ handleMessageChange, value, placeholder }: TextareaProps) => {
    useEffect(() => {
        resizeTextarea({ target: document.querySelector('textarea') })
    }, [value])

    function resizeTextarea(event: any) {
        event.target.style.height = 'auto'
        event.target.style.height = event.target.scrollHeight + 'px'
    }
    return (
        <textarea
            value={value.replace(/^\n+/, '') ?? ''}
            placeholder={placeholder ?? ''}
            style={{
                border: 'none',
                borderRadius: 8,
                padding: 16,
                backgroundColor: '#F3F2EF',
                overflow: 'hidden',
                resize: 'none',
                flex: 1,
                color: '#000',
            }}
            onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => resizeTextarea(e)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleMessageChange(e.target.value)}
        />
    )
}

export default Textarea
