import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import arAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { lessonObjects, ocEnrollments } from '../../../../../../helpers/TestData/Courses/oc'

describe('AR - CED - OC - List Automatic Enrollment Rules', function() {
    
    beforeEach(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        
    })

    after(function () {
        cy.deleteCourse(commonDetails.courseID)
    })

    it(`Create Online Course ${ocEnrollments.courseNameList}`, () =>{
        //Create course with basic object lesson
        cy.createCourse('Online Course', ocEnrollments.courseNameList)
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        arSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(arSelectLearningObjectModal.getNextBtn()).click()
        arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')

        //Set enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
        arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Group', null, 'GUIA_GROUP', null)
        arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Auto', 0, 'Username', 'Contains', 'GUIAutoL0', null)

        cy.get(arCourseSettingsEnrollmentRulesModule.getCountBanner())
            .contains(`${ocEnrollments.numLearnersList} users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with ${ocEnrollments.numLearnersList} receiving a new enrollment.`).should('exist')
    
        //Verify publish modal and publish course
        cy.get(arOCAddEditPage.getPublishBtn()).click()
        arPublishModal.getPublishModalTileValue('Users Enrolled', ocEnrollments.numLearnersList, `${ocEnrollments.numLearnersList} users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with ${ocEnrollments.numLearnersList} receiving a new enrollment.`)
        arPublishModal.getPublishModalTileValue('Available Users', '0', `Based on the self enrollment rules, this course will be available to 0 users.`)
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

    it('Verify learners who match the rules are automatically enrolled to correct courses', function() {
        arOCAddEditPage.getHFJobWait() //wait for enrollments to complete
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