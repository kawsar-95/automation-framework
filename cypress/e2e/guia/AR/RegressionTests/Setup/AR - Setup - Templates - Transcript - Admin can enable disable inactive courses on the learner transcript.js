import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARTemplatesReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { adminRoles, userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'

describe("C7515 AUT-794, AR - Setup - Templates - Transcript - Admin can enable disable inactive courses on the learner transcript", function () {
    it('Create admin role User', function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()

        //Add new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        
        //turn Admin toggle ON
        ARUserAddEditPage.setAdminToggle('true')

        //Verify toggle ON Message
        cy.get(ARUserAddEditPage.getToggleDescriptionBanner()).should('contain', ARUserAddEditPage.getAdminToggleOnMsg())

        //Setup user management and select all admin roles
        cy.get(ARUserAddEditPage.getUserManagementRadioBtn()).contains('All').click()
        cy.get(ARUserAddEditPage.getRolesDDown()).click()

        cy.get(ARUserAddEditPage.getRolesDDownSearchTxtF()).type(adminRoles.admin) 
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARUserAddEditPage.getRolesDDownOpt()).contains(new RegExp(`^(${adminRoles.admin})$`, "g")).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'Users')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    })

    it('Templates will not be shown for admin role', function () {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByName('Manage Template').should('not.exist')

        LESideMenu.getLEMenuItemsByNameThenClick('Admin')
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        cy.get(ARDashboardPage.getMenuItem()).contains(/^Templates$/).should('not.exist')
    })

    it('Create System Admin role User', function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()

        //Add new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username2)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        
        //turn Admin toggle ON
        ARUserAddEditPage.setAdminToggle('true')

        //Verify toggle ON Message
        cy.get(ARUserAddEditPage.getToggleDescriptionBanner()).should('contain', ARUserAddEditPage.getAdminToggleOnMsg())

        //Setup user management and select all admin roles
        cy.get(ARUserAddEditPage.getUserManagementRadioBtn()).contains('All').click()
        cy.get(ARUserAddEditPage.getRolesDDown()).click()

        cy.get(ARUserAddEditPage.getRolesDDownSearchTxtF()).type(adminRoles.systemAdmin) 
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARUserAddEditPage.getRolesDDownOpt()).contains(adminRoles.systemAdmin).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'Users')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    })

    it('Edit Templates', function () {
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        ARDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        ARDashboardPage.getShortWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()
        ARDashboardPage.getShortWait()

        // enable toggle
        ARTemplatesReportPage.setCheckboxValue('true', ARTemplatesReportPage.getShowInactiveCoursesToggleCheckbox())

        // Save Changes
        ARTemplatesReportPage.saveProfile()

        // Navigate to Admin 
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Admin')
        ARDashboardPage.getTemplatesReport()

        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.dept_top_name)
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getA5TableCellRecord()).contains(departments.dept_top_name).click()
        ARDashboardPage.getShortWait()

        cy.get(ARTemplatesReportPage.getTemplateEditIcon()).click()
        ARDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        ARDashboardPage.getShortWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()
        ARDashboardPage.getShortWait()

        // Verify Value persist
        cy.get(ARTemplatesReportPage.getShowInactiveCoursesToggleCheckbox()).should('have.value', 'true')

        // Disable toggle
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowInactiveCoursesToggleCheckbox())

        // Save Changes
        ARTemplatesReportPage.saveProfile()

        // Return to the Admin Dashboard and Verify toggle disabled
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Admin')
        ARDashboardPage.getTemplatesReport()

        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.dept_top_name)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecord()).contains(departments.dept_top_name).click()
        ARDashboardPage.getShortWait()

        cy.get(ARTemplatesReportPage.getTemplateEditIcon()).click()
        ARDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        ARDashboardPage.getShortWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()
        ARDashboardPage.getShortWait()

        // Verify retain it's setting
        cy.get(ARTemplatesReportPage.getShowInactiveCoursesToggleCheckbox()).should('have.value', 'false')
    })

    it("Add a Template and select sub-department", function () {
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword, '/admin')
        ARDashboardPage.getTemplatesReport()
        
        //Navigating to Add template Page
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getAddtemplateButton()).click()
        })
        ARDashboardPage.getShortWait()

        ARTemplatesReportPage.SearchAndSelectFunction([departments.Dept_E_name])
        ARDashboardPage.getShortWait()

        cy.get(ARTemplatesReportPage.getWarningBanner()).should('not.be.false')
        
        //Click on Add Template 
        cy.get(ARDashboardPage.gettemplateAddbutton()).click({ force: true })
        ARDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        ARDashboardPage.getShortWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()
        ARDashboardPage.getShortWait()
        
        // Verify Inheritance toggle enabled by default 
        cy.get(ARTemplatesReportPage.getInheritSettingsOfParentDepartmentCheckbox()).should('have.value', 'true')
        cy.get(ARTemplatesReportPage.getShowInactiveCoursesToggleCheckbox()).should('have.value', 'false')

        // "Show Inactive Courses on Transcript" will not be able to be edited
        cy.get(ARTemplatesReportPage.getProfileSettingsBlocker()).should('exist')

        // Turn off the Inheritance toggle
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getInheritSettingsOfParentDepartmentCheckbox())
        cy.get(ARTemplatesReportPage.getProfileSettingsBlocker()).should('not.exist')

        // enable the "Show Inactive Courses on Transcript"
        ARTemplatesReportPage.setCheckboxValue('true', ARTemplatesReportPage.getShowInactiveCoursesToggleCheckbox())

        // Save Changes
        ARTemplatesReportPage.saveProfile()

        // Return to the Admin Dashboard and Verify toggle disabled
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Admin')
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARTemplatesReportPage.getTemplatesPage()

        cy.get(ARDashboardPage.getA5TableCellRecord()).contains(departments.Dept_E_name).click()
        ARDashboardPage.getShortWait()

        cy.get(ARTemplatesReportPage.getTemplateEditIcon()).click()
        ARDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        ARDashboardPage.getShortWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()
        ARDashboardPage.getShortWait()

        // Verify Toggle retain it's setting
        cy.get(ARTemplatesReportPage.getShowInactiveCoursesToggleCheckbox()).should('have.value', 'true')
    })

    it("Delete Template ", function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to Templates
        ARDashboardPage.getTemplatesReport()

        // Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        LEDashboardPage.getLShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecord()).contains(departments.Dept_E_name).click()

        // Deleting Template
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getTemplateDeletebutton()).click()
        })
        cy.get(ARDeleteModal.getA5OKBtn()).click()

        //Clear All Filters 
        cy.get(ARTemplatesReportPage.getCLearAllFiltersButton()).click()
        ARDashboardPage.getShortWait()

        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        
        //Asserting Template was deleted
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })

    it("Delete users ", function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
    })
})