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

describe('AR - CED - OC - Text Automatic Enrollment Rules', function() {
    
    //Test specific array
    let textCourses = [ocEnrollments.courseNameTextStartsW, ocEnrollments.courseNameTextContains, ocEnrollments.courseNameTextDNContain,
        ocEnrollments.courseNameTextEndsW, ocEnrollments.courseNameTextDNEql, ocEnrollments.courseNameTextEqls]

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

    for (let i = 0; i < textCourses.length; i++) {
        it(`Create Online Course ${textCourses[i]}`, () =>{
            let learnerCount;
            //Create course with basic object lesson
            cy.createCourse('Online Course', textCourses[i])
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            arSelectLearningObjectModal.getObjectTypeByName('Object')
            cy.get(arSelectLearningObjectModal.getNextBtn()).click()
            arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')
    
            //Set enrollment rules
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
            arCoursesPage.getShortWait()
            arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')

           if(textCourses[i].includes('Starts With')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Starts With', '1GUIA', null)
                learnerCount = ocEnrollments.numLearnersStartsW
            } else if(textCourses[i].includes('Contains')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Contains', 'GUIA', null)
                learnerCount = ocEnrollments.numLearnersContains
               
            } else if(textCourses[i].includes('Does Not Contain')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Does Not Contain', null, null)
                learnerCount = ocEnrollments.numLearnersDNContain
            } else if(textCourses[i].includes('Ends With')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Ends With', 'GUIA2', null)
                learnerCount = ocEnrollments.numLearnersEndsW
            } else if(textCourses[i].includes('Does Not Equal')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Does Not Equal', null, null)
                learnerCount = ocEnrollments.numLearnersDNEql

            } else if(textCourses[i].includes('Equals')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Equals', 'GUIA', null)
                learnerCount = ocEnrollments.numLearnersEqls
            }
        
        
            cy.get(arCourseSettingsEnrollmentRulesModule.getCountBanner()).should('have.text' , `${learnerCount} users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with ${learnerCount} receiving a new enrollment.`)

            
            //Verify publish modal and publish course
            cy.get(arOCAddEditPage.getPublishBtn()).click()
            arPublishModal.getPublishModalTileValue('Users Enrolled', learnerCount, `${learnerCount} users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with ${learnerCount} receiving a new enrollment.`)
                arPublishModal.getPublishModalTileValue('Available Users', '0', `Based on the self enrollment rules, this course will be available to 0 users.`)
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

    it('Verify learners who match the rules are automatically enrolled to correct courses', function() {
        arOCAddEditPage.getHFJobWait() //wait for enrollments to complete
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        for(let i = 0; textCourses.length < 1; i++) {
            arCoursesPage.EnrollmentPageFilter(textCourses[i])
            cy.intercept('/**/reports/course-enrollments/operations').as('getCourseEnrollments').wait('@getCourseEnrollments')
            if (i == 0) {
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
            }
            arCoursesPage.getLShortWait()
            if(textCourses[i].includes('Starts With')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersStartsW)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersStartsW} of ${ocEnrollments.numLearnersStartsW} items`).should('exist')

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner01.learner_01_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if(textCourses[i].includes('Contains')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersContains)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersContains} of ${ocEnrollments.numLearnersContains} items`).should('exist')
                
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

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner05.learner_05_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if(textCourses[i].includes('Does Not Contain')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersDNContain)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersDNContain} of ${ocEnrollments.numLearnersDNContain} items`).should('exist')
                
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

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner05.learner_05_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if(textCourses[i].includes('Does Not Equal')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersDNEql)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersDNEql} of ${ocEnrollments.numLearnersDNEql} items`).should('exist')

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

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner05.learner_05_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if(textCourses[i].includes('Ends With')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersEndsW)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersEndsW} of ${ocEnrollments.numLearnersEndsW} items`).should('exist')

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner02.learner_02_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            } else if(textCourses[i].includes('Equals')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersEqls)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersEqls} of ${ocEnrollments.numLearnersEqls} items`).should('exist')

                cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner03.learner_03_username).parent().within(() => {
                    cy.get('td').eq(5).should('have.text', '0')
                    cy.get('td').eq(6).should('have.text', 'Not Started')
                    cy.get('td').eq(7).should('have.text', 'Yes')
                })
            }
            if (i != textCourses.length) {
                cy.get(arCoursesPage.getEditFilterBtn()).contains(textCourses[i]).click()
            }
        }
    })
})
