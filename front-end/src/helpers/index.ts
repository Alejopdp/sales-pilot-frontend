import axios from "axios"

export function isLinkedInURL(url: string): boolean {
    const pattern = /(https?:\/\/)?(www\.)?linkedin\.com\/(.*)/i;
    return pattern.test(url);
}

export async function isALinkedinProfile(url: string): Promise<boolean> {
    const res = await axios.get(url)

    return res.status !== 404
}

// TODO: Make it usefull in development enviroment
export function isALinkedinProfileUrl(url: string): boolean {
    const pattern = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/(.*)/i;
    console.log("URL being tested: ", url)
    console.log("Is a linkedin profile URL: ", pattern.test(url))

    return pattern.test(url);
}