import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGroupAddEditPage from '../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { groupDetails } from '../../../../../../helpers/TestData/Groups/groupDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'

describe('C1923 AUT-482, AR - Groups Report - Create and Edit Automatic Group', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('should allow admin to create a group', () => {
        arDashboardPage.getGroupsReport()

        // "Add Group" button should be visible at the right sidebar
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Create Group with Valid Name
        cy.get(arGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)

        // Group creation should be defaulted to Manual
        arGroupAddEditPage.verifyAssignmentRadioBtn('Manual', 'true')

        // set Assignment Automatic
        cy.get(arGroupAddEditPage.getAssignmentRadioBtn()).contains('Automatic').click()
        arGroupAddEditPage.verifyAssignmentRadioBtn('Automatic', 'true')

        // a message is displayed as expected
        cy.get(arGroupAddEditPage.getRulesPlaceholder()).should('contain', 'There are no rule filters set - no users will be affected.')

        // Verify that One or More Rules can be Added
        cy.get(arGroupAddEditPage.getAddRuleBtn()).should('be.visible').click()
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getFirstRulesContainer()),'First Name','Contains',users.learner01.learner_01_fname)

        //Add second availabilty rule
        cy.get(ARGlobalResourcePage.getAddRuleBtn()).click()
        // Add an avialabilit rules
        ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getSecondRulesContainer()),'First Name','Equals',users.learner02.learner_02_fname)

        // Save Group
        cy.get(arGroupAddEditPage.getSaveBtn()).should('not.have.attr', 'aria-disabled')
        cy.get(arGroupAddEditPage.getSaveBtn()).click()
        cy.get(arGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it('Newly created group can be used as part of the availability rules', () => {
        arDashboardPage.getCoursesReport()

        cy.createCourse('Online Course')

        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')

        // newly created group can be used as part of the availability rules
        cy.get(ARCourseSettingsEnrollmentRulesModule.getGroupIdsDDown()).click({force:true})
        cy.get(ARCourseSettingsEnrollmentRulesModule.getGroupIdsDDownSearchF()).type(groupDetails.groupName)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getGroupIdsDDownOpt()).contains('li', groupDetails.groupName).click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getGroupIdsDDownOpt()).contains('li', groupDetails.groupName).should('have.attr', 'aria-selected', 'true')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getGroupIdsDDown()).click({force:true})
        cy.get(ARCourseSettingsEnrollmentRulesModule.getGroupIdsDDown()).find(ARCoursesPage.getLabel()).should('contain', groupDetails.groupName)

        //Specify First Name to Use For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'Group', groupDetails.groupName)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
    })

    it('Newly created group can be used within user management to assign to a given Admin', () => {
        arDashboardPage.getUsersReport()

        //Add new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Add User')

        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        
        // turn Admin toggle ON
        arDashboardPage.generalToggleSwitch('true' , ARUserAddEditPage.getAdminToggleContainer())

        //Setup user management and select Group admin roles
        cy.get(ARUserAddEditPage.getUserManagementRadioBtn()).contains('Group').click()

        // newly created group can be used within user management to assign to a given Admin
        cy.get(ARUserAddEditPage.getManagedGroupDDown()).should('be.visible').click()
        cy.get(ARUserAddEditPage.getManagedGroupDDownSearchF()).type(groupDetails.groupName)
        cy.get(ARUserAddEditPage.getManagedGroupDDownOpt()).contains('li', groupDetails.groupName).click()
        cy.get(ARUserAddEditPage.getManagedGroupDDownOpt()).contains('li', groupDetails.groupName).should('have.attr', 'aria-selected', 'true')
        cy.get(ARUserAddEditPage.getManagedGroupDDown()).find(ARCoursesPage.getLabel()).should('contain', groupDetails.groupName)
    })

    it('should allow admin to delete a group', () => {
        arDashboardPage.getGroupsReport()

        // Search and delete Groups
        arGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(arGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()

        cy.wrap(arGroupAddEditPage.WaitForElementStateToChange(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(arGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(arDeleteModal.getARDeleteBtn()).should('not.exist')
    })
})

