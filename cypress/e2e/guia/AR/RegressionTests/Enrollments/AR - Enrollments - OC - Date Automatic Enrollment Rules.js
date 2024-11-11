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

describe('AR - CED - OC - Date Automatic Enrollment Rules', function() {

    let dateCourses = [ocEnrollments.courseNameDateBefore, ocEnrollments.courseNameDateAfter, ocEnrollments.courseNameDateBetween]
    
    beforeEach(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        
    })
    
    after(function () {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    for (let i = 0; i < dateCourses.length; i++) {
        it(`Create Online Course ${dateCourses[i]}`, () =>{
            let learnerCount;
            //Create course with basic object lesson
            cy.createCourse('Online Course', dateCourses[i])
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            arSelectLearningObjectModal.getObjectTypeByName('Object')
            cy.get(arSelectLearningObjectModal.getNextBtn()).click()
            arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')
    
            //Set enrollment rules
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
            arCoursesPage.getShortWait()
            arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
            if(dateCourses[i].includes('BEFORE')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Date Hired', 'Before', '2019-06-01', null)
                learnerCount = ocEnrollments.numLearnersBeforeDate
            } else if(dateCourses[i].includes('AFTER')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Date Hired', 'After', '2019-07-01', null)
                learnerCount = ocEnrollments.numLearnersAfterDate
            } else {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Date Hired', 'Between', '2019-01-01', '2019-12-31')
                learnerCount = ocEnrollments.numLearnersBetweenDate
            }
        
            cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
                    .contains(`${learnerCount} users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with ${learnerCount} receiving a new enrollment.`).should('exist')
             
            //Verify publish modal and publish course
            cy.get(arOCAddEditPage.getPublishBtn()).click()
            arPublishModal.getPublishModalTileValue('Users Enrolled', learnerCount, `${learnerCount} users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with ${learnerCount} receiving a new enrollment.`)
            arPublishModal.getPublishModalTileValue('Available Users', '0', `Based on the self enrollment rules, this course will be available to 0 users.`)
            cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
            cy.intercept('POST', '/api/rest/v2/admin/published-course-drafts').as('getPublish')
            cy.get(arPublishModal.getContinueBtn()).click() 
            cy.wait('@getPublish')
            cy.intercept('/api/rest/v2/admin/course-drafts/**').as(`getUrl${i}`).wait(`@getUrl${i}`).then((id) => {
                commonDetails.courseIDs.push(id.request.url.slice(-36))
            })
        })
    }

    it('Verify learners who match the rules are automatically enrolled to correct courses', function() {
        arOCAddEditPage.getHFJobWait() //wait for enrollments to complete
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        for(let i = 0; i < dateCourses.length; i++) {
            let learnerCount;
            arCoursesPage.EnrollmentPageFilter(dateCourses[i])
            cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
            
            if (i === 0) {
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
            }
            arCoursesPage.getLShortWait()
            if(dateCourses[i].includes('BEFORE')) {
                learnerCount = ocEnrollments.numLearnersBeforeDate
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner01.learner_01_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if (dateCourses[i].includes('AFTER')) {
                learnerCount = ocEnrollments.numLearnersAfterDate
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner02.learner_02_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else {
                learnerCount = ocEnrollments.numLearnersBetweenDate
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner01.learner_01_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner02.learner_02_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner03.learner_03_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            }
            cy.get(arCoursesPage.getGridTable()).should('have.length', learnerCount)
            cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${learnerCount} of ${learnerCount} items`).should('exist')

            if (i != dateCourses.length) {
                cy.get(arCoursesPage.getEditFilterBtn()).contains(dateCourses[i]).click()
            }
        }
    })
})