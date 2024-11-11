
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arEditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import arUserReEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserReEnrollModal'
import arUserUnEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { lessonVideo, ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import ARFileManagerUploadsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'

describe('AR - Regress - Enrollments - Bulk Enroll Re-Enroll Un-enroll - OC', function () {
    //test specific array
    //these courses have issue with in complete and scores
    //let onlineCourses = [courses.oc_filter_02_name, courses.oc_filter_03_name, courses.oc_filter_04_ojt] 

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()

        // Create Online Course
        cy.createCourse("Online Course")

        //Verify Video Lesson Can Be Selected
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoName)

        //Add Valid Width and Height to Video Lesson
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).type('640')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).type('480')

        //Add a Video Label
        cy.get(ARAddVideoLessonModal.getVideoSourceLabelTxtF()).type(lessonVideo.videoLabel)

        //Add a Video Via File Upload
        cy.get(ARAddVideoLessonModal.getVideoSourceChooseFileBtn()).click()
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.videoPath + lessonVideo.videoName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getMediumWait()

        //Save the Video Lesson
        cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click().click({ force: true })
        ARUploadFileModal.getLShortWait()

        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        //Select self enrollment For All Learners Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Publish Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        //save course name 
        commonDetails.courseNames.push(ocDetails.courseName)
        // Create Online Course
        cy.createCourse('Online Course', ocDetails.courseName2)
        //Verify Video Lesson Can Be Selected
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoName)

        //Add Valid Width and Height to Video Lesson
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).type('640')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).type('480')

        //Add a Video Label
        cy.get(ARAddVideoLessonModal.getVideoSourceLabelTxtF()).type(lessonVideo.videoLabel)

        //Add a Video Via File Upload
        cy.get(ARAddVideoLessonModal.getVideoSourceChooseFileBtn()).click()
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.videoPath + lessonVideo.videoName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getMediumWait()

        //Save the Video Lesson
        cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click()
        cy.get(arDashboardPage.getModal()).should('not.exist')
        

        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        //Select self enrollment For All Learners Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Publish Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        //save course name 
        commonDetails.courseNames.push(ocDetails.courseName2)

    })

    beforeEach(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after(function () {
        //Delete user
        arDashboardPage.getUsersReport()
        arUserPage.deleteUser('Username',userDetails.username)

        let i = 0
        for (; i < commonDetails.courseIDs.length; i++) {
            let course = commonDetails.courseIDs[i]
            if (course.type === null) {
                cy.deleteCourse(course.id)
            } else {
                cy.deleteCourse(course.id, course.type)
            }
        }
    })

    it('Bulk enroll learner to online courses', function () {
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')), arEnrollUsersPage.getShortWait())
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')).should('have.attr','aria-disabled','false').click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arSelectModal.SearchAndSelectFunction(commonDetails.courseNames))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), arEnrollUsersPage.getShortWait())
        cy.get(arEnrollUsersPage.getSaveBtn()).click()

        //Wait for enrollment to complete
        cy.get(arEnrollUsersPage.getToastSuccessMsg(), { timeout: 20000 }).should('contain', 'Enrollment Requested')
        cy.get(arEnrollUsersPage.getToastCloseBtn()).click()
        arEnrollUsersPage.getShortWait()
        cy.get(arEnrollUsersPage.getToastSuccessMsg(), { timeout: 30000 }).should('contain', 'Enrollment Successful')
    })

    it('Verify learner enrollments to online courses then Bulk Re-enroll learner to online courses', function () {
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))

        // Verify learner is enrolled to each course then change enrollment status to 'Completed'
        commonDetails.courseNames.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '0')
                cy.get('td').eq(4).should('have.text', 'Not Started')
            }).click()
            cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit Enrollment'), arEnrollUsersPage.getShortWait()))
            cy.get(arUserPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
            arUserPage.getShortWait() // Wait for radio btns to become enabled
            cy.wrap(arEditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))
            cy.wrap(arUserPage.WaitForElementStateToChange(arEditActivityPage.getSaveBtn(), arEnrollUsersPage.getShortWait()))
            cy.get(arEditActivityPage.getSaveBtn()).click()
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '100')
                cy.get('td').eq(4).should('have.text', 'Complete')
            }).click()
        })

        commonDetails.courseNames.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).click()
        })

        cy.get(arUserPage.getGridTable()).should('have.length', commonDetails.courseNames.length)
        cy.get(arUserPage.getFooterCount()).contains(`1 - ${commonDetails.courseNames.length} of ${commonDetails.courseNames.length} items`).should('exist')

        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Re-enroll User'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Re-enroll User')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), arEnrollUsersPage.getShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click()
        //Wait for re-enrollment to complete
        cy.get(arEnrollUsersPage.getToastSuccessMsg(), { timeout: 30000 }).should('contain', 'Re-enrollment Successful')
    })

    it('Verify learner was re-enrolled to online courses then bulk Un-enroll learner from Online Courses', function () {
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))

        commonDetails.courseNames.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '0')
                cy.get('td').eq(4).should('have.text', 'Not Started')
            }).click()
        })

        cy.get(arUserPage.getGridTable()).should('have.length', commonDetails.courseNames.length)
        cy.get(arUserPage.getFooterCount()).contains(`1 - ${commonDetails.courseNames.length} of ${commonDetails.courseNames.length} items`).should('exist')

        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Un-enroll User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserUnEnrollModal.getOKBtn(), arEnrollUsersPage.getShortWait()))
        cy.get(arUserUnEnrollModal.getOKBtn()).click()
        //Wait for un-enrollment to complete
        cy.get(arEnrollUsersPage.getToastSuccessMsg(), { timeout: 30000 }).should('contain', 'Unenroll Successful')
    })

    it('Verify learner was un-enrolled from online courses', function () {
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
})