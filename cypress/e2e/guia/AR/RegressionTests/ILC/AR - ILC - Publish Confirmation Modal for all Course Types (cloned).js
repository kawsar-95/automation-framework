import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'

describe('C990 AUT-191, AR - ILC - Publish Confirmation Modal for all Course Types (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create Instructor Led Course', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        // Publish Course
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getPublishBtn(), 700))
        cy.get(ARPublishModal.getPublishBtn()).click()

        // verify The Publish Modal pops up
        cy.get(ARPublishModal.getPublishPoursePrompt()).should('be.visible')
        cy.get(ARPublishModal.getModalTitle()).should('contain', 'Publish')
        
        // verify Displays the number of users the course is available to
        ARPublishModal.getPublishModalTileValue('Available Users', 0, `Based on the self enrollment rules, this course will be available to 0 users.`)

        // verify Displays course status
        ARPublishModal.getPublishModalTileValue('Status', 'Active', `This course is set to Active. This course will be available to users.`)

        ARPublishModal.clickContinueBtnAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Course successfully published')
    })

    it('Edit Instructor Led Course', () => {
        cy.editCourse(ilcDetails.courseName)
        
        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        //Set enrollment rules
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Username', 'Contains', users.learner02.learner_02_username, null) 

        // Publish Course
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getPublishBtn(), 700))
        cy.get(ARPublishModal.getPublishBtn()).click()

        // verify The Publish Modal pops up
        cy.get(ARPublishModal.getPublishPoursePrompt()).should('be.visible')
        cy.get(ARPublishModal.getModalTitle()).should('contain', 'Publish')

        // verify Displays the number of users the course is available to
        ARPublishModal.getPublishModalTileValue('Available Users', 1, `Based on the self enrollment rules, this course will be available to 1 users.`)

        // verify Displays course status
        ARPublishModal.getPublishModalTileValue('Status', 'Active', `This course is set to Active. This course will be available to users.`)

        ARPublishModal.clickContinueBtnAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Course successfully published')
    })
})