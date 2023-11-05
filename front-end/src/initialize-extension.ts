import { EXTENSION_ID, SALES_PILOT_BUBBLE_CHAT_ID, SALES_PILOT_DOM_CONTAINER_ID, SALES_PILOT_PROFILE_BUTTON_ANCHOR_SELECTOR, SALES_PILOT_PROFILE_BUTTON_ID, SALES_PILOT_SCRIPT_ID, SALES_PILOT_SIDEBAR_ACTIVE_CLASS, SALES_PILOT_SIDEBAR_ID } from "./constants"
import { isALinkedinProfileUrl } from "./helpers"
import SalesPilotIcon from "./assets/icon/16.png"

export function toggleSidebar() {
    const sidebar = document.querySelector(`#${SALES_PILOT_SIDEBAR_ID}`)
    //@ts-ignore
    sidebar.classList.toggle(SALES_PILOT_SIDEBAR_ACTIVE_CLASS)
}

function loadSidebar() {
    if (document.querySelector(`#${SALES_PILOT_SCRIPT_ID}`)) return
    const loadSidebarScript = document.createElement('script')
    loadSidebarScript.setAttribute('id', SALES_PILOT_SCRIPT_ID)
    //@ts-ignore
    loadSidebarScript.setAttribute('src', chrome.runtime.getURL('/react/js/main.js'))
    loadSidebarScript.setAttribute('type', 'module')
    document.body.appendChild(loadSidebarScript)
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
    if (document.querySelector(`#${SALES_PILOT_DOM_CONTAINER_ID}`)) return
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

function createProfileButton() {
    const button = document.createElement('button')

    button.innerHTML = 'Generar mensaje'
    button.id = SALES_PILOT_PROFILE_BUTTON_ID
    button.addEventListener('click', () => {
        toggleSidebar()
    })

    return button
}

function addSalesPilotButtonToProfile() {
    if (document.querySelector(`#${SALES_PILOT_PROFILE_BUTTON_ID}`)) return
    const anchor = document.querySelector(SALES_PILOT_PROFILE_BUTTON_ANCHOR_SELECTOR)
    if (!anchor) return
    const button = createProfileButton()
    button.className = anchor.querySelector("button")?.className ?? ""
    button.className = `${button.className} sales-pilot-button`
    const linkedinIcon = anchor.querySelector("li-icon")?.cloneNode(true)
    if (linkedinIcon) {
        button.insertBefore(linkedinIcon, button.firstChild)
        linkedinIcon?.removeChild(linkedinIcon.firstChild!)
        const iconcito = document.createElement("img")
        iconcito.id = "iconcito"
        iconcito.setAttribute("src", SalesPilotIcon)
        linkedinIcon?.appendChild(iconcito)
    }

    anchor.appendChild(button)

}

function handleBubbleChatClick() {
    // Get profile URL
    // Get avatar from chat
    // Get name from chat
    // Get position from chat
}

function addSalesPilotButtonToBubbleChat() {
    const mutationObserver = new MutationObserver((mutations) => {
        document.querySelectorAll('.msg-form__left-actions.display-flex').forEach((element) => {
            const bubbleChatActionsContainer = element
            if (element.querySelector('#sales-pilot-chat-button')) return
            const button = document.createElement('button')
            if (!button) {
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

    const body = document.querySelector('body')
    if (body) {
        const mutationObserver = new MutationObserver((mutations) => {
            addDOMContainer()
            loadSidebar()
            addSalesPilotButtonToProfile()
            //         addSalesPilotButtonToBubbleChat()
        })

        //@ts-ignore
        mutationObserver.observe(body, { childList: true, subtree: true })
    }
    else {
        setTimeout(initializeExtension, 100)
    }
}



export { initializeExtension }