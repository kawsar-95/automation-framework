import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { lessonObjects, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users }from "../../../../../../helpers/TestData/users/users"

let courseTypes = ['online-courses', 'online-courses', 'online-courses', 'instructor-led-courses-new', 'curricula'];

describe('AUT-801 - C6843 - Regression - Curricula Enrollment Rules and Progress - 2', () => {

    before('Turn on Next Gen Toggle', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        LECatalogPage.turnOnNextgenToggle()
    })

    after('Delete courses and user', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], courseTypes[i])
        }

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        // Turn off Next Gen Toggle
        LECatalogPage.turnOffNextgenToggle()
    })
    
    it('Create first online course', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create Online course
        cy.createCourse('Online Course', ocDetails.courseName)
        
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Create second online course', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create Online course
        cy.createCourse('Online Course', ocDetails.courseName2)
        
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Create third online course', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create Online course
        cy.createCourse('Online Course', ocDetails.courseName3)
        
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Create ILC course', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create Online course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)
        
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Create Curriculum course complete course', ()=> {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Curriculum', currDetails.courseName)
        
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName,ocDetails.courseName2,ocDetails.courseName3,ilcDetails.courseName])

        cy.publishCourseAndReturnId().then((id) => {
            // commonDetails.courseID = id.request.url.slice(-36)
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users'), { timeout: 10000 }).should('be.visible').click()
        // Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')

        cy.get(LEDashboardPage.getCoursePlayerCourse()).contains(ocDetails.courseName).click()

        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LEDashboardPage.getCoursePlayerActionBtn()).click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(LEDashboardPage.getToastNotificationMsg()).contains('You have been successfully enrolled.').should('be.visible')

        cy.get(LEDashboardPage.getLeaderboardPoint()).contains('10 Leaderboard Points').should('be.visible')
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LEDashboardPage.getCrossBtn()).click()

        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(LEDashboardPage.getCoursePlayerActionBtn()).contains('View').should('be.visible')

        cy.get(LEDashboardPage.getCrossBtn()).click()

        cy.get(LEDashboardPage.getCoursePlayerCompletedCourseNum()).should('contain','1/4 Courses')

        cy.get(LEDashboardPage.getCoursePlayerCompletedPercent()).should('contain','25%')
    })

    it('Enroll user with ILC Course', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username],ilcDetails.sessionName)
    })

    it('ILC Course Mark Attendance', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)

        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARDashboardPage.getGridTableColumnCourseName(ilcDetails.courseName)).should('be.visible')
    
        cy.get(ARDashboardPage.getGridTable(), {timeout:10000}).eq(0).click() 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).click()

        cy.get(ARDashboardPage.getMarkAttendanceClassBtn()).eq(2).click()
        cy.get(ARDashboardPage.getMarkAttendanceSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    })

    it('Curriculum course details course player', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')

        cy.get(LEDashboardPage.getCoursePlayerCompletedCourseNum()).should('contain','2/4 Courses')

        cy.get(LEDashboardPage.getCoursePlayerCompletedPercent()).should('contain','50%')
    })

    it('Second user curriculum course complete', () => {
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username2]) 

        ARDashboardPage.getUsersReport()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')

        cy.get(LEDashboardPage.getCoursePlayerCourse()).contains(ocDetails.courseName2).click()
        
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LEDashboardPage.getCoursePlayerActionBtn()).click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(LEDashboardPage.getToastNotificationMsg()).contains('You have been successfully enrolled.').should('be.visible')

        cy.get(LEDashboardPage.getLeaderboardPoint()).contains('10 Leaderboard Points').should('be.visible')
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LEDashboardPage.getCrossBtn()).click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(LEDashboardPage.getCoursePlayerActionBtn()).contains('View').should('be.visible')

        cy.get(LEDashboardPage.getCrossBtn()).click()
        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')

        cy.get(LEDashboardPage.getCoursePlayerCourse()).contains(ocDetails.courseName3).click()

        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LEDashboardPage.getCoursePlayerActionBtn()).click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(LEDashboardPage.getToastNotificationMsg()).contains('You have been successfully enrolled.').should('be.visible')

        cy.get(LEDashboardPage.getLeaderboardPoint()).contains('10 Leaderboard Points').should('be.visible')
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LEDashboardPage.getCrossBtn()).click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(LEDashboardPage.getCoursePlayerActionBtn()).contains('View').should('be.visible')

        cy.get(LEDashboardPage.getCrossBtn()).click()

        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    
        cy.get(LEDashboardPage.getCoursePlayerCompletedCourseNum()).should('contain','2/4 Courses')

        cy.get(LEDashboardPage.getCoursePlayerCompletedPercent()).should('contain','50%')
    })

    it('Curriculum course enrollments progress reports', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

        ARDashboardPage.AddFilter('Name', 'Contains', currDetails.courseName)

        // Select the curriculum
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
         
        // Click on Course Enrollments
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()

        cy.get(ARDashboardPage.getIlcReportProgress()).eq(0).should('contain','50')
        cy.get(ARDashboardPage.getIlcReportProgress()).eq(1).should('contain','50')
    })

    it('Edit OC Course as Inactive', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        cy.editCourse(ocDetails.courseName)

        cy.get(ARDashboardPage.getGeneralStatus()).scrollIntoView()
        cy.get(ARDashboardPage.getGeneralStatus()).click({force:true})
    })

    it('Curriculum course enrollments progress reports', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

        ARDashboardPage.AddFilter('Name', 'Contains', currDetails.courseName)
         
        // Select the curriculum
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
         
        // Click on Course Enrollments
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()

        cy.get(ARDashboardPage.getIlcReportProgress()).eq(0).should('contain','50')
        cy.get(ARDashboardPage.getIlcReportProgress()).eq(1).should('contain','50')
    })

    it('Edit oc course active', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        cy.editCourse(ocDetails.courseName)

        cy.get(ARDashboardPage.getGeneralStatus()).scrollIntoView()
        cy.get(ARDashboardPage.getGeneralStatus()).click({force:true})
    })

    it('Curriculam course enrollments progress reports', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

         ARDashboardPage.AddFilter('Name', 'Contains', currDetails.courseName)

        // Select the curriculum
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
         
        // Click on Course Enrollments
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()

        cy.get(ARDashboardPage.getIlcReportProgress()).eq(0).should('contain','50')
        cy.get(ARDashboardPage.getIlcReportProgress()).eq(1).should('contain','50')
    })
})