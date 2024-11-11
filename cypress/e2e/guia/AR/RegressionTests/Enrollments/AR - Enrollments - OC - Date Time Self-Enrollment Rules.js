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

describe('AR - CED - OC - Date Time Self-Enrollment Rules', function () {

    //Test specific array
    let dateTimeCourses = [ocEnrollments.courseNameDateTimeBefore, ocEnrollments.courseNameDateTimeAfter, ocEnrollments.courseNameDateTimeBetween]

    after(function () {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    for (let i = 0; i < dateTimeCourses.length; i++) {
        it(`Create Online Course ${dateTimeCourses[i]}`, () => {
            let learnerCount;
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
            arDashboardPage.getMenuItemOptionByName('Courses')
            

            //Create course with basic object lesson
            cy.createCourse('Online Course', dateTimeCourses[i])
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            arSelectLearningObjectModal.getObjectTypeByName('Object')
            cy.get(arSelectLearningObjectModal.getNextBtn()).click()
            arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')

            //Set enrollment rules
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
            arCoursesPage.getShortWait()
            arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
            if (dateTimeCourses[i].includes('BEFORE')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Date Time Custom Field', 'Before', '2018-04-13 7 01 PM', null)
                learnerCount = ocEnrollments.numLearnersBeforeDateTime
            } else if (dateTimeCourses[i].includes('AFTER')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Date Time Custom Field', 'After', '2018-04-13 11 58 PM', null)
                learnerCount = ocEnrollments.numLearnersAfterDateTime
            } else {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Date Time Custom Field', 'Between', '2018-04-13 12 00 AM', '2018-04-14 12 00 AM')
                learnerCount = ocEnrollments.numLearnersBetweenDateTime
            }

            cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
                .contains(`This course will be available for ${learnerCount} learners to self-enroll in.`).should('exist')

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

    it('Verify course is unavailable to learner who does not match any of the self enrollment rules', function () {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameDateTime)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it(`Verify that the \'Before\' and \'Between\' courses are available to the learner who match the self enrollment rule`, function () {
        cy.apiLoginWithSession(users.learner04.learner_04_username, users.learner04.learner_04_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameDateTime)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 2)
        LECatalogPage.getSpecificCourseCardBtnThenClick(dateTimeCourses[0])
        LECatalogPage.getSpecificCourseCardBtnThenClick(dateTimeCourses[2])
        arCoursesPage.getMediumWait()
    })

    it(`Verify that the \'After\' and \'Between\' courses are available to the learner who match the self enrollment rule`, function () {
        cy.apiLoginWithSession(users.learner05.learner_05_username, users.learner05.learner_05_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameDateTime)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 2)
        LECatalogPage.getSpecificCourseCardBtnThenClick(dateTimeCourses[1])
        LECatalogPage.getSpecificCourseCardBtnThenClick(dateTimeCourses[2])
        arCoursesPage.getMediumWait()
    })

    it('Check learner is enrolled to course with Self Enrollment rules they match', function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        for (let i = 0; i < dateTimeCourses.length; i++) {
            let learnerCount;
            arCoursesPage.EnrollmentPageFilter(dateTimeCourses[i])
            cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
            if (i == 0) {
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
            }
            arCoursesPage.getLShortWait()
            if (dateTimeCourses[i].includes('BEFORE')) {
                learnerCount = ocEnrollments.numLearnersBeforeDateTime
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner04.learner_04_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if (dateTimeCourses[i].includes('AFTER')) {
                learnerCount = ocEnrollments.numLearnersAfterDateTime
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner05.learner_05_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else {
                learnerCount = ocEnrollments.numLearnersBetweenDateTime
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
            cy.get(arCoursesPage.getGridTable()).should('have.length', learnerCount)
            cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${learnerCount} of ${learnerCount} items`).should('exist')

            if (i != dateTimeCourses.length) {
                cy.get(arCoursesPage.getEditFilterBtn()).contains(dateTimeCourses[i]).click()
            }
        }
    })
})