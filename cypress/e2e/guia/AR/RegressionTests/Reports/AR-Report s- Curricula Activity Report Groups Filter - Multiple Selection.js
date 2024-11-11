import ARReportsPage from "../../../../../../helpers/AR/pageObjects/ARReportsPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGroupAddEditPage from "../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARGroupPage from "../../../../../../helpers/AR/pageObjects/User/ARGroupPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { groupDetails } from "../../../../../../helpers/TestData/Groups/groupDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-539 - C1987 - GUIA-Story - NLE-2477 - Curricula Activity Report Groups Filter - Multiple Selection', () => {
    after('Delete Course, Users, Groups', () => {
        cy.deleteCourse(commonDetails.courseID, 'curricula') 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
       
        cy.get(ARDashboardPage.getWaitSpinner() , { timeout:15000 }).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
        
        ARGroupPage.deleteGroups([groupDetails.groupName, groupDetails.groupName2])
    })

    it('Create First Group', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        ARDashboardPage.getGroupsReport()
        // Add Group button should be visible at the right sidebar
        cy.get(ARReportsPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')
        // Create Group with Valid Name
        cy.get(ARGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)
        // Group creation should be defaulted to Manual
        ARGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        cy.get(ARGroupAddEditPage.getUserProperty()).find(ARGroupAddEditPage.getUsersDDownField()).click()
        cy.get(ARGroupAddEditPage.getUsersDDownSearchTxtF()).type(userDetails.username)
        cy.get(ARGroupAddEditPage.getUsersDDownOpt()).contains(userDetails.lastName).click()
        cy.get(ARGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Save Group
        cy.get(ARGroupAddEditPage.getSaveBtn()).click()
        cy.get(ARGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it('Create Second Group', () => {
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        ARDashboardPage.getGroupsReport()
        // Add Group button should be visible at the right sidebar
        cy.get(ARReportsPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')
        // Create Group with Valid Name
        cy.get(ARGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName2)
        // Group creation should be defaulted to Manual
        ARGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        cy.get(ARGroupAddEditPage.getUserProperty()).find(ARGroupAddEditPage.getUsersDDownField()).click()
        cy.get(ARGroupAddEditPage.getUsersDDownSearchTxtF()).type(userDetails.username2)
        cy.get(ARGroupAddEditPage.getUsersDDownOpt()).contains(userDetails.lastName).click()
        cy.get(ARGroupAddEditPage.getWaitSpinner()).should('not.exist')

        // Save Group
        cy.get(ARGroupAddEditPage.getSaveBtn()).click()
        cy.get(ARGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it('Create Curriculum and Enroll users', () => {
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Curriculum', currDetails.courseName)
        cy.get(ARILCSessionReportPage.getCancelBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username, userDetails.username2])
    })

    it('Assert Add Filter Group item', () => {
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        ARDashboardPage.getCurriculaActivityReport()
        ARCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)

        ARCurriculaActivityReportPage.AddGroupFilter(groupDetails.groupName)
  
        cy.get(ARDashboardPage.getGridTable()).eq(0).should('exist')
        cy.get(ARGroupAddEditPage.getFilterEdit()).should('contain', '1 selected')

        ARCurriculaActivityReportPage.AddGroupFilter(groupDetails.groupName2)
        cy.get(ARDashboardPage.getGridTable()).eq(1).should('exist')
        cy.get(ARGroupAddEditPage.getFilterEdit()).should('contain', '2 selected')

        cy.get(ARCurriculaActivityReportPage.getFilteredLabel()).click()
        cy.get(ARGroupAddEditPage.getFilterEdit()).contains('2 selected').should('not.exist')

        cy.get(ARDashboardPage.getAddFilterBtn()).click()
        cy.get(ARCurriculaActivityReportPage.getFilterContainer()).should('exist')
        cy.get(ARDashboardPage.getSubmitCancelFilterBtn()).click()
        cy.get(ARCurriculaActivityReportPage.getFilterContainer()).should('not.exist')
    })
})