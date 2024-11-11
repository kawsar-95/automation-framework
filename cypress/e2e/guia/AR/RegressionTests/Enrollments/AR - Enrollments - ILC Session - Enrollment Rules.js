import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import arEditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LESelectILCSessionModal from '../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - ILC - ILC Session - Enrollment Rules', function() {
    
    after(function () {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create ILC course with various ILC Sessions', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        

        //Create ILC & add sessions
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        
        //Add sessions
        for(let i = 0; i < sessions.sessionNames.length; i++) {
            arILCAddEditPage.getAddSession(sessions.sessionNames[i], arILCAddEditPage.getFutureDate(i+2))
            //Set enrollment rules
            cy.get(arCoursesPage.getElementByAriaLabelAttribute(arILCAddEditPage.getExpandEnrollmentRulesBtn())).click()

            switch (sessions.sessionNames[i]) {
                case sessions.sessionName_1:
                    cy.get(arILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
                    break;
                case sessions.sessionName_2:
                    cy.get(arILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('Specific').click()
                    arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Session', 'Job Title', 'Contains', 'GUIA', null)
                    arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Session', 0, 'Date Hired', 'After', '2019-01-01', null)
                    arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Session', 0, 'GUIA Decimal Custom Field', 'Less Than', '0', null)
                    cy.get(arCourseSettingsEnrollmentRulesModule.getCountBanner())
                        .should('contain', `This session will be available for ${sessions.numLearnersSession} learners to self-enroll in.`)
                    break;
                case sessions.sessionName_3:
                    cy.get(arILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('Specific').click()
                    arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Session', 'Job Title', 'Contains', 'GUIA', null)
                    arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Session', 0, 'Date Hired', 'After', '2019-01-01', null)
                    arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Session', 0, 'GUIA Number Custom Field', 'Equals', '0', null)
                    cy.get(arCourseSettingsEnrollmentRulesModule.getCountBanner())
                        .should('contain', `This session will be available for ${sessions.numLearnersSession} learners to self-enroll in.`)
                    break;
                default:
                    console.log(`Sorry, ${sessions.sessionNames[i]} does not exist.`);
            }
            //Save ILC Session
            cy.get(arILCAddEditPage.getAddEditSessionSaveBtn()).click()
            arILCAddEditPage.getLShortWait()
        }

        //Set course enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        cy.wrap(arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific'))
        
        arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Contains', 'GUIA', null)
    
        cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner()).should('be.visible')
        
        //Publish course and verify modal
        cy.get(arILCAddEditPage.getPublishBtn()).click()
        arPublishModal.getPublishModalTileValue('Available Users', ilcDetails.numLearners, `Based on the self enrollment rules, this course will be available to ${ilcDetails.numLearners} users.`)
        cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
        cy.intercept('POST', '/api/rest/v2/admin/published-course-drafts').as('getPublish')   
        cy.get(arPublishModal.getContinueBtn()).click()
        arDashboardPage.getShortWait()
        cy.intercept('DELETE', '/api/rest/v2/admin/course-drafts/**').as(`getUrl`)
        cy.wait(`@getUrl`).then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    }) 

    it('Verify ILC is unavailable to learner who does not match any of the self enrollment rules', function() {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it(`Verify only the ALL LEARNERS session is available to learner GUIAutoL03`, function() {
        cy.apiLoginWithSession(users.learner03.learner_03_username, users.learner03.learner_03_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        arCoursesPage.getVShortWait()
        //get length of sessions to make sure only one session displays
        cy.get(LESelectILCSessionModal.getModalSessionsContainer()).should('have.length', 1)
        LESelectILCSessionModal.getSessionByNameAndAddToCart(sessions.sessionNames[0])
        arCoursesPage.getLShortWait()
    })
    
    it(`Verify ALL LEARNERS and Session2 sessions are available to learner GUIAL02`, function() {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        arCoursesPage.getVShortWait()
        //get length of sessions to make sure only one session displays
        cy.get(LESelectILCSessionModal.getModalSessionsContainer()).should('have.length', 2)
        LESelectILCSessionModal.getSessionByNameAndAddToCart(sessions.sessionNames[1])
        arCoursesPage.getLShortWait()
    })
    
    it(`Verify ALL LEARNERS and Session3 sessions are available to learner GUIAL01`, function() {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        arCoursesPage.getVShortWait()
        //get length of sessions to make sure only one session displays
        cy.get(LESelectILCSessionModal.getModalSessionsContainer()).should('have.length', 2)
        LESelectILCSessionModal.getSessionByNameAndAddToCart(sessions.sessionNames[2])
        arCoursesPage.getLShortWait()
    })

    it('Verify learners are enrolled in sessions where they match the enrollment rules', function() {
        const enrolledLearners = [users.learner01.learner_01_username, users.learner02.learner_02_username, users.learner03.learner_03_username]
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCourseEnrollmentReport()
        arCoursesPage.EnrollmentPageFilter(ilcDetails.courseName)
        cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
        arCoursesPage.getShortWait()
        arCoursesPage.getMediumWait()
        cy.get(arCoursesPage.getGridTable()).should('have.length', 3)
        cy.get(arCoursesPage.getFooterCount()).contains(`1 - 3 of 3 items`).should('exist')
        
        for (let i = 0; i < enrolledLearners.length; i++) {  
            arCoursesPage.getMediumWait()  
            cy.get(arCoursesPage.getTableCellRecord()).contains(enrolledLearners[i]).parent().within(() => {
                cy.get('td').eq(5).should('have.text', '0')
                cy.get('td').eq(6).should('have.text', 'Not Started')
                cy.get('td').eq(7).should('have.text', 'Yes')
            }).click()
            arCoursesPage.getShortWait()
            cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()

            switch (enrolledLearners[i]) {
                case users.learner01.learner_01_username:
                    cy.get(arEditActivityPage.getEditILCSessionEnrollmentDDown()).should('contain', sessions.sessionNames[2])
                    break;
                case users.learner02.learner_02_username:
                    cy.get(arEditActivityPage.getEditILCSessionEnrollmentDDown()).should('contain', sessions.sessionNames[1])
                    break;
                case users.learner03.learner_03_username:
                    cy.get(arEditActivityPage.getEditILCSessionEnrollmentDDown()).should('contain', sessions.sessionNames[0])

                    break;
                default:
                    console.log(`Sorry, ${enrolledLearners[i]} does not exist.`);
            }
            cy.wrap(arEditActivityPage.WaitForElementStateToChange(arEditActivityPage.getSaveBtn(), arEditActivityPage.getShortWait()))
            cy.get(arEditActivityPage.getCancelBtn()).click()
            arCoursesPage.getShortWait()
            //Deslect the last selected learner
            cy.get(arCoursesPage.getTableCellRecord()).contains(enrolledLearners[i]).click()
        }
    })
})