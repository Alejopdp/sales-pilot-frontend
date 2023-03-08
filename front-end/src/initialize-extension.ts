import { EXTENSION_ID, SALES_PILOT_BUBBLE_CHAT_ID, SALES_PILOT_DOM_CONTAINER_ID, SALES_PILOT_PROFILE_BUTTON_ANCHOR_SELECTOR, SALES_PILOT_PROFILE_BUTTON_ID, SALES_PILOT_SIDEBAR_ACTIVE_CLASS, SALES_PILOT_SIDEBAR_ID } from "./constants"
import { isALinkedinProfileUrl } from "./helpers"

export function toggleSidebar() {
    const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
    //@ts-ignore
    sidebar.classList.toggle(SALES_PILOT_SIDEBAR_ACTIVE_CLASS)
}

function loadSidebar() {
    console.log("Loading sidebar script")
    const loadSidebarScript = document.createElement('script')
    //@ts-ignore
    loadSidebarScript.setAttribute('src', chrome.runtime.getURL('/react/js/main.js'))
    loadSidebarScript.setAttribute('type', 'module')
    document.body.appendChild(loadSidebarScript)
    console.log("Sidebar script loaded")
    loadSidebarStyles()
    setTimeout(() => {
        closeSidebarOnOutsideClick()
    }, 100) // TODO: Use an event
}

function loadSidebarStyles() {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    //@ts-ignore
    link.href = chrome.runtime.getURL('/sidebar/sidebar.css')
    document.head.appendChild(link)
}

function addDOMContainer() {
    const salesPilotDOMContainer = document.createElement('div')
    salesPilotDOMContainer.setAttribute('id', SALES_PILOT_DOM_CONTAINER_ID)
    document.body.appendChild(salesPilotDOMContainer)
}

function setUrlChangeListener() {
    let actualUrl = ""
    window.addEventListener('click', function () {
        setTimeout(() => {
            const hasUrlChanged = actualUrl !== window.location.href
            actualUrl = window.location.href
            console.log("Has url changed: ", hasUrlChanged)
            if (hasUrlChanged && isALinkedinProfileUrl(window.location.href)) {
                addSalesPilotButtonToProfile();
            }
        }, 3000)

    });
}

export function closeSidebarOnOutsideClick() {

    document.addEventListener('mousedown', (e) => {
        const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
        const targetElement = e.target
        //@ts-ignore
        const isClickInside = sidebar.contains(targetElement) || sidebar.querySelector('*:hover') === targetElement;

        if (
            !isClickInside &&
            //@ts-ignore
            sidebar.classList.contains(SALES_PILOT_SIDEBAR_ACTIVE_CLASS) &&
            //@ts-ignore
            targetElement.id !== SALES_PILOT_PROFILE_BUTTON_ID &&
            //@ts-ignore
            targetElement.id !== SALES_PILOT_BUBBLE_CHAT_ID &&
            //@ts-ignore
            !document?.querySelector('#msg-overlay')?.contains(targetElement)
        ) {
            toggleSidebar()
        }
    })
}


function addSalesPilotButtonToProfile() {
    if (document.querySelector(`#${SALES_PILOT_PROFILE_BUTTON_ID}`)) return
    const anchor = document.querySelector(SALES_PILOT_PROFILE_BUTTON_ANCHOR_SELECTOR)
    if (!anchor) {
        console.log("Anchor not found at addSalesPilotButtonToProfile function")
        return
    }
    const button = document.createElement('button')
    button.innerHTML = 'Send Message'
    button.id = SALES_PILOT_PROFILE_BUTTON_ID
    button.addEventListener('click', () => {
        toggleSidebar()
    })
    //@ts-ignore
    anchor.appendChild(button)
}

function addSalesPilotButtonToBubbleChat() {
    const mutationObserver = new MutationObserver((mutations) => {
        console.log('Mutation observed!')
        document.querySelectorAll('.msg-form__left-actions.display-flex').forEach((element) => {
            const bubbleChatActionsContainer = element
            if (element.querySelector('#sales-pilot-chat-button')) return
            const button = document.createElement('button')
            if (!button) {
                console.log("Button not found at addSalesPilotButtonToBubbleChat function")
                return
            }
            button.id = 'sales-pilot-chat-button'
            const buttonImage = document.createElement('img')
            buttonImage.src = `chrome-extension://${EXTENSION_ID}/react/js/febe6d340b6ede224c85d19140934589.png`
            buttonImage.classList.add("rounded-sales-pilot-image")
            button.appendChild(buttonImage)
            button.addEventListener('click', () => {
                toggleSidebar()
            })
            bubbleChatActionsContainer.appendChild(button)
            addSalesPilotButtonToProfile()
        })
    })
    //@ts-ignore
    mutationObserver.observe(document.querySelector('#msg-overlay'), { childList: true })
}


function initializeExtension() {
    document.addEventListener('readystatechange', (e) => {
        //@ts-ignore
        if (e.target.readyState !== 'complete') return
        //@ts-ignore
        console.log(e.target.readyState)
        setTimeout(() => {
            console.log("Initializing extension")
            addDOMContainer()
            loadSidebar()
            addSalesPilotButtonToBubbleChat()
            addSalesPilotButtonToProfile()
            setUrlChangeListener()
        }, 3000)
    })
}

export { initializeExtension }