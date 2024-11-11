import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arReportPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import A5LeaderboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { others, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import ARGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import A5ClientsPage from '../../../../../../helpers/AR/pageObjects/Setup/A5ClientsPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C7356 AUT-713, AR - Regression - Groups - View user a Group (cloned)', function () {
    before(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()
        cy.get(arReportPage.getPageHeaderTitle()).should('have.text', "Groups")

        // Create a Group
        cy.get(arReportPage.getAddEditMenuActionsByName('Add Group')).find('span').click()
    
        cy.get(arGroupAddEditPage.getNameTxtF()).type('a').clear()
        cy.get(arGroupAddEditPage.getNameErrorMsg()).should('have.text', miscData.field_required_error)

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)
        cy.get(arGroupAddEditPage.getDepartmentBtn()).click()

        // Select Department
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Select Users
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        arDashboardPage.getShortWait()

        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`).click()

        // Save Group
        arGroupAddEditPage.getShortWait()
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        arGroupAddEditPage.getShortWait()
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getGroupsReport()
    })

    after(() => {
        // Delete Groups
        
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        arDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getMediumWait()

        // Delete Users
        arDashboardPage.getUsersReport()

        arDashboardPage.AddFilter('Username', 'Contains', userDetails.username) 
        arDashboardPage.AddFilter('Username', 'Contains', 'GUIA-User-Import 1')
        arDashboardPage.AddFilter('Username', 'Contains', 'GUIA-User-Import 2')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Row Select Options')).click({ force: true })
        cy.get(arDashboardPage.getElementByDataNameAttribute('select-page')).click()
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Users')).should('have.attr','aria-disabled','false').click()
        cy.get(arDashboardPage.getElementByDataNameAttribute('confirm')).click()
    })

    it('Select Existing group, Add User and Import User', () => {
        arGroupAddEditPage.AddFilter('Name', 'Starts With', groupDetails.groupName)
        arDashboardPage.getMediumWait()

        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()

        // click on View user button
        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('View Users'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('View Users')).click()
        arDashboardPage.getMediumWait()

        // Verify User page should be displayed
        cy.get(arReportPage.getPageHeaderTitle()).should('have.text', "Users")

        // Click on add user button
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        arDashboardPage.getMediumWait()

        // Verify Add user Page should be displayed
        cy.get(arReportPage.getPageHeaderTitle()).should('have.text', "Add User")

        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        ARUserAddEditPage.getLongWait()
        //Save user
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        ARUserAddEditPage.getLongWait()
        //Toast Notifications will display "Is Active saved" and "User has been created"
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        ARUserAddEditPage.getMediumWait()

        // Verify User page should be displayed
        cy.get(arReportPage.getPageHeaderTitle()).should('have.text', "Users")

        // Click on User Import button
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('User Import')).click()
        arDashboardPage.getMediumWait()

        // Verify Add user Page should be displayed
        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'User Import')

        cy.get(arGroupAddEditPage.getUserImportChooseFileBtn()).click()
        arDashboardPage.getShortWait()

        // Check if Upload File pop up is opened
        cy.contains('Upload File').should('be.visible')

        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getInputFileTxtF()).attachFile(resourcePaths.resource_user_import_csv_file + others.user_import_csv_filename)
        arDashboardPage.getMediumWait()

        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        arDashboardPage.getMediumWait()

        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'User Import')

        cy.get(ARGroupAddEditPage.getLMSUserName()).find('select').select('First Name')
        arDashboardPage.getShortWait()

        cy.wrap(A5ClientsPage.getA5ClientPageSidebar('Validate'))
        arDashboardPage.getMediumWait()

        cy.wrap(A5ClientsPage.getA5ClientPageSidebar('Load'))
        arDashboardPage.getMediumWait()

        // cy.get(ARGroupAddEditPage.getImportInProgressOkBtn()).click()
        arDashboardPage.getMediumWait()
    })

    it('Select Existing group, Add User and Import User', () => {
        arGroupAddEditPage.AddFilter('Name', 'Starts With', groupDetails.groupName)
        arDashboardPage.getMediumWait()

        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()
        arDashboardPage.getShortWait()

        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Edit Group')).click()
        arDashboardPage.getMediumWait()

        // Select Users
        cy.get(arGroupAddEditPage.getUserProperty()).find(arGroupAddEditPage.getUsersDDownField()).click()
        arDashboardPage.getShortWait()

        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).type(`${userDetails.firstName} ${userDetails.lastName}`)
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`${userDetails.firstName} ${userDetails.lastName}`).click()
        arDashboardPage.getShortWait()

        cy.get(arGroupAddEditPage.getUsersDDownSearchTxtF()).clear().type(`GUIA-User-Import`)

        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`GUIA-User-Import 1`).click()
        cy.get(arGroupAddEditPage.getUsersDDownOpt()).contains(`GUIA-User-Import 2`).click()

        // Save Group
        arGroupAddEditPage.getShortWait()
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        arGroupAddEditPage.getShortWait()
    })
})

