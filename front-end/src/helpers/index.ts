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

// Función para scrapear DESTACADOS desde el perfil

function getActivityType(doc: any) {
    // Asumimos que hay diferentes selectores para cada tipo de actividad
    const postSelector = doc.querySelector('article.pv-post-entity artdeco-card');
    const shareSelector = doc.querySelector('div.feed-shared-update-v2');
    const documentSelector = doc.querySelector('div.feed-shared-update-v2');
    console.log("Post Selector: ", postSelector)
    console.log("Share selector: ", shareSelector)
    console.log("Document selector: ", documentSelector)


    if (postSelector) return 'Post';
    if (shareSelector) return 'Share';
    if (documentSelector) return 'Document';
    // Agrega otros selectores si es necesario para otros tipos de actividad
    return null;
}

function getShareContent(share: any) {
    const targetElement = share.querySelector('.feed-shared-update-v2__description .break-words span[dir="ltr"]');
    const desiredText = targetElement.innerHTML;

    console.log(desiredText);

    return desiredText
}

function getPostContent(post: any) {
    const targetElement = post.querySelector('.pv-post-entity__container h1');
    const desiredText = targetElement.innerText;

    console.log(desiredText);

    return desiredText
}


function extractActivityData(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const activityType = getActivityType(doc)

    const activity = {
        type: activityType,
        content: '',
        reactionsCount: 0,
        commentsCount: 0,
        relevance: 0
    };

    // Extract content
    if (activityType === 'Share') {
        activity.content = getShareContent(doc)
    }

    // Extract content
    if (activityType === 'Post') {
        activity.content = getPostContent(doc)
    }


    // Extract reactions
    const reactionsButton = doc.querySelector('.social-details-social-counts__reactions > button');
    if (reactionsButton) {
        const ariaLabel = reactionsButton.getAttribute('aria-label');
        const countMatch = ariaLabel?.match(/\d+/);
        activity.reactionsCount = countMatch ? parseInt(countMatch[0], 10) : 0;
    }

    // Extract comments
    const commentsButton = doc.querySelector('.social-details-social-counts__comments > button');
    if (commentsButton) {
        const ariaLabel = commentsButton.getAttribute('aria-label');
        const countMatch = ariaLabel?.match(/\d+/);
        activity.commentsCount = countMatch ? parseInt(countMatch[0], 10) : 0;
    }

    // Calculate relevance (ajusta la fórmula según tus necesidades)
    activity.relevance = activity.reactionsCount + activity.commentsCount;

    return activity;
}

// export async function fetchRecentActivity(profileUrl: string) {
//     const activityUrl = profileUrl + '/recent-activity/';
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto(activityUrl, {
//         waitUntil: 'networkidle0',
//     });

//     const content = await page.content();

//     await browser.close();


//     const response = await fetch(activityUrl);
//     // const htmlContent = await response.text();
//     const parser = new DOMParser();
//     const activityDoc = parser.parseFromString(content, 'text/html');
//     console.log("Activity doc: ", activityDoc)
//     //@ts-ignore
//     console.log("ChildreN: ", activityDoc.querySelectorAll('#profile-content > div > div.scaffold-layout.scaffold-layout--breakpoint-md.scaffold-layout--sidebar-main-aside.scaffold-layout--reflow > div > div > main > div > div.relative > div > div.scaffold-finite-scroll__content').children)
//     // Seleccionar las actividades en función de su clase
//     //@ts-ignore
//     const activitiesList = Array.from(activityDoc.querySelectorAll('#profile-content > div > div.scaffold-layout.scaffold-layout--breakpoint-md.scaffold-layout--sidebar-main-aside.scaffold-layout--reflow > div > div > main > div > div.relative > div > div.scaffold-finite-scroll__content').children);



//     return activitiesList.map((activity: any) => extractActivityData(activity.innerHTML));
// }
