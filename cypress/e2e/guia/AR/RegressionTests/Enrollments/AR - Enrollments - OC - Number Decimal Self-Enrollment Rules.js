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

describe('AR - CED - OC - Self-Enrollment Rules - Number and Decimal Rules', function() {
    
    //Test specific array
    let numberDecimalCourses = [ocEnrollments.courseNameNumLessDecEql, ocEnrollments.courseNameNumGrtrDecLess, ocEnrollments.courseNameNumEqlDecGrtr]
    
    after(function () {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    for (let i = 0; i < numberDecimalCourses.length; i++) {
        it(`Create Online Course ${numberDecimalCourses[i]}`, () =>{
            let learnerCount;
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
            arDashboardPage.getMenuItemOptionByName('Courses')
            

            //Create course with basic object lesson
            cy.createCourse('Online Course', numberDecimalCourses[i])
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            arSelectLearningObjectModal.getObjectTypeByName('Object')
            cy.get(arSelectLearningObjectModal.getNextBtn()).click()
            arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')
    
            //Set enrollment rules
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
            arCoursesPage.getShortWait()
            arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
            if(numberDecimalCourses[i].includes('NUM_DEC_LESS_EQL')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Number Custom Field', 'Less Than', '5', null)
                arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'GUIA Decimal Custom Field', 'Equals', '12.23', null)
                learnerCount = ocEnrollments.numLearnersNumLessDecEql
                
            } else if(numberDecimalCourses[i].includes('NUM_DEC_GRTR_LESS')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Number Custom Field', 'Greater Than', '5', null)
                arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'GUIA Decimal Custom Field', 'Less Than', '12.23', null)
                learnerCount = ocEnrollments.numLearnersNumGrtrDecLess
            } else {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'GUIA Number Custom Field', 'Equals', '5', null)
                arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'GUIA Decimal Custom Field', 'Greater Than', '12.23', null)
                learnerCount = ocEnrollments.numLearnersNumEqlDecGrtr
            }
    
            cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
                .should(`have.text`,`This course will be available for ${learnerCount} learners to self-enroll in.`)
            
            //Verify publish modal and publish course
            cy.get(arOCAddEditPage.getPublishBtn()).click()
            arPublishModal.getPublishModalTileValue('Users Enrolled', '0', 'Based on the automatic enrollment rules, 0 users will be enrolled.')
            arPublishModal.getPublishModalTileValue('Available Users', learnerCount, `Based on the self enrollment rules, this course will be available to ${learnerCount} users.`)
            cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
            cy.intercept('POST', '/api/rest/v2/admin/published-course-drafts').as('getPublish')
            cy.intercept('DELETE','/api/rest/v2/admin/course-drafts/**').as(`getUrl${i}`)
            cy.get(arPublishModal.getContinueBtn()).click() 
            cy.wait('@getPublish')
            arDashboardPage.getShortWait()
            cy.wait(`@getUrl${i}`).then((id) => {
                commonDetails.courseIDs.push(id.request.url.slice(-36))
            })
        })
    }

    it('Verify course is unavailable to learner who does not match any of the self enrollment rules', function() {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameNumDec)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it(`Verify ${numberDecimalCourses[0]} is available to the learner who match the self enrollment rule`, function() {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameNumDec)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(numberDecimalCourses[0])
        arCoursesPage.getMediumWait()
    })

    it(`Verify ${numberDecimalCourses[1]} is available to the learner who match the self enrollment rule`, function() {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameNumDec)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(numberDecimalCourses[1])
        arCoursesPage.getMediumWait()
    })

    it(`Verify ${numberDecimalCourses[2]} is available to the learner who match the self enrollment rule`, function() {
        cy.apiLoginWithSession(users.learner03.learner_03_username, users.learner03.learner_03_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameNumDec)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 1)
        LECatalogPage.getCourseCardBtnThenClick(numberDecimalCourses[2])
        arCoursesPage.getMediumWait()
    })

    it('Check learner is enrolled to course with Self Enrollment rules they match', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        for (let i = 0; i < numberDecimalCourses.length; i++) {
            let learnerCount;
            let matchedLearner;
            arCoursesPage.EnrollmentPageFilter(numberDecimalCourses[i])
            cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
            if(i==0) {
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
            }
            arCoursesPage.getLShortWait()
            if(numberDecimalCourses[i].includes('NUM_DEC_LESS_EQL')) {
                learnerCount = ocEnrollments.numLearnersNumLessDecEql
                matchedLearner = users.learner01.learner_01_username
            } else if (numberDecimalCourses[i].includes('NUM_DEC_GRTR_LESS')) {
                learnerCount = ocEnrollments.numLearnersNumGrtrDecLess
                matchedLearner = users.learner02.learner_02_username
            } else if (numberDecimalCourses[i].includes('NUM_DEC_EQL_GRTR')) {
                learnerCount = ocEnrollments.numLearnersNumEqlDecGrtr
                matchedLearner = users.learner03.learner_03_username
            }
            cy.get(arCoursesPage.getGridTable()).should('have.length', learnerCount)
            cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${learnerCount} of ${learnerCount} items`).should('exist')
            
            cy.get(arCoursesPage.getTableCellRecord()).contains(matchedLearner).parent().within(() => {
                cy.get('td').eq(5).should('have.text', '0')
                cy.get('td').eq(6).should('have.text', 'Not Started')
                cy.get('td').eq(7).should('have.text', 'Yes')
            })
            if (i != numberDecimalCourses.length) {
                cy.get(arCoursesPage.getEditFilterBtn()).contains(numberDecimalCourses[i]).click()
            }
        }
    })
})