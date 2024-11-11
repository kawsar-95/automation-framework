import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { commonDetails, courseEvalQuestions } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseEvaluationModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseEvaluation.modal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARCourseEvaluationReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage'

describe('C7274 AUT-657, AR - Regression - Course Evaluation - View Evaluation Answer', function () {
    after(() => {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Turn on Course Evaluation, Enable Taken Anytime and verify questions order', () => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course')

        // Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        arDashboardPage.getShortWait()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        
        // Verify Evaluation Required can be enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEvalRequiredToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()

        // Verify Evaluation can be taken at anytime can be enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEvalAnyTimeToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        
        // Verify default questions are all present and in correct order
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()

        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })

        // publish the course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Enroll a leaner to newly created ILC course where learner can evaluate before course completion', () => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    
        // Search the newly craeted course
        arDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName)
        arDashboardPage.getMediumWait()
        // Select the course that is found from the filter
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getShortWait()
        // Click on Enroll User
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        arDashboardPage.getMediumWait()
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).eq(0).click()
        // Search a user to enroll
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(users.learner01.learner_01_username)
        AREnrollUsersPage.getEnrollUsersOpt(users.learner01.learner_01_username)
        arDashboardPage.getShortWait()
        // Save changes
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        arDashboardPage.getMediumWait()
    })

    it('Verify that the learner can start evaluate', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        // Seach course name in catalog
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LECatalogPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LECatalogPage.getMediumWait()

        // Start course evaluation
        cy.get(LECoursesPage.getEvaluateCourseBtn()).click()

        // Verify questions are in the correct order and that they can be answered
        // Answering 5 questions even do
        let maxAnswers = 5;
        cy.get(LECourseEvaluationModal.getQuestionName()).each(($span, i) => {
            if (i >= maxAnswers) return;    
            cy.get(LECourseEvaluationModal.getQuestionName()).eq(i).invoke('attr', 'class').then((type) => {
                // Answer questions
                if (type.includes('rating_question')) {
                    LECourseEvaluationModal.getRateQuestionByName(courseEvalQuestions.defaultQuestions[i], 5)
                }
            })
        })

        // Submit evaluation
        cy.get(LECourseEvaluationModal.getSubmitBtn()).click()
        LECourseEvaluationModal.getFeedbackMsg() //Verify closing message
        
        // Close modal
        cy.get(LECourseEvaluationModal.getCloseBtn()).click()
        LECatalogPage.getMediumWait()
    })
    
    it('Turn on Course Evaluation, Enable Taken Anytime and verify questions order', () => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Evaluations'))
        arDashboardPage.getShortWait()

        ARCourseEvaluationReportPage.coursePanelAddFilter(ocDetails.courseName)

        // Select any existing Questions
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(0).click()
        arDashboardPage.getShortWait()

        // Click on View Evaluation answer
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('View Evaluation Answers')
        arDashboardPage.getShortWait()

        // Select that answer
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(3)).contains(users.learner01.learner_01_fname).click()
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getA5PageHeaderTitle()).should('have.text', `${ocDetails.courseName} - Course Evaluation Answers`)

        // Click on View Evaluation learner feedback
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('View Evaluation Learner Feedback')
        arDashboardPage.getShortWait()
        	
        // Verify Course Evaluation Answers page should be displayed with Appropriate feedback
        cy.get(arDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Course Evaluation Answers')
    })
})