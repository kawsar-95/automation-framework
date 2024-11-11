import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARAddThirdPartyLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddThirdPartyLessonModal'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsOCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import { ocDetails, lessonObjects } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'

describe('AR - CED - OC - Lesson - Use Existing T832331', function(){

    //Test specific array
    let lessonNames = [courses.oc_lesson_act_ssta_aicc_name, courses.oc_lesson_act_ssta_scorm_1_2_name, 
                        courses.oc_lesson_act_ssta_scorm_2004_name, courses.oc_lesson_act_ssta_tin_can_name]

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete course and user
        cy.deleteCourse(commonDetails.courseID)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Each type of Existing Third Party Lesson can be Added to an OC, Publish OC', () => { 
        cy.createCourse('Online Course')

        //Add each type of third party lesson as a new lesson
        for (let i = 0; i < lessonNames.length; i++) {
            cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            ARSelectLearningObjectModal.getObjectTypeByName('Use Existing')
            cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
            cy.intercept('/api/rest/v2/admin/reports/shared-lessons').as(`getLessons`).wait(`@getLessons`)
            //Select lesson type
            cy.get(arCoursesPage.getTableCellName(2)).contains(lessonNames[i]).click()
            cy.get(ARSelectLearningObjectModal.getNextBtn()).eq(1).click() //identical previous 'Next' button still exists in DOM
            arCoursesPage.getShortWait()
            //Save lesson
            cy.get(ARAddThirdPartyLessonModal.getApplyBtn()).click()
            arCoursesPage.getLShortWait()
        }

        //Verify shared lesson label appears next to each object
        cy.get(arOCAddEditPage.getSharedLearningObjectTxt()).should('have.length', lessonNames.length)

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Enroll Learner in OC, Verify Each Added Existing Third Party Lesson can be Launched in LE', () => { 
        //Enroll user in course
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])

        //Login to LE, go to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()

        //Launch and close each lesson type
        for (let i = 0; i < lessonNames.length; i++) {
            LECourseDetailsOCModule.getCourseLessonActionBtn(lessonNames[i], 'Start', true)
            LEDashboardPage.getLShortWait() 
            cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
            LEDashboardPage.getMediumWait() //There is a 2s pause when closing a lesson
        }
    })

    it('Verify Each Added Existing Third Party Lesson can be Edited, Then Seen and Launched in LE', () => { 
        //Edit course
        cy.editCourse(ocDetails.courseName)
        arCoursesPage.getMediumWait()

        //Edit each existing third party lesson
        for (let i = 0; i < lessonNames.length; i++) {
            arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonNames[i])
            cy.get(ARAddThirdPartyLessonModal.getNameTxtF()).clear().type(`${lessonNames[i]}${commonDetails.appendText}`)
            //Save lesson
            cy.get(ARAddThirdPartyLessonModal.getApplyBtn()).click()
            arCoursesPage.getLShortWait()
        }
        
        //publish course
        cy.publishCourse()

        //Login to LE, go to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()

        //Launch and close each edited lesson type
        for (let i = 0; i < lessonNames.length; i++) {
            LECourseDetailsOCModule.getCourseLessonActionBtn(`${lessonNames[i]}${commonDetails.appendText}`, 'Resume', true)
            LEDashboardPage.getLShortWait() 
            cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
            LEDashboardPage.getMediumWait() //There is a 2s pause when closing a lesson
        }
    })

    it('Verify SCORM1.2 Existing Lesson Object can be Deleted, Publish Course, Verify Lesson Does not Exist in LE', () => { 
        //Edit course
        cy.editCourse(ocDetails.courseName)
        arCoursesPage.getMediumWait()

        //Delete SCORM1.2 Lesson
        arOCAddEditPage.getDeleteBtnByLessonNameThenClick(`${lessonNames[1]}${commonDetails.appendText}`)
        cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        arOCAddEditPage.getShortWait()

        //publish course
        cy.publishCourse()

        //Login to LE, go to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()

        //Verify SCORM 1.2 lesson no longer exists
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(`${lessonNames[1]}${commonDetails.appendText}`).should('not.exist')
    })
})