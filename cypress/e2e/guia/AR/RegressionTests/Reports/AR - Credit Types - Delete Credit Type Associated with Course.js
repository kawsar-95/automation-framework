import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARPermissionsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPermissionsModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { creditDetails } from '../../../../../../helpers/TestData/Credittype/creditDetails'
import ARBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'

describe('C2075 - Credit Type - Delete credit type associated with course or enrollment', () => {
    beforeEach('Login as an Admin',() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password,'/admin')
        ARDashboardPage.getMediumWait()
    })
    
    after('Delete newly created course and the credit type as part of clean-up',() => {
        // Delete the course
        cy.deleteCourse(commonDetails.courseID)
        
        // Delete the credit type
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        cy.intercept('/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')
        // ARDashboardPage.getLongWait()
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types')).click()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.AddFilter('Name', 'Contains', creditDetails.credittype2))
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getActionBtnByLevel()).contains('Delete').click()
        // Asserting can able to delete and show this message 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
    })

    it('Verify that an Admin is able to delete a credit type not used in a course or enrolment', () => {
        // Navigate to the Credit report page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getShortWait()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        cy.intercept('/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')
        // Navigate to Manage Credit Types page
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types')).click()
        ARDashboardPage.getLongWait()
        // Add a new Credit Type
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Credit Type')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getTxtF()).type(creditDetails.credittype1)
        ARDashboardPage.getShortWait()
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getShortWait()
        // Assert that the new Credit Type has been created
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text','Credit type has been created.')
        ARDashboardPage.getMediumWait()

        // Filter the newly credit type, which is not yet associated with any Courses or enrollments
        cy.wrap(ARDashboardPage.AddFilter('Name', 'Contains', creditDetails.credittype1))
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        // Click on delete button
        cy.get(ARDashboardPage.getActionBtnByLevel()).contains('Delete').click()        
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        // Asser that the credit type is deleted as it was not associted with any courses/enrollments
        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Credit Type has been deleted.')       
    })

    it('Verify that an admin is unable to delete a credit type used in a course', () => {
        // Navigate to the Credit report page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        cy.intercept('/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')
        // Navigate to Manage Credit Types page
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types')).click()
        ARDashboardPage.getLongWait()
        // Add a another Credit Type
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Credit Type')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getTxtF()).type(creditDetails.credittype2)
        ARDashboardPage.getShortWait()
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text','Credit type has been created.')
        ARDashboardPage.getMediumWait()

        // Navigate to the Course page to creaet a new Course using the new credit type
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        // Create an online course
        cy.createCourse('Online Course')
        ARDashboardPage.getShortWait()

        // Go to the Completion section and add the credit type
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()        
        // Type the credit type in the box and select the matching credit type in creted list
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeSelections()).get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(creditDetails.credittype2).click()
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).clear().type(20) 
        ARDashboardPage.getMediumWait()
        // Capture the course id and store
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getLongWait()

        // Assert that an admin is unable to delete a credit type when used in a course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        ARDashboardPage.getLongWait()
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types')).click()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.AddFilter('Name', 'Contains', creditDetails.credittype2))
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getActionBtnByLevel()).contains('Delete').click()
        // Assert that an Admin is unable to delete, a message is displayed
        cy.get(ARPermissionsModal.getModalTitle()).should('contain', 'Cannot Delete Credit Type')
        ARDashboardPage.getMediumWait()
        cy.get(ARPermissionsModal.getBtn()).contains("Close").click()
        ARDashboardPage.getShortWait()
    })
})