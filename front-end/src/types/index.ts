export type Message = {
    id: string,
    content: string
    hasFeedback: boolean
}

export type MessageResponse = {
    messages: Message[]
    avatar: string,
    name: string,
    position: string,
    lastUrl: string,
}

export type User = {
    id: string,
    email: string,
    company: string,
    company_role: string,
    linkedin_profile_url: string,
    name: string,
    phone_number: string,
    state: "ACTIVE" | "INACTIVE",
    usage: Usage,
    onboarding_information: OnboardingInformation,
    forbidden_words: string[]
    messages_limit: number
}

export type Usage = {
    start_date: Date,
    end_date: Date,
    qty_of_messages_created: number
}

export type OnboardingInformation = {
    kpis_for_product_or_service: string,
    jobs_to_be_done: string,
    competitive_advantage: string,
    problems: string,
}