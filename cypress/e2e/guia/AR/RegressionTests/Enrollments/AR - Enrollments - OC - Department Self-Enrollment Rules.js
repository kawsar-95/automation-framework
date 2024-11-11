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

describe('AR - CED - OC - Department Self-Enrollment Rules', function () {

    //Test specific array
    let departmentCourses = [ocEnrollments.courseNameDeptOnly, ocEnrollments.courseNameDeptSub]

    after(function () {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    for (let i = 0; i < departmentCourses.length; i++) {
        it(`Create Online Course ${departmentCourses[i]}`, () => {
            let learnerCount;
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
            arDashboardPage.getMenuItemOptionByName('Courses')
            

            //Create course with basic object lesson
            cy.createCourse('Online Course', departmentCourses[i])
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            arSelectLearningObjectModal.getObjectTypeByName('Object')
            cy.get(arSelectLearningObjectModal.getNextBtn()).click()
            arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')

            //Set enrollment rules
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
            arCoursesPage.getShortWait()
            arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')

            if (departmentCourses[i].includes('DEPT-ONLY')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Department', 'Is Only', 'Enrollment Rule Dept', null)
                learnerCount = ocEnrollments.numLearnersDeptOnly
            } else {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Department', 'And Sub-Departments of', 'Enrollment Rule Dept', null)
                learnerCount = ocEnrollments.numLearnersDeptSub
            }

            cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
                .should(`have.text`,`This course will be available for ${learnerCount} learners to self-enroll in.`).and('exist')

            //Verify publish modal and publish course
            cy.get(arOCAddEditPage.getPublishBtn()).click()
            arPublishModal.getPublishModalTileValue('Users Enrolled', '0', 'Based on the automatic enrollment rules, 0 users will be enrolled.')
            arPublishModal.getPublishModalTileValue('Available Users', learnerCount, `Based on the self enrollment rules, this course will be available to ${learnerCount} users.`)
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
    }

    it('Verify courses are unavailable to learner who does not match any enrollment rules', function () {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameDept)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it('Verify courses are available to learner who match \'Is Only\' and \'And Sub-Departments Of\' Enrollment Rules', function () {
        cy.apiLoginWithSession(users.learner04.learner_04_username, users.learner04.learner_04_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameDept)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 2)
        LECatalogPage.getSpecificCourseCardBtnThenClick(departmentCourses[0])
        LECatalogPage.getSpecificCourseCardBtnThenClick(departmentCourses[1])
        arCoursesPage.getMediumWait()
    })

    it('Verify courses are available to learner who match \'And Sub-Departments Of\' Enrollment Rule', function () {
        cy.apiLoginWithSession(users.learner05.learner_05_username, users.learner05.learner_05_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameDept)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(departmentCourses[1])
        arCoursesPage.getMediumWait()
    })

    it('Check learners are enrolled to courses with Self Enrollment rules they match', function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        for (let i = 0; i < departmentCourses.length; i++) {
            arCoursesPage.EnrollmentPageFilter(departmentCourses[i])
            cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
            if (i == 0) {
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
            }
            arCoursesPage.getLShortWait()
            if (departmentCourses[i].includes('DEPT-ONLY')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersDeptOnly)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersDeptOnly} of ${ocEnrollments.numLearnersDeptOnly} items`).should('exist')

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner04.learner_04_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if (departmentCourses[i].includes('DEPT-SUB')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersDeptSub)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersDeptSub} of ${ocEnrollments.numLearnersDeptSub} items`).should('exist')

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner04.learner_04_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner05.learner_05_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            }
            if (i != departmentCourses.length) {
                cy.get(arCoursesPage.getEditFilterBtn()).contains(departmentCourses[i]).click()
            }
        }
    })
})