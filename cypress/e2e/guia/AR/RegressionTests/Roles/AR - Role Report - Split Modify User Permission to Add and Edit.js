
import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C2015 AUT-559 GUIA-Story - NLE-2562 - Roles - Split Modify User Permission to Add and Edit', () => {
    it("create a Custom Roles and press cancel on the modal", () => {
        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', users.sysAdmin.admin_sys_01_full_name)
        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
        //Adding Instructor Led Course Permissions
        //Adding Session Add permissions
        ARRolesAddEditPage.getSelectCheckboxSubMenuBySectionNameAndIndexNumber('courses', 0, 'Sessions')
        //Asserting that Modify and its sub menu permissions are auto selected and Disabled
        cy.get(ARRolesAddEditPage.getSelectBySectionName('courses') + ' ' + ARRolesAddEditPage.getCheckboxContainer()).eq(0).within(() => {
            //There is no other way thats why eq is used
            cy.get(ARRolesAddEditPage.getModifyBtn()).eq(1).siblings('div').find('input').should('have.attr', 'aria-checked', 'true').and('have.attr' ,  'aria-disabled' , 'true')
            //This is very specific section thats why eq is used 
            cy.get(ARRolesAddEditPage.getSubSection()).eq(3).within(() => {
                //Checkbox is marked and disabled
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Details').siblings('div').find('input').should('have.attr', 'aria-checked', 'true').and('have.attr' ,  'aria-disabled' , 'true')
                //Checkbox is marked and disabled
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Enrollments').siblings('div').find('input').should('have.attr', 'aria-checked', 'true').and('have.attr' ,  'aria-disabled' , 'true')
                //Checkbox is marked and disabled
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Attributes').siblings('div').find('input').should('have.attr', 'aria-checked', 'true').and('have.attr' ,  'aria-disabled' , 'true')
            })

        })

        //Clicking on the deselect all button 
        cy.get(ARRolesAddEditPage.getCourseDeselectAllCheckBox()).click()

        //Clicking on the modify permissions button
        cy.get(ARRolesAddEditPage.getSelectBySectionName('courses') + ' ' + ARRolesAddEditPage.getCheckboxContainer()).eq(0).within(() => {
            //There is no other way thats why eq is used
            cy.get(ARRolesAddEditPage.getModifyBtn()).eq(1).click()
            cy.get(ARRolesAddEditPage.getModifyBtn()).eq(1).siblings('div').find('input').should('have.attr', 'aria-checked', 'true')
            //This is very specific section thats why eq is used 
            cy.get(ARRolesAddEditPage.getSubSection()).eq(3).within(() => {
                //Checkbox is marked 
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Details').siblings('div').find('input').should('have.attr', 'aria-checked', 'true')
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Details').click()
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Details').siblings('div').find('input').should('have.attr', 'aria-checked', 'false')
                //Checkbox is marked 
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Enrollments').siblings('div').find('input').should('have.attr', 'aria-checked', 'true')
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Enrollments').click()
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Enrollments').siblings('div').find('input').should('have.attr', 'aria-checked', 'false')
                //Checkbox is marked 
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Attributes').siblings('div').find('input').should('have.attr', 'aria-checked', 'true')
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Attributes').click()
                cy.get(ARRolesAddEditPage.getCheckboxRadioBtn()).contains('Attributes').siblings('div').find('input').should('have.attr', 'aria-checked', 'false')
            })

        })




    })

})

