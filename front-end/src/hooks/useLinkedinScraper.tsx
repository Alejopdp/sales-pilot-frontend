import React from 'react'
import {
    IMAGE_HTML_SOURCE_ATRIBUTE,
    LOCAL_ENV,
    PROFILE_AVATAR_CLASS_SELECTOR,
    PROFILE_NAME_CLASS_SELECTOR,
    PROFILE_POSITION_CLASS_SELECTOR,
} from '../constants'
import { ProfileExperience } from '../context/navigation'

const useLinkedinScraper = () => {
    const getProfileImageSrc = () => {
        if (process.env.NODE_ENV === LOCAL_ENV) return ''

        const avatarElement = document.querySelector(PROFILE_AVATAR_CLASS_SELECTOR)

        return avatarElement?.getAttribute(IMAGE_HTML_SOURCE_ATRIBUTE) ?? ''
    }

    const getPositon = () => {
        if (process.env.NODE_ENV === LOCAL_ENV) return ''

        const positionElement = document.querySelector(PROFILE_POSITION_CLASS_SELECTOR)

        return positionElement?.textContent ?? ''
    }

    const getName = () => {
        if (process.env.NODE_ENV === LOCAL_ENV) return ''

        const nameElement = document.querySelector(PROFILE_NAME_CLASS_SELECTOR)

        return nameElement?.textContent ?? ''
    }

    const getSimpleExperience = (liElement: any): ProfileExperience => {
        const jobTitle = liElement.querySelector('.t-bold').innerText
        const company = liElement.querySelector('.t-14.t-normal').innerText.split(' · ')[0]
        const modality = liElement.querySelector('.t-14.t-normal').innerText.split(' · ')[1]
        const dateRange = liElement.querySelectorAll('.t-14.t-normal.t-black--light')[0].innerText
        const time = liElement.querySelectorAll('.t-14.t-normal.t-black--light')[0].innerText
        const jobLocation = liElement.querySelectorAll('.t-14.t-normal.t-black--light')[1].innerText

        return {
            jobTitle,
            company,
            modality,
            dateRange,
            time,
            jobLocation,
        }
    }

    const getComplexExperience = (list: any, company: string): ProfileExperience[] => {
        // console.log("Complex element: ")
        const experiences: ProfileExperience[] = []
        const listElements = list.querySelectorAll('li')

        for (const liElement of listElements) {
            const jobTitle = liElement.querySelector('.t-bold').innerText
            const modality = liElement.querySelector('.t-14.t-normal').innerText.split(' · ')[1]
            const dateRange = liElement.querySelectorAll('.t-14.t-normal.t-black--light')[0].innerText
            const time = liElement.querySelectorAll('.t-14.t-normal.t-black--light')[0].innerText
            const jobLocation = liElement.querySelectorAll('.t-14.t-normal.t-black--light')[1].innerText

            experiences.push({
                jobTitle,
                company,
                modality,
                dateRange,
                time,
                jobLocation,
            })
        }

        return experiences
    }

    const getExperience = () => {
        let experiences: ProfileExperience[] = []
        const experienceDiv = document.querySelector('#experience')
        const exprienceSection = experienceDiv?.parentElement
        const experienceList = exprienceSection?.querySelector('ul.pvs-list')
        const liElements = experienceList?.querySelectorAll('.artdeco-list__item')
        if (!liElements || liElements === null || liElements.length === 0) return []
        console.log('List: ', liElements)
        for (const liElement of liElements) {
            if (liElement.querySelector('ul.pvs-list')) {
                const expriencesInCompany = getComplexExperience(
                    liElement.querySelector('ul.pvs-list'),
                    liElement.querySelector('.t-bold')?.textContent ?? ''
                )

                experiences = [...experiences, ...expriencesInCompany]
            } else {
                experiences.push(getSimpleExperience(liElement))
            }
        }

        console.log('Experiences: ', experiences)

        return experiences
    }

    return { getProfileImageSrc, getPositon, getName, getExperience }
}

export default useLinkedinScraper

// [{jobTitle: "Product Owner - Corporate Platform", company: "Novolabs", modality: "Jornada completa", dateRange: "nov. 2019 - actualidad", time: "3 años 5 meses", location: "Valencia y alrededores"}]
