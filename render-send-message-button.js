function toggleSidebar() {
    const sidebar = document.querySelector('#sales-pilot-sidebar')
    console.log('Sidebar element: ', sidebar)
    sidebar.classList.toggle('sales-pilot-sidebar-active')
}

function loadSidebar() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', chrome.runtime.getURL('/sidebar/index.html'), true)

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var htmlString = xhr.responseText
            var newElement = document.createElement('div')
            newElement.innerHTML = htmlString
            document.body.appendChild(newElement.firstChild)
            toggleSidebar()
        }
    }
    xhr.send()
}

function loadSidebarStyles() {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = chrome.runtime.getURL('/sidebar/sidebar.css')
    document.head.appendChild(link)
}

document.addEventListener('readystatechange', (e) => {
    if (e.target.readyState !== 'complete') return
    console.log(e.target.readyState)
    setTimeout(() => {
        loadSidebarStyles()

        const anchor = document.querySelector('div.pvs-profile-actions:not(.pvs-profile-actions--rtl.mr2)')
        console.log('Anchor: ', anchor)
        const button = document.createElement('button')
        button.innerHTML = 'Send Message'
        button.id = 'sales-pilot-button'
        button.addEventListener('click', () => {
            if (!document.querySelector('#sales-pilot-sidebar')) {
                loadSidebar()
            } else {
                toggleSidebar()
            }
        })

        const linkButton = document.createElement('a')
        linkButton.innerHTML = 'Open chat'
        linkButton.id = 'sales-pilot-link-button'
        linkButton.href = document
            .querySelector('a.message-anywhere-button.pvs-profile-actions__action.artdeco-button')
            .getAttribute('href')
        linkButton.setAttribute('role', 'button')
        anchor.appendChild(button)
        anchor.appendChild(linkButton)
    }, 3000)
})

{
    /* <div tabindex="-1" class="msg-overlay-list-bubble
    msg-overlay-list-bubble--is-minimized // Sacar clase is--minimized
    
    ml4">
  <header class="msg-overlay-bubble-header">
    <div class="msg-overlay-bubble-header__badge-container
        "></div>
    <!---->
    <div class="msg-overlay-bubble-header__details flex-row align-items-center ml1">
      <div class="presence-entity presence-entity--size-1">
  <img src="https://media.licdn.com/dms/image/C4D03AQHXffjU59nJrg/profile-displayphoto-shrink_100_100/0/1647955630725?e=1682553600&amp;v=beta&amp;t=egL4PTMwQJobUdPy7bIyROlAIIDK1tq7_ra2g7mMb_I" loading="lazy" alt="Alejo Scotti" id="ember203" class="presence-entity__image EntityPhoto-circle-1  lazy-image ember-view">

    
<div class="presence-entity__indicator presence-entity__indicator--size-1
         presence-indicator
    presence-indicator--is-online
    presence-indicator--size-1">
  <span class="visually-hidden">
      Estado: con conexión
  </span>
</div>
</div>
      <button class="msg-overlay-bubble-header__button truncate ml2" type="button">
        <span class="truncate t-14 t-bold
            t-black">
          <span aria-hidden="true">
            Mensajes
          </span>
          <span class="visually-hidden">
            Estás en la superposición de mensajería. Pulsa Intro para abrir la lista de conversaciones.
          </span>
        </span>
      </button>

<!----><!---->    </div>
    <div class="msg-overlay-bubble-header__controls display-flex">
      <div id="ember204" class="artdeco-dropdown artdeco-dropdown--placement-top artdeco-dropdown--justification-right ember-view">
        <button aria-expanded="false" id="ember205" class="artdeco-button artdeco-button--1 artdeco-button--circle artdeco-button--muted artdeco-button--tertiary artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-top ember-view" type="button" tabindex="0">
          <svg role="img" aria-hidden="false" aria-label="Abrir menú despegable de la mensajería" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" data-supported-dps="16x16" data-test-icon="overflow-web-ios-small" class="">
<!---->    

    <use href="#overflow-web-ios-small" width="16" height="16"></use>
</svg>

        
<!----></button>
        <div class="msg-overlay-bubble-header__dropdown-container">
          <div tabindex="-1" aria-hidden="true" id="ember206" class="artdeco-dropdown__content artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--has-arrow artdeco-dropdown__content--arrow-right artdeco-dropdown__content--justification-right artdeco-dropdown__content--placement-top ember-view"><!----></div>
        </div>
      </div>

      <button id="ember207" class="msg-overlay-bubble-header__control msg-overlay-bubble-header__control--new-convo-btn artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view">  <li-icon aria-hidden="true" type="compose-icon" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M15 2.53a1.51 1.51 0 01-.44 1L9.15 9 6 10l1-3.12 5.44-5.44A1.5 1.5 0 0115 2.53zM12 11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h3V2H5a3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3V8h-2z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Redactar mensaje
</span></button>

      <button id="ember208" class="msg-overlay-bubble-header__control msg-overlay-bubble-header__control--new-convo-btn artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view">  <li-icon aria-hidden="true" type="chevron-up" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M15 11L8 6.39 1 11V8.61L8 4l7 4.61z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Estás en la superposición de mensajería. Pulsa Intro para abrir la lista de conversaciones.
</span></button>
    </div>
  </header>
<!---->
<!----><!----></div> */
}

