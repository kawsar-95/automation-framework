import dayjs from 'dayjs'
import {  courseUploadSection } from '../../../../helpers/TestData/Courses/oc'
import LEBasePage from '../../LEBasePage'

export default new class LECourseDetailsCurrModule extends LEBasePage {

    getCurrGroupContainer() {
        return `[class*="curriculum-group-module__group_container"]`
    }
    
    getGroupName() {
        return `[class*="curriculum-group-module__title"]`
    }

    getGroupNotice() {
        return '[class*="curriculum-group__group_notice"]'
    }

    getLockedGroupIcon() {
        return '[class*="curriculum-group__lock_icon"]'
    }

    getCourseContainer() {
        return '[data-name="sortable-table"]'
    }

    getCourseName() {
        return `[class*="course-list-module__course_name__"]`
    }

    getCourseCount() {
        return '[class*="curriculum-group__course_count"]'
    }

    getCourseActionBtn() {
        return '[class*="action-button-module__btn"]'
    }

    getTableModuleRow() {
        return `[data-name="sortable-table"]`
    }

    getCurrCourseActionBtnThenClick(group, course, status) {
        cy.get(this.getGroupName()).contains(group).parents(this.getCurrGroupContainer()).within(() => {
            cy.get(this.getGroupName()).should('contain', group)
            cy.get(this.getCourseName()).contains(course).parents(this.getTableModuleRow()).within(()=>{
                cy.get(this.getCourseActionBtn()).contains(status, {timeout:10000}).click()
            })
        })
    }

    //Checks to verify that a group exists within the curriculum
    getGroupByName(name) {
        cy.get('[class*="curriculum-course-groups__groups"]').within(() => {
            cy.get('[class*="curriculum-group-module__header_content"]').contains(name).should('be.visible')
        })
    }

    getMustCompleteNotice() {
        return `[class="curriculum-group__group_notice"]`
    }

    getEnrollActionButton() {
        return '[class*="course-detail-header__container"] [aria-label*="Enroll"]'
    }

    getCourseExpiryDateMessage() {
        return '[class*="_course_expiry_date_message"]'
    }

    getCourseExpiryMessage() {
        return '[class*="_course_expiry_message"]'
    }

    getCourseExpiryDateContainer() {
        return '[class*="course-expiry-date__container"]'
    }

    verifyExpirationDate(date) {
        cy.get(this.getCourseExpiryDateMessage()).should('contain', dayjs(date).format('dddd')).and('contain', dayjs(date).format('MMMM'))
            .and('contain', dayjs(date).format('D')).and('contain', dayjs(date).format('YYYY'))
    }
}