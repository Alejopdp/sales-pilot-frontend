function toggleSidebar() {
    const sidebar = document.querySelector('#sales-pilot-sidebar')
    sidebar.classList.toggle('sales-pilot-sidebar-active')
}

function loadSidebar() {
  chrome.runtime.connect({name: "background"})
    const loadSidebarScript = document.createElement('script')
    loadSidebarScript.setAttribute('src', chrome.runtime.getURL('/react/js/main.js'))
    loadSidebarScript.setAttribute('type', 'module')
    document.body.appendChild(loadSidebarScript)
    setTimeout(() => {
        toggleSidebar()
        closeSidebarOnOutsideClick()
    }, 100) // TODO: Use an event
}

function loadSidebarStyles() {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = chrome.runtime.getURL('/sidebar/sidebar.css')
    document.head.appendChild(link)
}

function addDOMContainer() {
    const salesPilotDOMContainer = document.createElement('div')
    salesPilotDOMContainer.setAttribute('id', 'sales-pilot-dom-container')
    document.body.appendChild(salesPilotDOMContainer)
}

function loadOrToggleSidebar() {
    if (!document.querySelector('#sales-pilot-sidebar')) {
        loadSidebar()
    } else {
        toggleSidebar()
    }
}
function closeSidebarOnOutsideClick() {
    const sidebar = document.querySelector('#sales-pilot-sidebar')

    document.addEventListener('click', (e) => {
        const targetElement = e.target
        const isClickInside = sidebar.contains(targetElement)

        if (
            !isClickInside &&
            sidebar.classList.contains('sales-pilot-sidebar-active') &&
            targetElement.id !== 'sales-pilot-button' &&
            targetElement.id !== 'sales-pilot-chat-button' &&
            !document.querySelector('#msg-overlay').contains(targetElement)
        ) {
            toggleSidebar()
        }
    })
}

function addSalesPilotButtonToProfile() {
    const anchor = document.querySelector('div.pvs-profile-actions:not(.pvs-profile-actions--rtl.mr2)')
    const button = document.createElement('button')
    button.innerHTML = 'Send Message'
    button.id = 'sales-pilot-button'
    button.addEventListener('click', () => {
        loadOrToggleSidebar()
    })
    anchor.appendChild(button)
}

function addSalesPilotButtonToBubbleChat() {
    const mutationObserver = new MutationObserver((mutations) => {
        console.log('Mutation observed!')
        document.querySelectorAll('.msg-form__left-actions.display-flex').forEach((element) => {
            const bubbleChatActionsContainer = element
            if (element.querySelector('#sales-pilot-chat-button')) return
            const button = document.createElement('button')
            button.innerHTML = 'Send Message'
            button.id = 'sales-pilot-chat-button'
            button.addEventListener('click', () => {
                loadOrToggleSidebar()
            })
            bubbleChatActionsContainer.appendChild(button)
        })
    })
    mutationObserver.observe(document.querySelector('#msg-overlay'), { childList: true })
}

document.addEventListener('readystatechange', (e) => {
    if (e.target.readyState !== 'complete') return
    console.log(e.target.readyState)
    setTimeout(() => {
        addDOMContainer()
        loadSidebarStyles()
        addSalesPilotButtonToBubbleChat()
        addSalesPilotButtonToProfile()
    }, 3000)
})
