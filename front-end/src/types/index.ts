export type Message = {
    id: string,
    content: string
}

export type MessageResponse = {
    messages: Message[]
    avatar: string,
    name: string,
    position: string,
    lastUrl: string
}
