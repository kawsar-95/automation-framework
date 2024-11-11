import { users } from "../../../../../../helpers/TestData/users/users"
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import ARUpdateScriptPage from "../../../../../../helpers/AR/pageObjects/UpdateScript/ARUpdateScriptPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import {generalSectionFieldNames}  from '../../../../../../helpers/TestData/users/UserDetails'

describe('MT-10722 - Delete course with deleted by check', () => {

    beforeEach('Create course and delete the course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
        AdminNavationModuleModule.navigateToUsersPage()
        
        //Get User Id
        cy.wrap(ARUserPage.editUser(generalSectionFieldNames.username, users.sysAdmin.admin_sys_01_username))
        ARDashboardPage.getLongWait()
        cy.url().then((currentUrl) => { 
            users.sysAdmin.admin_sys_01_id = currentUrl.slice(-36) 
        })

        ARDashboardPage.getLongWait()
        AdminNavationModuleModule.navigateToCoursesPage()

        // Create an online course
        cy.createCourse('Online Course')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        //Find the online course and select
        cy.deleteCourse(commonDetails.courseID)
        ARDashboardPage.getShortWait()
    })

    it('Deleted by check for course', () => {
        //Log in as Blatant admin
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')

        //Go to UpdateScriptPage
        ARDashboardPage.getLongWait()
        cy.visit(ARUpdateScriptPage.getUpdateScriptUrlExtension())

        //Run Get Deleted By User Id
        ARDashboardPage.getLongWait()
        ARUpdateScriptPage.getDeletedByUserId(commonDetails.courseID, "Course")
        
        //wait till redirected to new page
        ARDashboardPage.getLongWait()
        cy.get('body').should('contain', users.sysAdmin.admin_sys_01_id)
    })
})