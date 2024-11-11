import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import {userDetails, generalSectionFieldNames}  from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from "../../../../../../helpers/TestData/users/users";
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage";
import ARUpdateScriptPage from "../../../../../../helpers/AR/pageObjects/UpdateScript/ARUpdateScriptPage";

describe('MT-10722 - Delete user with deleted by check', () => {

    before('Add a User and click on the save button', () => {
        
        //Log in as a system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");

        AdminNavationModuleModule.navigateToUsersPage()
        
        //Get User Id
        cy.wrap(ARUserPage.editUser(generalSectionFieldNames.username, users.sysAdmin.admin_sys_01_username))
        ARDashboardPage.getLongWait()
        cy.url().then((currentUrl) => { 
            users.sysAdmin.admin_sys_01_id = currentUrl.slice(-36) 
        })

        AdminNavationModuleModule.navigateToUsersPage()
        ARDashboardPage.getLongWait()

        //Create user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        //Get User Id
        cy.wrap(ARUserPage.editUser(generalSectionFieldNames.username, userDetails.username))
        ARDashboardPage.getLongWait()
        cy.url().then((currentUrl) => { 
            userDetails.userID = currentUrl.slice(-36) 
        })

        cy.wrap(AdminNavationModuleModule.navigateToUsersPage())
        ARDashboardPage.getLongWait()

        //Delete User
        cy.wrap(ARUserPage.deleteUser(generalSectionFieldNames.username, userDetails.username))
        ARDashboardPage.getLongWait()
    })

    it('Deleted by check deleted for user', () => {
        //Log in as Blatant admin
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')

        //Go to UpdateScriptPage
        ARDashboardPage.getLongWait()
        cy.visit(ARUpdateScriptPage.getUpdateScriptUrlExtension())

        //Run Get Deleted By User Id
        ARDashboardPage.getLongWait()
        ARUpdateScriptPage.getDeletedByUserId(userDetails.userID, "User")
        
        //wait till redirected to new page
        ARDashboardPage.getLongWait()
        cy.get('body').should('contain', users.sysAdmin.admin_sys_01_id)
    })
})