import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { commonDetails, courseEvalQuestions } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import arILCSessionReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'
import arIlcMarkUserInActivePage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseEvaluationModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseEvaluation.modal'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'

describe('C944 - GUIA-Plan - NASA - 2171 - An Administrator can enable Course Evaluations for an ILC (cloned)', function () {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0) //Create a Learner
    })
    
    after('Delete the Course as part of clean-up', () => {
        let i = 0
        for(; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }

        // Delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click({force: true})  
        LEDashboardPage.getMediumWait()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force: true})
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Turn on Course Evaluation, Enable Taken Anytime and verify questions order', () => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led', ilcDetails.courseName)
        // Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARILCAddEditPage.getLongWait()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        
        // Add attributes
        cy.get(ARCourseSettingsAttributesModule.getEnableCourseEvaluationlToggle() + " " + AROCAddEditPage.getToggleDisabled()).click()
        ARILCAddEditPage.getShortWait()

        //Verify Evaluation Required can be enabled
        cy.get(ARCourseSettingsAttributesModule.getEvaluationRequiredToggle() + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        ARILCAddEditPage.getShortWait()

        // Verify Evaluation can be taken at anytime can be enabled
        cy.get(ARCourseSettingsAttributesModule.getAllowEvaluationAnyTimeToggle() + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        ARILCAddEditPage.getShortWait()

        // Verify default questions are all present and in correct order
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })

        // Verify adding a new question
        cy.get(ARCourseSettingsAttributesModule.getAddEvalQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionNumber()).its('length').then((length) => {
            cy.get(ARCourseSettingsAttributesModule.getQuestionNumber()).eq(length - 1).parents(ARCourseSettingsAttributesModule.getQuestionContainer()).within(() => {
                cy.get(ARCourseSettingsAttributesModule.getQuestionTxtF()).type(courseEvalQuestions.newQuestion2)
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDown()).click()
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDownOpt()).contains('Rating').click()
                cy.get(AROCAddEditPage.getCheckMarkBtn()).click()
            })
        })

        // Verify default questions are all present and in correct order  2
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })

        // Verify questions can be re-ordered - using key commands instead of drag and drop (WCAG)
        cy.get(ARCourseSettingsAttributesModule.getQuestionsContainer()).within(() => {
            //Move first question down one
            cy.get(AROCAddEditPage.getGripBtn()).eq(0).focus().type(' ').type('{downarrow}').type(' ')
            // Move last question up one
            cy.get(AROCAddEditPage.getGripBtn()).its('length').then((length) => {
            cy.get(AROCAddEditPage.getGripBtn()).eq(length - 1).focus().type(' ').type('{uparrow}').type(' ')
            })
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
        

        arDashboardPage.getMediumWait()
        // Navigate to Course page
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName("Courses"))
        arDashboardPage.getMediumWait()

        // Search the newly craeted course
        arDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        // Select the course that is found from the filter
        cy.get(arDashboardPage.getTableCellName(2)).contains(ilcDetails.courseName).click()

        arDashboardPage.getShortWait()
        // Click on Enroll User
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        arDashboardPage.getMediumWait()
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).eq(0).click()
        // Search a user to enroll
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(userDetails.username)
        AREnrollUsersPage.getEnrollUsersOpt(userDetails.username)
        arDashboardPage.getShortWait()
        // Save changes
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        arDashboardPage.getMediumWait()
    })

    it('Verify that the learner can start evaluate', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Open filter panel
        // Seach course name in catalog
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LECatalogPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName)
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

    it('Create an ILC course with evaluation enabled/required, turning off the Taken Anytime', () => {
        // Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led', ilcDetails.courseName2, false)

        // Add a session
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
        ARILCAddEditPage.getShortWait()

        // Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARILCAddEditPage.getLongWait()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()

        // Add attributes
        cy.get(ARCourseSettingsAttributesModule.getEnableCourseEvaluationlToggle() + " " + AROCAddEditPage.getToggleDisabled()).click()
        ARILCAddEditPage.getShortWait()

        //Verify Evaluation Required can be enabled
        cy.get(ARCourseSettingsAttributesModule.getEvaluationRequiredToggle() + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        ARILCAddEditPage.getShortWait()

        // Add default questions for evaluation
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()   

        // Publish the course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Enroll a leaner to an ILC course with disabling evaluate anytime', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        arDashboardPage.getMediumWait()
        // Navigate to Course page
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName("Courses"))
        arDashboardPage.getMediumWait()

        // Search the newly craeted course
        arDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName2)
        arDashboardPage.getMediumWait()
        // Select the course that is found from the filter
        cy.get(arDashboardPage.getTableCellName(2)).contains(ilcDetails.courseName2).click()
        arDashboardPage.getShortWait()

        // Click on Enroll User
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        arDashboardPage.getMediumWait()
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).eq(0).click()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(userDetails.username)
        AREnrollUsersPage.getEnrollUsersOpt(userDetails.username)
        arDashboardPage.getShortWait()
        // Save changes
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        arDashboardPage.getMediumWait()
    })

    it('Verify that the learner is unable to evaluate the course before course completion (attendance)', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Open filter panel
        // Seach course name in catalog
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName2)
        LECatalogPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName2)
        LECatalogPage.getMediumWait()

        // Assert the Evaluate Course button is disabled
        cy.get(LECoursesPage.getEvaluateCourseBtn()).within(() => {
            cy.get('button').should('have.attr', 'aria-disabled', 'true')
        })
    })

    it('Mark attendance for the new learner in the new ILC course so that the learner can start evaluation', () => {
        // Sign into admin side as sys admin, navigate to ILC Session page under Reports left menu
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        arDashboardPage.getMediumWait()
        arDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName2)

        arDashboardPage.getMediumWait()
        arDashboardPage.selectA5TableCellRecord(ilcDetails.courseName2)

        // Enroll user
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Enroll Users')
        cy.get(arILCSessionReportPage.getEnrollUserIdInput()).click()
        cy.get(arILCSessionReportPage.getUserIdContainer()).within(() => {
            cy.get(arILCSessionReportPage.getUserNameInput()).type(userDetails.username, {force: true})
        })
        arILCSessionReportPage.getMediumWait()
        cy.get(arILCSessionReportPage.getSelectedUserLabel()).contains(userDetails.username).click({force: true})
        arILCSessionReportPage.getMediumWait()

        cy.get(arILCSessionReportPage.getEnrollUserBtn()).click()
        arILCSessionReportPage.getMediumWait()

        // Select Mark Attendance Button for Course Completion 
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        arILCSessionReportPage.getMediumWait()
        cy.get(arIlcMarkUserInActivePage.getOverallGradeStatusToggle()).click()
        arILCSessionReportPage.getShortWait()

        cy.get(arILCSessionReportPage.getSaveBtn()).click()
    })  
    
    it('Verify that the learner now evaluate the evaluate course to complete', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Open filter panel
        // Seach course name in catalog
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName2)
        LECatalogPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName2)
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
        LECourseEvaluationModal.getFeedbackMsg()
        
        // Close modal
        cy.get(LECourseEvaluationModal.getCloseBtn()).click()
        LECatalogPage.getMediumWait()

        // Assert that the the ILC Course is Completed
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')
    })
})

