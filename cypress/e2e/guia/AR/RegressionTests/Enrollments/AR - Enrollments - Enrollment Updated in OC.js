import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddESignatureLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddESigntureLessonModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, eSignature, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'

describe('AR - Enrollments - Enrollment Update in OC', function () {

    before(function () {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        //Sign into admin side, create an OC with one lesson, enroll user in course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('E-Signature')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARAddESignatureLessonModal.getNameTxtF()).clear().type(eSignature.eSignatureName)
        cy.get(ARAddESignatureLessonModal.getSaveBtn()).click()
        arCoursesPage.getLShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        //Enroll user
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        LECatalogPage.turnOnNextgenToggle()
    })

    after(function () {
        //Cleanup
        cy.deleteCourse(commonDetails.courseID);
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getLongWait()
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOffNextgenToggle()
    })

    it('Verify Learner Can See Available Lesson, Add Second Lesson and Second Chapter With Lesson', () => {
        //Login as learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Go directly to course
        //cy.visit(`#/online-courses/${commonDetails.courseID}`)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSpecificCourseCardBtnThenClickOnName(ocDetails.courseName)
        arCoursesPage.getMediumWait()
        //Click on lessons nav button
        cy.get(LECourseDetailsOCModule.getLessonNavBtn()).contains('Lessons').click({force:true})
        arCoursesPage.getShortWait()

        //Verify Available lesson
        cy.get(LECourseDetailsOCModule.getChapterTitle()).should('contain', ocDetails.defaultChapterName).parents(LECourseDetailsOCModule.getChapterContainer())
            .within(() => {
                cy.get(LECourseDetailsOCModule.getNumLessons()).should('contain', '1')
                cy.get(LECourseLessonPlayerPage.getCourseLessonDetailsLessonTitle()).should('contain', eSignature.eSignatureName)
            })
    })

    it('Add Second Lesson and Second Chapter With Lesson, Verify Learner Can See Updated Available Lesson', () => {
        //Sign in as Sys admin and edit course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()    
        cy.editCourse(ocDetails.courseName)

        //Add a second lesson to chapter 1
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName)

        //Add a second chapter with 1 lesson
        cy.get(AROCAddEditPage.getAddChapterBtn()).click()
        AROCAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getChapterTitle()).contains(ocDetails.defaultChapterName2).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        })
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName)

        //Publish course
        cy.publishCourse()

        //Login as learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Go directly to course
        //cy.visit(`#/online-courses/${commonDetails.courseID}`)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSpecificCourseCardBtnThenClickOnName(ocDetails.courseName)
        arCoursesPage.getMediumWait()
        //Click on lessons nav button
        cy.get(LECourseDetailsOCModule.getLessonNavBtn()).contains('Lessons').click({force:true})
        arCoursesPage.getShortWait()

        // Verify all available lessons
        cy.get(LECourseDetailsOCModule.getChapterTitle()).should('contain', ocDetails.defaultChapterName).parents(LECourseDetailsOCModule.getChapterContainer())
            .within(() => {
                cy.get(LECourseDetailsOCModule.getNumLessons()).should('contain', '2')
                cy.get(LECourseLessonPlayerPage.getCourseLessonDetailsLessonTitle()).should('contain', eSignature.eSignatureName)
                cy.get(LECourseDetailsOCModule.getLessonName()).should('contain', lessonObjects.objectName)
            })

        cy.get(LECourseDetailsOCModule.getChapterTitle()).should('contain', ocDetails.defaultChapterName2).parents(LECourseDetailsOCModule.getChapterContainer())
            .within(() => {
                cy.get(LECourseDetailsOCModule.getNumLessons()).should('contain', '1')
                cy.get(LECourseDetailsOCModule.getLessonName()).should('contain', lessonObjects.objectName)
            })
    })

    it('Remove Second Lesson and Second Chapter, Verify Learner Cannot See Removed Lessons and Chapter', () => {
        //Sign in as Sys admin and edit course 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.editCourse(ocDetails.courseName)

        //Delete second lesson from chapter 1
        cy.get(AROCAddEditPage.getChapterTitle()).contains(ocDetails.defaultChapterName).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            AROCAddEditPage.getDeleteBtnByLessonNameThenClick(lessonObjects.objectName)
        })
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        AROCAddEditPage.getShortWait()

        //Delete lesson in chapter 2, and chapter 2
        cy.get(AROCAddEditPage.getChapterTitle()).contains(ocDetails.defaultChapterName2).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            AROCAddEditPage.getDeleteBtnByLessonNameThenClick(lessonObjects.objectName)
        })
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        AROCAddEditPage.getShortWait()

        cy.get(AROCAddEditPage.getChapterTitle()).contains(ocDetails.defaultChapterName2).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            cy.get(AROCAddEditPage.getDeleteChapterBtn()).click()
        })
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        AROCAddEditPage.getShortWait()

        //Publish course
        cy.publishCourse()

        //Login as learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        arCoursesPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSpecificCourseCardBtnThenClickOnName(ocDetails.courseName)
        arCoursesPage.getMediumWait()
        //Click on lessons nav button
        cy.get(LECourseDetailsOCModule.getLessonNavBtn()).contains('Lessons').click({force:true})
        arCoursesPage.getShortWait()
        //Verify Deleted lessons and chapters are no longer available
        cy.get(LECourseDetailsOCModule.getChapterTitle()).should('contain', ocDetails.defaultChapterName).parents(LECourseDetailsOCModule.getChapterContainer())
            .within(() => {
                cy.get(LECourseDetailsOCModule.getNumLessons()).should('contain', '1')
                cy.get(LECourseLessonPlayerPage.getCourseLessonDetailsLessonTitle()).should('contain', eSignature.eSignatureName)
                cy.get(LECourseDetailsOCModule.getLessonName()).contains(lessonObjects.objectName).should('not.exist')
            })
        cy.get(LECourseDetailsOCModule.getChapterTitle()).contains(ocDetails.defaultChapterName2).should('not.exist')
    })
})


