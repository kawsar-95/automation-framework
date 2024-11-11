import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARPermissionsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPermissionsModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import arBasePage from "../../../../../../helpers/AR/ARBasePage"
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"


describe('C2080 - Reports - Display number of associated courses and enrollments in Credit Types Report', () => {
    let creditTypeNames = []
    beforeEach('Before activity',() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,  users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after('Delete this associted course', () => {
        cy.deleteCourse(commonDetails.courseID)

    })

    it('Add two Credit Types to test later steps', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        ARDashboardPage.getVLongWait()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types')).click()
        ARDashboardPage.getLongWait()        
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Credit Type')).click()
        ARDashboardPage.getShortWait()
        let creditTypeName = `${miscData.guia_credit_1_name} - ${new arBasePage().getTimeStamp()}`
        cy.get(ARDashboardPage.getTxtF()).type(creditTypeName)
        ARDashboardPage.getShortWait()
        cy.get(arCoursesPage.getSaveBtn()).click()    
        cy.get(arCoursesPage.getSaveBtn()).invoke('show').click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text','Credit type has been created.')
        creditTypeNames.push(creditTypeName)

        ARDashboardPage.getMediumWait()
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Credit Type')).click()
        ARDashboardPage.getShortWait()
        creditTypeName = `${miscData.guia_credit_2_name} - ${new arBasePage().getTimeStamp()}`
        cy.get(ARDashboardPage.getTxtF()).type(creditTypeName)
        ARDashboardPage.getShortWait()
        cy.get(arCoursesPage.getSaveBtn()).click()
        arCoursesPage.getMediumWait()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text','Credit type has been created.')
        ARDashboardPage.getShortWait()
        creditTypeNames.push(creditTypeName)
    })

    it('Create a Course and Associated it with the newly created credit type', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', ocDetails.courseName)
        ARDashboardPage.getShortWait();
        // Added multiple cradit 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click();
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click();
        
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click();
        // Select the Credit dropdown box to be able to type in the box
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click();
        // Type the credit type in the box and select the matching credit type in the list
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeSelections()).get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(creditTypeNames[0]).click();
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).type(creditTypeNames[0]);
        ARDashboardPage.getLongWait();
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()
        // Select Allow Enrollment All learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish this course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getLongWait()
    })

    it('Enroll User for the newly created course and Associate it with credit type', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getLongWait()
        // Filter this course
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        ARDashboardPage.getMediumWait()

        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        // Assert that the Users dropdown is blank
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).should('be.empty')
        // Search a user to enroll
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(users.learner01.learner_01_username)
        AREnrollUsersPage.getEnrollUsersOpt(users.learner01.learner_01_username)
        ARDashboardPage.getShortWait()
        // Save to enroll the user
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()

    })

    it('Verify that an Admin can NOT delete a credit type when it is associated with a course or enrollment', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        ARDashboardPage.getLongWait()
        ARDashboardPage.getMediumWait()
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types')).click()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.AddFilter('Name', 'Contains', creditTypeNames[0]))
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        // Click on delete button
        cy.get(ARDashboardPage.getDeleteCreditBtn()).click()
        // Asserting can not able to delete and show this message 
        cy.get(ARPermissionsModal.getModelHeader()).should('contain', 'Cannot Delete Credit Type')
        ARDashboardPage.getMediumWait()
        cy.get(ARPermissionsModal.getModalCloseBtn()).click()
    })

    it('Verify that an Admin can delete a credit type when it is NOT associated with a course or enrollment', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        ARDashboardPage.getLongWait()
        ARDashboardPage.getMediumWait()
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Manage Credit Types')).click()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.AddFilter('Name', 'Contains', creditTypeNames[1]))
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        // Click on delete button
        cy.get(ARDashboardPage.getActionBtnByLevel()).contains('Delete').click()
        // Asserting can able to delete and show this message 
        cy.get(ARPermissionsModal.getPromptHeader()).should('contain', 'Delete Credit Type')
        ARDashboardPage.getMediumWait()
        cy.get(ARPermissionsModal.getConfirmDeleteBtn()).click()
        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Credit Type has been deleted.')
    })
})