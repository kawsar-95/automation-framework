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

describe('AR - CED - OC - Self-Enrollment Rules - Text Rules', function() {
    
    //Test specific array
    let textCourses = [ocEnrollments.courseNameTextStartsW, ocEnrollments.courseNameTextContains, ocEnrollments.courseNameTextDNContain,
                ocEnrollments.courseNameTextEndsW, ocEnrollments.courseNameTextDNEql, ocEnrollments.courseNameTextEqls]
    
    after(function () {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    for(let i = 0 ; i < textCourses.length ; i++) {
        it(`Create an Online Course ${textCourses[i]}`, () =>{
            var learnerCount;
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
            arDashboardPage.getMenuItemOptionByName('Courses')
            

            //Create course with basic object lesson
            cy.createCourse('Online Course', textCourses[i])
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            arSelectLearningObjectModal.getObjectTypeByName('Object')
            cy.get(arSelectLearningObjectModal.getNextBtn()).click()
            arAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')
    
            //Set enrollment rules
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
            arCoursesPage.getShortWait()
            arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')

            if(textCourses[i].includes('Starts With')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Starts With', '1GUIA', null)
                learnerCount = ocEnrollments.numLearnersStartsW
                
            } else if(textCourses[i].includes('Contains')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Contains', 'GUIA', null)
                learnerCount = ocEnrollments.numLearnersContains
               
            } else if(textCourses[i].includes('Does Not Contain')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Does Not Contain', null, null)
                learnerCount = ocEnrollments.numLearnersDNContain
              
            } else if(textCourses[i].includes('Ends With')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Ends With', 'GUIA2', null)
                learnerCount = ocEnrollments.numLearnersEndsW
            } else if(textCourses[i].includes('Does Not Equal')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Does Not Equal', null, null)
                learnerCount = ocEnrollments.numLearnersDNEql
            } else if(textCourses[i].includes('Equals')) {
                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Equals', 'GUIA', null)
                learnerCount = ocEnrollments.numLearnersEqls
            }


            cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
            .should('have.text' , `This course will be available for ${learnerCount} learners to self-enroll in.`)
    
            //Verify publish modal and publish course
            cy.get(arOCAddEditPage.getPublishBtn()).click()
            arDashboardPage.getMediumWait()
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

    it('Verify courses are unavailable to learner who does not match any enrollment rules', function() {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameText)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it('Verify courses are available to learner who match \'Starts With\', \'Contains\', \'Does Not Contain\', and \'Does Not Equal\' Enrollment Rules', function() {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameText)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 4)
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[0])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[1])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[2])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[4])
        arCoursesPage.getMediumWait()
    })

    it('Verify courses are available to learner who match \'Ends With\', \'Does Not Contain\', and \'Does Not Equal\' Enrollment Rules', function() {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameText)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 4)
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[1])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[2])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[3])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[4])
        arCoursesPage.getMediumWait()
    })

    it('Verify courses are available to learner who match \'Contains\', \'Does Not Contain\', \'Does Not Equal\', \'Equals\' Enrollment Rule', function() {
        cy.apiLoginWithSession(users.learner03.learner_03_username, users.learner03.learner_03_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocEnrollments.courseNameText)
        LEDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCatalogContainer()).should('have.length', 4)
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[1])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[2])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[4])
        LECatalogPage.getSpecificCourseCardBtnThenClick(textCourses[5])
        arCoursesPage.getMediumWait()
    })

    it('Check learners are enrolled to courses with Self Enrollment rules they match', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Course Enrollments')

        for(let i = 0; i < textCourses.length ; i++) {
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
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersContainsSelf)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersContainsSelf} of ${ocEnrollments.numLearnersContainsSelf} items`).should('exist')
                
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
            } else if(textCourses[i].includes('Does Not Contain')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersDNContainSelf)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersDNContainSelf} of ${ocEnrollments.numLearnersDNContainSelf} items`).should('exist')
                
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
            } else if(textCourses[i].includes('Does Not Equal')) {
                cy.get(arCoursesPage.getGridTable()).should('have.length', ocEnrollments.numLearnersDNEqlSelf)
                cy.get(arCoursesPage.getFooterCount()).contains(`1 - ${ocEnrollments.numLearnersDNEqlSelf} of ${ocEnrollments.numLearnersDNEqlSelf} items`).should('exist')

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
