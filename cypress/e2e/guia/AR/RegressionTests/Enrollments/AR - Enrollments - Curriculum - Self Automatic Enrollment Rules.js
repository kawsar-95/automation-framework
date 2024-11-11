
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - Enrollments - Curriculum - Self Automatic Enrollment Rules', function() {
    
    after(() => {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Create Curriculum with Automatic and Enrollment Rules', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.createCourse('Curriculum')
        arSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.ilc_filter_01_name])
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        //Add self and automatic enrollment rules to the 
        arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Contains', 'GUIA', null) 
        arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'Group', null, 'GUIA_GROUP', null)
        //Verify self enrollment learner count
        cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
            .contains(`This course will be available for 1 learners to self-enroll in.`).should('exist')
        arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
        arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Contains', 'GUIA', null) 
        arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Auto', 0, 'GUIA Date Time Custom Field', 'After', '2018-04-13 11  58 pm', null)
        
        //Verify automatic enrollment learner count
        cy.get(arCourseSettingsEnrollmentRulesModule.getCountBanner())
            .should('contain', `1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.`)

        cy.get(ARCURRAddEditPage.getPublishBtn()).click()
        //Verify counts on the publish modal
        arPublishModal.getPublishModalTileValue('Users Enrolled', 1, `1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.`)
        arPublishModal.getPublishModalTileValue('Available Users', 1, `Based on the self enrollment rules, this course will be available to 1 users.`)
        cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
        cy.intercept('DELETE', '/api/rest/v2/admin/course-drafts/**').as(`getUrl`)
        cy.get(arPublishModal.getContinueBtn()).click()
        arDashboardPage.getShortWait()
        cy.wait(`@getUrl`).then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Verify curriculum is unavailable to learner who does not match self-enrollment rule', function() {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it('Verify curriculum is available to learner who matches self-enrollment rule', function() {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(currDetails.courseName)
        arCoursesPage.getMediumWait()
    })

    it('Verify Self and Automatic Enrollments', function() {
        let arrCourses = [currDetails.courseName, courses.oc_filter_01_name, courses.ilc_filter_01_name]
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCourseEnrollmentReport()

        //Verify that the learners who match the self/automatic enrollment rules are enrolled to the curriculum but not the child courses
        for(let i = 0; i < arrCourses.length; i++) {
            if(i === 0) {
                arCoursesPage.EnrollmentPageFilter(arrCourses[i])
                cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
                arCoursesPage.getShortWait()
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner01.learner_01_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })          
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner05.learner_05_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
                cy.get(arCoursesPage.getGridTable()).should('have.length', 2)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - 2 of 2 items`).should('exist')
            } else {
                cy.get(arCoursesPage.getEditFilterBtn()).contains('Course Equals').click()
                arCoursesPage.EnrollmentPageFilter(arrCourses[i])
                cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
                arCoursesPage.getShortWait()
                cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - 2 of 2 items`).should('not.exist')
            }
        }
    })
})