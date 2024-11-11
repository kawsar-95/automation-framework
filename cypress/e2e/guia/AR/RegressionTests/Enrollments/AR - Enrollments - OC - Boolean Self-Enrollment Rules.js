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

describe('AR - CED - OC - Boolean Self-Enrollment Rules', function() {

    //Test specific array
    let booleanCourses = [ocEnrollments.courseNameBooleanYes, ocEnrollments.courseNameBooleanNo]
    
    after(function () {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })
    
    for (let i = 0; i < booleanCourses.length; i++) {
        it(`Create Online Course ${booleanCourses[i]}`, () =>{ 
            let learnerCount;  
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
            arDashboardPage.getMenuItemOptionByName('Courses') 
            

            //Create course with basic object lesson
            cy.createCourse('Online Course', booleanCourses[i])
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            arSelectLearningObjectModal.getObjectTypeByName('Object')
            cy.get(arSelectLearningObjectModal.getNextBtn()).click()
            arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')
    
            //Set enrollment rules
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
            arCoursesPage.getShortWait()
            arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
            if(booleanCourses[i].includes('YES')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Boolean Custom Field', null, 'Yes', null)  
                learnerCount = ocEnrollments.numLearnersYes
            } else {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Boolean Custom Field', null, 'No', null)
                learnerCount = ocEnrollments.numLearnersNo
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

    it('Verify courses are unavailable to learner who has null in filter selected', function() {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameBoolean)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it('Verify BOOLEAN_YES course is available and BOOLEAN_NO course is unavailable to a \'Yes\' learner', function() {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameBoolean)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(ocEnrollments.courseNameBooleanYes)
        arCoursesPage.getMediumWait()
    })

    it('Verify BOOLEAN_YES course is unavailable and BOOLEAN_NO course is available to a \'No\' learner', function() {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameBoolean)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(ocEnrollments.courseNameBooleanNo)
        arCoursesPage.getMediumWait()
    })

    it('Check learner is enrolled to course with Self Enrollment rules they match', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        for(let i = 0; i < booleanCourses.length; i++) {
            let learnerCount;
            let matchedUser;
            arCoursesPage.EnrollmentPageFilter(booleanCourses[i])
            cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
            if (i == 0) {
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
            }
            arCoursesPage.getLShortWait()
            if(booleanCourses[i].includes('YES')) {
                learnerCount = '1'
                matchedUser = users.learner01.learner_01_username
            } else {
                learnerCount = '1'
                matchedUser = users.learner02.learner_02_username
            }
            cy.get(arCoursesPage.getGridTable()).should('have.length', learnerCount)
            cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${learnerCount} of ${learnerCount} items`).should('exist')
            
            cy.get(arCoursesPage.getTableCellRecord()).contains(matchedUser).parent().within(() => {
                cy.get('td').eq(5).should('have.text', '0')
                cy.get('td').eq(6).should('have.text', 'Not Started')
                cy.get('td').eq(7).should('have.text', 'Yes')
            })
            if (i != booleanCourses.length) {
                cy.get(arCoursesPage.getEditFilterBtn()).contains(booleanCourses[i]).click()
            }
        }
    })    
})