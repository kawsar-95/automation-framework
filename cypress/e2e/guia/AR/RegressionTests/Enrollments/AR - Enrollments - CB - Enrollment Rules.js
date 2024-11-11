import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import arCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESelectILCSessionModal from '../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'
import { cbDetails, childCourses } from '../../../../../../helpers/TestData/Courses/cb'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - Enrollments - CB - Enrollment Rules', function() {
    
    after(function () {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i][0], commonDetails.courseIDs[i][1])
        }
    })

    for (let i = 0; i < childCourses.cbChildCourses.length; i++) {    
        it(`Create ${childCourses.cbChildCourses[i]} CB child course`, function() {
            let courseType;
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
            ARDashboardPage.getCoursesReport()
            

            switch (childCourses.cbChildCourses[i]) {
                case childCourses.ocChild1:
                    courseType = 'online-courses'
                    cy.createCourse('Online Course', childCourses.cbChildCourses[i])
                    //Add basic lesson object
                    cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
                    arSelectLearningObjectModal.getObjectTypeByName('Object')
                    cy.get(arSelectLearningObjectModal.getNextBtn()).click()
                    ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName)
                    //Set enrollment rule
                    cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
                    arCoursesPage.getShortWait()
                    arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
                    arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Department', 'Is Only', 'Enrollment Rule Dept', null) 
                    break;
                case childCourses.ocChild2:
                    courseType = 'online-courses'
                    cy.createCourse('Online Course', childCourses.cbChildCourses[i])
                    //Add basic lesson object
                    cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
                    arSelectLearningObjectModal.getObjectTypeByName('Object')
                    cy.get(arSelectLearningObjectModal.getNextBtn()).click()
                    ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName)
                    //no enrollment rules to verify learners are enrolled after enrolling to CB
                    break;
                case childCourses.ilcChild1:
                    courseType = 'instructor-led-courses-new'
                    //Create basic ILC course with session w/ no enrollment rules
                    cy.createCourse('Instructor Led', childCourses.cbChildCourses[i], false)
                    //Create ILC Sessions with different enrollment rules to verify session enrollment rules are not overridden by the CB enrollment rules
                    for (let j = 0; j < sessions.sessionNames2.length; j++) {
                        arILCAddEditPage.getAddSession(sessions.sessionNames2[j])
                        cy.get(arILCAddEditPage.getElementByAriaLabelAttribute(arILCAddEditPage.getExpandEnrollmentRulesBtn())).click()

                        switch (sessions.sessionNames2[j]) {
                            case sessions.sessionName_1:
                                cy.get(arILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
                                break;
                            case sessions.sessionName_2:
                                cy.get(arILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('Specific').click()
                                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Session', 'Job Title', 'Contains', 'GUIA', null) 
                                arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Session', 0, 'GUIA Decimal Custom Field', 'Equals', '12.23', null)
                                break;
                            case sessions.sessionName_3:
                                cy.get(arILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('Specific').click()
                                arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Session', 'Department', 'Is Only', 'Enrollment Rule Dept', null) 
                                break;
                            case sessions.sessionName_4:
                                break;
                            default:
                                console.log(`Sorry, ${sessions.sessionNames2[j]} does not exist.`);
                        }
                        cy.get(arILCAddEditPage.getAddEditSessionSaveBtn()).click()
                        arILCAddEditPage.getLShortWait()
                    }
                    break;
                default:
                    console.log(`Sorry, ${childCourses.cbChildCourses[i]} course does not exist.`);
            }
            //no need to check counts of child courses as this has already been tested in OC and ILC
            cy.publishCourseAndReturnId().then((id) => {
                commonDetails.courseIDs.push([id.request.url.slice(-36), courseType])
            })
        })
    }

    it('Create Course Bundle with Enrollment Rules', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        ARDashboardPage.getCoursesReport()
        
        cy.createCourse('Course Bundle')
        //Add created courses
        arSelectModal.SearchAndSelectFunction(childCourses.cbChildCourses)

        //Set enrollment rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        //Add self and automatic enrollment rules to the CB
        arCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')
        arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Job Title', 'Contains', 'GUIA', null) 
        arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Self', 0, 'GUIA Decimal Custom Field', 'Equals', '12.23', null)

        //Verify self enrollment learner count
        //cy.get(arCourseSettingsEnrollmentRulesModule.getUserCountBanner())
            //.contains(`This course will be available for 1 learners to self-enroll in.`).should('exist')
        arCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
        arCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Job Title', 'Contains', 'GUIA', null) 
        arCourseSettingsEnrollmentRulesModule.RefineEnrollmentRule('Auto', 0, 'Date Hired', 'After', '2019-12-30', null)
        //Verify automatic enrollment learner count
        //cy.get(arCourseSettingsEnrollmentRulesModule.getCountBanner())
            //.should('have.text',`2 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 2 receiving a new enrollment.`)
        cy.get(arOCAddEditPage.getPublishBtn()).click()
        //Verify counts on the publish modal
        //arPublishModal.getPublishModalTileValue('Users Enrolled', 1, `1 users meet the automatic enrollment rules you have set. 0 have an existing enrollment, with 1 receiving a new enrollment.`)
        //arPublishModal.getPublishModalTileValue('Available Users', 1, `Based on the self enrollment rules, this course will be available to 1 users.`)
        cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn(), 700))
        cy.get(arPublishModal.getContinueBtn()).click()
        cy.intercept('/api/rest/v2/admin/course-drafts/**').as(`getUrl`)
        cy.wait(`@getUrl`).then((id) => {
            commonDetails.courseIDs.push([id.request.url.slice(-36), 'course-bundles'])
        })
    })
    
    it('Verify Course Bundle is unavailable to learner who does not match the self enrollment rules', function() {
        cy.apiLoginWithSession(users.learner08.learner_08_username, users.learner08.learner_08_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(cbDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })

    it('Verify Course Bundle is available to learner who match the self enrollment rules', function() {
        cy.apiLoginWithSession(users.learner010.learner_010_username, users.learner010.learner_010_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(cbDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(cbDetails.courseName)
        arCoursesPage.getMediumWait()

        //After enrolling to the CB, verify that the learner is enrolled to CB child courses
        for(let i = 0; i < childCourses.cbChildCourses.length; i++) {
            cy.get(LECoursesPage.getCourseCardName()).should('contain', childCourses.cbChildCourses[i])
        }

        //Verify that session self enrollment rules are still followed
        LECatalogPage.getILCCardChooseSessionBtn(childCourses.cbChildCourses[2])
        cy.get(LESelectILCSessionModal.getModalSessionsContainer()).should('have.length', 2)
        cy.get(LESelectILCSessionModal.getSessionName()).should('contain', 'Session 1')
        cy.get(LESelectILCSessionModal.getSessionName()).should('contain', 'Session 2')
    }) 

    it('Verify Self and Automatic Enrollments into Child Courses', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        arDashboardPage.getCourseEnrollmentReport()

        //Verify that the learners who match the self/automatic enrollment rules have enrollments to the CB child courses
        for(let i = 0; i < childCourses.cbChildCourses.length; i++) {
            arCoursesPage.EnrollmentPageFilter(childCourses.cbChildCourses[i])
            if (i === 0) {
                cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
            }
            arCoursesPage.getLongWait()          
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
            
            cy.get(arCoursesPage.getGridTable()).should('have.length', 2)
            cy.get(arCoursesPage.getFooterCount()).contains(`1 - 2 of 2 items`).should('exist')

            if (i != childCourses.cbChildCourses.length) {
                cy.get(arCoursesPage.getEditFilterBtn()).contains(childCourses.cbChildCourses[i]).click()
            }
        }
    })

    it('Verify Self and Automatic Enrollments into Course Bundle', function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        arDashboardPage.getCourseEnrollmentReport()
        arCoursesPage.EnrollmentPageFilter(cbDetails.courseName)
        cy.wrap(arCoursesPage.AddFilter('Is Enrolled', 'Yes'))
        arCoursesPage.getLongWait() 

        cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner01.learner_01_username).parent().within(() => {
            cy.get('td').eq(5).should('have.text', '0')
            cy.get('td').eq(6).should('have.text', 'N/A')
            cy.get('td').eq(7).should('have.text', 'Yes')
        })          

        cy.get(arCoursesPage.getTableCellRecord()).contains(users.learner02.learner_02_username).parent().within(() => {
            cy.get('td').eq(5).should('have.text', '0')
            cy.get('td').eq(6).should('have.text', 'N/A')
            cy.get('td').eq(7).should('have.text', 'Yes')
        })
    })
})