// BUBBLE CHAT

{
    /* <div id="ember874" data-feedback-redacted="" tabindex="-1" class="msg-convo-wrapper msg-overlay-conversation-bubble msg-overlay-conversation-bubble--default-inactive ml4
    
    msg-overlay-conversation-bubble--is-active
    
    msg-overlay-conversation-bubble--petite" role="dialog" aria-label="Mensajes">
  <div></div>

  <header class="msg-overlay-bubble-header msg-overlay-conversation-bubble-header justify-space-between
    " tabindex="-1">
  <div class="msg-overlay-bubble-header__badge-container
      "></div>

  <div>
<!----></div>

    <div class="msg-overlay-conversation-bubble-header--fade-in
        display-flex align-items-center flex-grow-1 overflow-hidden">
      <div>
      <div class="presence-entity presence-entity--size-1">
  <img src="https://media.licdn.com/dms/image/C4E03AQG3rukrZHKZZg/profile-displayphoto-shrink_100_100/0/1633638486641?e=1682553600&amp;v=beta&amp;t=Uw3yzU3Ux96aQ9Re5632egbNTWUpzQ1wW7ilCm31LRk" loading="lazy" alt="Mariana Hohot" id="ember875" class="presence-entity__image EntityPhoto-circle-1  lazy-image ember-view">

    
<div class="presence-entity__indicator presence-entity__indicator--size-1
         presence-indicator
    presence-indicator--is-online
    presence-indicator--size-1">
  <span class="visually-hidden">
      Estado: con conexión
  </span>
</div>
</div>
</div>

      <div class="pl2 flex-grow-1 overflow-hidden">
        <h2 class="pl1 msg-overlay-bubble-header__title truncate t-14 t-bold
            t-black
            pr1" tabindex="-1">
              <a href="/in/ACoAADgAroQBJh1El3DFh-KvxRrTZDPJ34x28hU/" id="ember1114" class="ember-view">
                <span class="t-14 t-bold hoverable-link-text
                    t-black">
                  Mariana Hohot
                </span>
              </a>
                              </h2>

              <div class="pl1 truncate t-12 t-normal
                  t-black">
                Activo ahora
              </div>
              </div>
    </div>

  <div class="msg-overlay-bubble-header__controls display-flex align-items-center">
      

<div id="ember1115" class="artdeco-dropdown msg-thread-actions__dropdown artdeco-dropdown--placement-bottom artdeco-dropdown--justification-right ember-view">
  <button aria-expanded="false" id="ember1116" class="msg-thread-actions__control artdeco-button artdeco-button--circle artdeco-button--1 artdeco-button--muted artdeco-button--tertiary artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view" type="button" tabindex="0">
    <li-icon aria-hidden="true" type="ellipsis-horizontal-icon" class="artdeco-button__icon" size="small" color="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M3 9.5A1.5 1.5 0 114.5 8 1.5 1.5 0 013 9.5zM11.5 8A1.5 1.5 0 1013 6.5 1.5 1.5 0 0011.5 8zm-5 0A1.5 1.5 0 108 6.5 1.5 1.5 0 006.5 8z"></path>
</svg></li-icon>
    <span class="visually-hidden">
      Abre la lista de opciones en tu conversación con Alejo Scotti y Mariana Hohot
    </span>
  
<!----></button>
  <div class="msg-thread-actions__dropdown-container">
    <div tabindex="-1" aria-hidden="true" id="ember1117" class="msg-thread-actions__dropdown-options artdeco-dropdown__content artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--has-arrow artdeco-dropdown__content--arrow-right artdeco-dropdown__content--justification-right artdeco-dropdown__content--placement-bottom ember-view"><!----></div>
  </div>
</div>

<!---->

<div>
<!----></div>

<!---->

          
  <button aria-label="Crear videoconferencia" id="ember1118" class="msg-form__footer-action flex-shrink-zero artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view" type="button">  <li-icon aria-hidden="true" type="video-conference" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M1 5v6a2 2 0 002 2h8V3H3a2 2 0 00-2 2zm4 0h2v2h2v2H7v2H5V9H3V7h2zm10-1v8h-1.5l-1.5-.75v-6.5L13.5 4z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    
</span></button>



<!---->
    <button aria-expanded="false" id="ember1119" class="msg-overlay-bubble-header__control msg-overlay-conversation-bubble__expand-btn artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view">  <li-icon aria-hidden="true" type="maximize" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M8 6.59L6.59 8 3 4.41V7H1V1h6v2H4.41zM13 9v2.59L9.41 8 8 9.41 11.59 13H9v2h6V9z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Expande la conversación con Alejo y Mariana
</span></button>

  <button id="ember882" class="msg-overlay-bubble-header__control artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view">  <li-icon aria-hidden="true" type="close" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M14 3.41L9.41 8 14 12.59 12.59 14 8 9.41 3.41 14 2 12.59 6.59 8 2 3.41 3.41 2 8 6.59 12.59 2z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Cierra tu conversación con Alejo Scotti y Mariana Hohot
</span></button>
</div>

</header>
  <div class="msg-overlay-conversation-bubble__content-wrapper relative display-flex flex-column
      ">
        
  <div>
<!----></div>

<!---->
  <div>
  <div class="msg-thread-container msg-thread__thread-actions-tray">
<!---->
<!---->
<!----></div>

<!---->
<!---->
</div>

  
<div class="msg-s-message-list-container relative display-flex mbA
    msg-s-message-list-container--column-reversed
    ">
  
    
<div class="msg-s-message-list
    full-width scrollable">
  <ul class="msg-s-message-list-content list-style-none full-width mbA">
    <li class="msg-s-message-list__top-of-list"></li>

<!---->      <li>
          <div class="msg-s-profile-card msg-s-profile-card-one-to-one ph3">
  <div id="ember936" class="break-words artdeco-entity-lockup artdeco-entity-lockup--size-4 ember-view">
      <a tabindex="0" href="https://www.linkedin.com/in/ACoAADgAroQBJh1El3DFh-KvxRrTZDPJ34x28hU" id="ember937" class="ember-view">
        <div id="ember938" class="artdeco-entity-lockup__image artdeco-entity-lockup__image--type-circle ember-view" type="circle">
            <div class="presence-entity presence-entity--size-4 msg-conversation-card__presence-entity">
  <img src="https://media.licdn.com/dms/image/C4E03AQG3rukrZHKZZg/profile-displayphoto-shrink_100_100/0/1633638486641?e=1682553600&amp;v=beta&amp;t=Uw3yzU3Ux96aQ9Re5632egbNTWUpzQ1wW7ilCm31LRk" loading="lazy" alt="Mariana Hohot" id="ember939" class="presence-entity__image EntityPhoto-circle-4  lazy-image ember-view">

    
<div class="presence-entity__indicator presence-entity__indicator--size-4
         presence-indicator
    presence-indicator--is-online
    presence-indicator--size-4">
  <span class="visually-hidden">
      Estado: con conexión
  </span>
</div>
</div>
        
</div>
      </a>
    <div id="ember940" class="artdeco-entity-lockup__content ember-view">
      <div id="ember941" class="artdeco-entity-lockup__title ember-view">
          <a class="app-aware-link  profile-card-one-to-one__profile-link" href="https://www.linkedin.com/in/ACoAADgAroQBJh1El3DFh-KvxRrTZDPJ34x28hU" data-test-app-aware-link="">
            Mariana Hohot
          </a>
      
</div>
        
<!---->
        <div id="ember1031" class="artdeco-entity-lockup__badge ember-view">    <span class="a11y-text">Contacto de 1er grado</span>
  <span class="artdeco-entity-lockup__degree" aria-hidden="true">
    ·&nbsp;1er
  </span>
<!----><!----></div>
      <div id="ember942" class="artdeco-entity-lockup__subtitle ember-view">
        <div title="Key Account Manager – QATestLab">
          Key Account Manager – QATestLab
        </div>
      </div>

<!---->    </div>
  
</div>
</div>
              </li>
    <li class="msg-s-message-list__loader hidden">
      <div id="ember884" class="artdeco-loader artdeco-loader--small ember-view"><!---->
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
<span class="artdeco-loader__bars"></span>
</div>
    </li>
      <li class="msg-s-message-list__event clearfix
          ">
          <time class="msg-s-message-list__time-heading t-12 t-black--light t-bold">
    viernes
  </time>

  <span class="msg-s-event-listitem--group-a11y-heading visually-hidden">
    Mariana Hohot ha enviado los siguientes mensajes a las 14:44
  </span>

<div class="msg-s-event-listitem
     msg-s-event-listitem--m2m-msg-followed-by-date-boundary
    
    
     msg-s-event-listitem--last-in-group
    
    
    
     msg-s-event-listitem--other
    
    " data-event-urn="urn:li:msg_message:(urn:li:fsd_profile:ACoAADB56tUB46-cNzJpxRtevKcD-soD9Ixh2ew,2-MTY3NjY0MTQ0MDkzOWI1ODc2OS0wMDQmY2YyYTAzNWMtNTMwOS00YWZhLTlkMDEtZjI3NGE0NTY2ZTMwXzAxMw==)">
            <a tabindex="0" href="https://www.linkedin.com/in/ACoAADgAroQBJh1El3DFh-KvxRrTZDPJ34x28hU" id="ember885" class="ember-view msg-s-event-listitem__link">
        <span class="a11y-text">
          Ver el perfil de Mariana
        </span>
          <img title="Mariana Hohot" src="https://media.licdn.com/dms/image/C4E03AQG3rukrZHKZZg/profile-displayphoto-shrink_100_100/0/1633638486641?e=1682553600&amp;v=beta&amp;t=Uw3yzU3Ux96aQ9Re5632egbNTWUpzQ1wW7ilCm31LRk" loading="lazy" alt="Mariana Hohot" id="ember886" class="msg-s-event-listitem__profile-picture EntityPhoto-circle-2 lazy-image ember-view">
      </a>

    
    <div class="msg-s-message-group__meta">
              <a class="app-aware-link " href="https://www.linkedin.com/in/ACoAADgAroQBJh1El3DFh-KvxRrTZDPJ34x28hU" data-test-app-aware-link="">
                  <span class="msg-s-message-group__profile-link msg-s-message-group__name t-14 t-black t-bold hoverable-link-text">
                      Mariana Hohot
                  </span>
              </a>
      
<!---->
        <time class="msg-s-message-group__timestamp white-space-nowrap t-12 t-black--light t-normal">
          14:44
        </time>
    </div>
    <!---->
<!---->
      <div class="msg-s-event-listitem__message-bubble msg-s-event-listitem__message-bubble--msg-fwd-enabled" tabindex="0">
<!---->
  
<!---->          
            <div class="msg-s-event-with-indicator display-flex ">
  <div class="msg-s-event__content" dir="ltr">
    
                <p class="msg-s-event-listitem__body t-14 t-black--light t-normal
                    ">Hello Alejo, 
I am from the team of QATestlab, a global testing services provider. It will be a pleasure to be a part of your network and be of service when needed. Thank you 🙂<!----></p>

            
  </div>
<!----></div>

<!---->        

      
</div>

<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->

  
          
<!---->    
        

<!----></div>

<!---->
      </li>
    <li class="msg-s-message-list__typing-indicator-container--without-seen-receipt">
<!---->    </li>

      <li class="msg-s-message-list__quick-replies-container">
        <div id="quick-replies-ember919" class="conversations-quick-replies justify-center display-flex align-items-center">
    <button disabled="" id="ember982" class="flex-shrink-zero mr2 artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary artdeco-button--disabled ember-view">  <li-icon aria-hidden="true" type="chevron-left" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="mercado-match" data-supported-dps="16x16" fill="currentColor" width="16" height="16" focusable="false">
  <path d="M11 1L6.39 8 11 15H8.61L4 8l4.61-7z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Desplaza las respuestas rápidas hacia la izquierda
</span></button>

  <ul class="conversations-quick-replies__container relative list-style-none display-flex justify-flex-start overflow-hidden pv2 conversations-quick-replies__container--animate-in">
      <li class="conversations-quick-replies__reply">
              <button id="ember920" class="conversations-quick-replies__reply-button artdeco-button artdeco-button--2 artdeco-button--secondary ember-view"><!---->
<span class="artdeco-button__text">
    
      <span class="a11y-text">Responder a la conversación con «Gracias, Mariana»</span>
      <span class="conversations-quick-replies__reply-content" aria-hidden="true">
            
              Gracias, Mariana
          

      </span>
    
</span></button>

              </li>
      <li class="conversations-quick-replies__reply">
              <button id="ember921" class="conversations-quick-replies__reply-button artdeco-button artdeco-button--2 artdeco-button--secondary ember-view"><!---->
<span class="artdeco-button__text">
    
      <span class="a11y-text">Responder a la conversación con «Aceptar»</span>
      <span class="conversations-quick-replies__reply-content" aria-hidden="true">
            
              Aceptar
          

      </span>
    
</span></button>

              </li>
      <li class="conversations-quick-replies__reply">
              <button id="ember922" class="conversations-quick-replies__reply-button artdeco-button artdeco-button--2 artdeco-button--secondary ember-view"><!---->
<span class="artdeco-button__text">
    
      <span class="a11y-text">Responder a la conversación con «👍»</span>
      <span class="conversations-quick-replies__reply-content" aria-hidden="true">
            
              👍
          

      </span>
    
</span></button>

              </li>
  </ul>

    <button id="ember983" class="flex-shrink-zero ml2 artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view">  <li-icon aria-hidden="true" type="chevron-right" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="mercado-match" data-supported-dps="16x16" fill="currentColor" width="16" height="16" focusable="false">
  <path d="M5 15l4.61-7L5 1h2.39L12 8l-4.61 7z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Desplaza las respuestas rápidas hacia la derecha
</span></button>
</div>
      </li>

    <li class="msg-s-message-list__bottom-of-list"></li>
  </ul>
</div>
<div id="ember887" class="ember-view"><!----></div>

<!---->  
</div>

<!---->
    <form id="msg-form-ember883" class=" msg-form">
    
<!---->
<!---->
        <div class="msg-form__attachment-drag-and-drop">
  <div class="msg-form__attachment-drag-and-drop-content display-flex flex-column align-items-center justify-center">
    <div class="msg-form__attachment-drag-and-drop-state-illustration"></div>
    <div class="msg-form__attachment-drag-and-drop-text display-flex flex-column align-items-center justify-center">
      <div class="msg-form__attachment-drag-and-drop-state-text t-16 t-bold">
        Arrastra tu archivo aquí.
      </div>
      <div class="msg-form__attachment-drag-and-drop-discoverability-text text-align-center">
        <div class="t-16 t-bold">
          Selecciona tu archivo
        </div>
        <div class="t-14">
          O arrástralo la próxima vez
        </div>
      </div>
    </div>
  </div>
</div>
          <div class="msg-form__attachment-previews overflow-auto scrollable">
<!----></div>
<!---->
<!---->
<!---->
      <div class="msg-form__msg-content-container
    
     msg-form__message-texteditor relative flex-grow-1 display-flex">
  <div class="msg-form__msg-content-container--scrollable scrollable relative">
    <div class="flex-grow-1">
  <div class="msg-form__contenteditable t-14 t-black--light t-normal flex-grow-1 full-height notranslate
      " contenteditable="true" role="textbox" aria-multiline="true" aria-label="Escribe un mensaje…"><p><br></p></div>

  <div aria-hidden="true" class="msg-form__placeholder
      t-14 t-black--light t-normal" data-placeholder="Escribe un mensaje…">
  </div>

</div>

      <div class="msg-form__expand-btn-wrapper">
          <button aria-expanded="false" id="ember888" class="msg-form__expand-btn artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view" type="button">  <li-icon aria-hidden="true" type="chevron-up" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M15 11L8 6.39 1 11V8.61L8 4l7 4.61z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Maximizar el campo de redacción
</span></button>
      </div>

<!---->
<!---->
<!---->  </div>
</div>
<!---->      <footer class="msg-form__footer flex-shrink-zero ">
        <div class="msg-form__left-actions display-flex">
            <div class="msg-form__upload-attachment inline-block" data-test-msg-ui-upload-attachment-presenter="">
  <input name="persist" value="true" type="hidden">
  <input name="upload_info" type="hidden">
  <input id="attachment-input-ember889" class="msg-form__attachment-upload-input hidden" accept="image/*" type="file">
  <button id="attachment-trigger-ember889" class="msg-form__footer-action artdeco-button artdeco-button--tertiary artdeco-button--circle artdeco-button--muted m0 artdeco-button--1" title="Adjunta una imagen a tu conversación con Mariana Hohot" aria-label="Adjunta una imagen a tu conversación con Mariana Hohot" type="button">
    <span class="visually-hidden">
      Adjunta una imagen a tu conversación con Mariana Hohot
    </span>
    <li-icon aria-hidden="true" type="image" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" width="16" height="16" focusable="false">
  <path d="M14 3H2a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM3 11l3-2.95L9 11H3zm10 0h-2.77L6.31 7.13a.44.44 0 00-.62 0L3 9.77V5h10v6zm-2.5-2A1.5 1.5 0 109 7.5 1.5 1.5 0 0010.5 9zm0-2.25a.75.75 0 11-.75.75.75.75 0 01.75-.75z"></path>
</svg></li-icon>
  </button>
</div>
            <div class="msg-form__upload-attachment inline-block" data-test-msg-ui-upload-attachment-presenter="">
  <input name="persist" value="true" type="hidden">
  <input name="upload_info" type="hidden">
  <input id="attachment-input-ember890" class="msg-form__attachment-upload-input hidden" accept="image/*,.ai,.psd,.pdf,.doc,.docx,.csv,.zip,.rar,.ppt,.pptx,.pps,.ppsx,.odt,.rtf,.xls,.xlsx,.txt,.pub,.html,.7z,.eml,.mov,.mp4" type="file">
  <button id="attachment-trigger-ember890" class="msg-form__footer-action artdeco-button artdeco-button--tertiary artdeco-button--circle artdeco-button--muted m0 artdeco-button--1" title="Adjunta un archivo a tu conversación con Mariana Hohot" aria-label="Adjunta un archivo a tu conversación con Mariana Hohot" type="button">
    <span class="visually-hidden">
      Adjunta un archivo a tu conversación con Mariana Hohot
    </span>
    <li-icon aria-hidden="true" type="attachment" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M15 5a4 4 0 01-1.17 2.83l-3.46 3.46A2.5 2.5 0 018.6 12a2.46 2.46 0 01-2.5-2.48 2.55 2.55 0 01.75-1.79L9.61 5 11 6.39 8.25 9.17a.49.49 0 00-.15.35.5.5 0 00.9.36l3.46-3.47a2 2 0 10-2.87-2.82l-6 6A2 2 0 005 13a2 2 0 001.42-.59l.18-.17L8 13.66l-.17.17a4 4 0 01-5.66-5.66l6-6A4 4 0 0115 5z"></path>
</svg></li-icon>
  </button>
</div>
              
                <div class="tenor-gif__button relative">
    <button title="Abrir el teclado de GIF" aria-label="Abrir el teclado de GIF" aria-expanded="false" id="ember901" class="msg-form__footer-action artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view" type="button">  <li-icon aria-hidden="true" type="gif" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" width="16" height="16" focusable="false">
  <path d="M9 12H7V4h2v8zM6 6V4H2a1 1 0 00-1 1v6a1 1 0 001 1h3a1 1 0 001-1V8H4v2H3V6h3zm9 0V4h-4a1 1 0 00-1 1v7h2V9h2V7h-2V6h3z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Abrir el teclado de GIF
</span></button>
</div>
            

<!---->
            
              <div>
  <span tabindex="-1" id="ember902" class="artdeco-hoverable-trigger artdeco-hoverable-trigger--content-placed-top ember-view">
    <button title="Abrir el teclado de emoji" aria-label="Abrir el teclado de emoji" aria-expanded="false" aria-controls="artdeco-hoverable-msg_overlay_emoji__emoji-hoverable__content" id="ember903" class="msg-form__footer-action emoji-hoverable-trigger artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view" type="button">  <li-icon aria-hidden="true" type="emoji-face-icon" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" width="16" height="16" focusable="false">
  <path d="M4.84 6A1.16 1.16 0 116 7.17 1.17 1.17 0 014.84 6zM8 9.38a3.51 3.51 0 01-2.3-.81l-.83 1.29a4.87 4.87 0 006.25 0l-.82-1.28a3.51 3.51 0 01-2.3.8zm2-4.55A1.17 1.17 0 1011.16 6 1.17 1.17 0 0010 4.83zM8 2.88A5.12 5.12 0 112.88 8 5.12 5.12 0 018 2.88M8 1a7 7 0 107 7 7 7 0 00-7-7z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Abrir el teclado de emoji
</span></button>
      
  </span>

    <div id="msg_overlay_emoji__emoji-hoverable__content" class="ember-view"><div id="ember905" class="ember-view"></div></div>
</div>
          

        <button class="vbot-button small"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF6WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDYtMTdUMTM6Mzg6NDQtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA2LTE3VDEzOjU5OjQzLTA0OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA2LTE3VDEzOjU5OjQzLTA0OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5ZjNkNjBkLTA0MWEtNDdlZS05NmUzLTMwNDgwNTY4Zjc3OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5OTlhYjQ2Zi05YTg0LTQ3ZTctOTc1ZS02ZDRiMWUzMjQ3M2YiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5OTlhYjQ2Zi05YTg0LTQ3ZTctOTc1ZS02ZDRiMWUzMjQ3M2YiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk5OWFiNDZmLTlhODQtNDdlNy05NzVlLTZkNGIxZTMyNDczZiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0xN1QxMzozODo0NC0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5ZjNkNjBkLTA0MWEtNDdlZS05NmUzLTMwNDgwNTY4Zjc3OSIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0xN1QxMzo1OTo0My0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+BJEHoQAACZxJREFUaIG9mn9wVNUVxz8v2SQEMGTzCxAhFFhAYBCIOoriTxrw0aL42nEqtpbSPh20LdXqUHBHaqymQ+uPVqfkDQgWpyM/Hmg7eco6UigITFFRiDRhicQkQMJvEsgPNtntH/du8vZlN9kNwfPP3Xffued+v+/ee+65564SCoUAUBSFeEXV9GRgLHDMMo2GuBt2teMGhgCHLdNoj7ddGDNAUi86nQRUAoeAelXTf52oDWlnGVAv7RxWNX1ib+wkTABYB+TL3/2A1ySpuEXV9GnAi0CKrBoFrOkF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"></button></div>
        <div class="msg-form__right-actions display-flex align-items-center">
          
<div>
    <button class="msg-form__send-button artdeco-button artdeco-button--1" disabled="" type="submit">
        Enviar
    </button>
</div>
          
<div class="ml2 relative">
  <span tabindex="-1" id="ember892" class="artdeco-hoverable-trigger artdeco-hoverable-trigger--content-placed-top ember-view">
    <button aria-expanded="false" aria-controls="artdeco-hoverable-artdeco-gen-44" id="ember893" class="msg-form__send-toggle artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view" data-test-msg-ui-send-mode-toggle-presenter__button="" type="button">  <li-icon aria-hidden="true" type="overflow-web-ios" class="artdeco-button__icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
  <path d="M3 9.5A1.5 1.5 0 114.5 8 1.5 1.5 0 013 9.5zM11.5 8A1.5 1.5 0 1013 6.5 1.5 1.5 0 0011.5 8zm-5 0A1.5 1.5 0 108 6.5 1.5 1.5 0 006.5 8z"></path>
</svg></li-icon>

<span class="artdeco-button__text">
    Abrir las opciones de envío
</span></button>
    <div id="artdeco-gen-44" class="ember-view"><div id="ember895" class="ember-view"></div></div>
  </span>
</div>
        </div>
      </footer>
      
<!---->
<div id="ember897" class="ember-view"><div id="ember898" class="ember-view"><!----></div></div>
    
</form>
  
<!---->
<!---->
<!---->

        </div>

  <div id="ember899" class="ember-view"><div id="ember900" class="ember-view"><!----></div></div>
</div> */
}
