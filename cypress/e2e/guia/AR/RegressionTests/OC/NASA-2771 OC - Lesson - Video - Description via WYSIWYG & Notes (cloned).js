import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddVideoLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import { lessonVideo, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-103- C888 - NASA-2771: Online Course - Lesson - Video - Description via WYSIWYG & Notes (cloned)', () => {

    it('Create an Online course with a Video lesson and verify WYSIWYG editor and Notes field', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        // Create an active Online course
        cy.createCourse('Online Course', ocDetails.courseName)
        // Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoName)

        // Verify that WSYWIG editor is functional
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).type(lessonVideo.ocVideoDescription)
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).type('{selectall}')
        cy.get(ARAddVideoLessonModal.getRichTextUnderlineBtn()).click()

        // Verify that the Notes field is just a textarea
        cy.get(ARAddVideoLessonModal.getNotesTxtF()).should('have.prop', 'tagName' ).should('eq', 'TEXTAREA')
    })
})