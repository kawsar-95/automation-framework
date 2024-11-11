import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

describe('C990 AUT-191, AR - CB - Publish Confirmation Modal for all Course Types (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Create Course Bundle', () => {
        cy.createCourse('Course Bundle')

        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])

        // Publish Course
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getPublishBtn(), 700))
        cy.get(ARPublishModal.getPublishBtn()).click()

        // verify The Publish Modal pops up
        cy.get(ARPublishModal.getPublishPoursePrompt()).should('be.visible')
        cy.get(ARPublishModal.getModalTitle()).should('contain', 'Publish')

        // verify Displays the number of users to be automatically enrolled
        ARPublishModal.getPublishModalTileValue('Users Enrolled', 0, 'Based on the automatic enrollment rules, 0 users will be enrolled.')
        
        // verify Displays the number of users the course is available to
        ARPublishModal.getPublishModalTileValue('Available Users', 0, `Based on the self enrollment rules, this course will be available to 0 users.`)

        // verify Displays course status
        ARPublishModal.getPublishModalTileValue('Status', 'Active', `This course is set to Active. This course will be available to users.`)

        ARPublishModal.clickContinueBtnAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Course successfully published')
    })

    it('Edit Course Bundle', () => {
        cy.editCourse(cbDetails.courseName)
        
        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        //Set enrollment rules
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Username', 'Equals', users.learner02.learner_02_username, null) 

        //Select Allow Automatic Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
        //Set enrollment rules
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Username', 'Equals', users.learner01.learner_01_username, null) 

        // Publish Course
        cy.wrap(ARPublishModal.WaitForElementStateToChange(ARPublishModal.getPublishBtn(), 700))
        cy.get(ARPublishModal.getPublishBtn()).click()

        // verify The Publish Modal pops up
        cy.get(ARPublishModal.getPublishPoursePrompt()).should('be.visible')
        cy.get(ARPublishModal.getModalTitle()).should('contain', 'Publish')

        // verify Displays the number of users to be automatically enrolled
        ARPublishModal.getPublishModalTileValue('Users Enrolled', 1, '1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.')
        
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

