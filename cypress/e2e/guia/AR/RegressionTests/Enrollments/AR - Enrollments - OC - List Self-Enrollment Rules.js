import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import arAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { lessonObjects, ocEnrollments } from '../../../../../../helpers/TestData/Courses/oc'

describe('AR - CED - OC - Self-Enrollment Rules - List Rules', function () {
    after(function () {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create an Online Courses with List Self Enrollment Rule', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        

        //Create course with basic object lesson
        cy.createCourse('Online Course', ocEnrollments.courseNameList)
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        arSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(arSelectLearningObjectModal.getNextBtn()).click()
        arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')

        //Set enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Group', null, 'GUIA_GROUP', null)
        arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'Username', 'Contains', 'GUIAutoL0', null)

        cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
            .should(`have.text`, `This course will be available for ${ocEnrollments.numLearnersList} learners to self-enroll in.`)

        //Verify publish modal and publish course
        cy.get(arOCAddEditPage.getPublishBtn()).click()
        arPublishModal.getPublishModalTileValue('Users Enrolled', '0', 'Based on the automatic enrollment rules, 0 users will be enrolled.')
        arPublishModal.getPublishModalTileValue('Available Users', ocEnrollments.numLearnersList, `Based on the self enrollment rules, this course will be available to ${ocEnrollments.numLearnersList} users.`)
        cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
        cy.intercept('POST', '/api/rest/v2/admin/published-course-drafts').as('getPublish')
        cy.intercept('DELETE', '/api/rest/v2/admin/course-drafts/**').as(`getUrl`)
        cy.get(arPublishModal.getContinueBtn()).click()
        cy.wait('@getPublish')
        arDashboardPage.getShortWait()
        cy.wait(`@getUrl`).then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    // This is to check that the course is unavailable to learners who does not have any value in the filter selected
    it('Verify course is unavailable to learner who does not belong in any group', function () {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameList)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it('Verify course is unavailable to learner who does not belong to the selected group in the enrollment rule', function () {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameList)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it('Verify course is available to learner who belong to the selected group in the enrollment rule', function () {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameList)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(ocEnrollments.courseNameList)
        arCoursesPage.getMediumWait()
    })

    it('Check learner is enrolled to course with Self Enrollment rules they match', function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        arCoursesPage.EnrollmentPageFilter(ocEnrollments.courseNameList)
        cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
        cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
        arCoursesPage.getLShortWait()
        cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersList)
        cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersList} of ${ocEnrollments.numLearnersList} items`).should('exist')

        cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner01.learner_01_username).parent().within(() => {
            cy.get('td').eq(5).should('have.text', '0')
            cy.get('td').eq(6).should('have.text', 'Not Started')
            cy.get('td').eq(7).should('have.text', 'Yes')
        })
    })
})