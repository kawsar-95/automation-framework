import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGroupAddEditPage from "../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage"
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARFileManagerUploadsModal from "../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import A5CustomFieldsPage, { customField } from "../../../../../../helpers/AR/pageObjects/PortalSettings/A5CustomFieldsPage"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { lessonObjects, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { groupDetails } from "../../../../../../helpers/TestData/Groups/groupDetails"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"


let renamedFileName = ARFileManagerUploadsModal.getRenamedFileName()
const fieldName = customField.customFieldName
describe('C7338 - AUT-704 - Flexco - Availability Rules - Cannot Set Equals Not Set for Availability Rules', () => {
    it(`Admin can create a new custom bolean filed named ${customField.customFieldName}`, () => {
        //Signin as an admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()

        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        //Clicking on custom fields
        cy.get(ARDashboardPage.getCustomFieldsTab()).should('have.text', 'Custom Fields').click()

        //Clicking on Add Field button
        cy.get(A5CustomFieldsPage.getAddFieldBtn()).contains("Add Field").click()
        //Finding the lenth of the li element 
        cy.get(A5CustomFieldsPage.getCustomFieldContainer()).its('length').as('index')

        cy.get('@index').then(($val) => {
            //Asserting last container is visible 
            cy.get(A5CustomFieldsPage.getCustomFieldContainer()).eq($val - 1).should('be.visible')

            cy.get(A5CustomFieldsPage.getCustomFieldContainer()).eq($val - 1).within(() => {
                //Typing the name 
                cy.get(A5CustomFieldsPage.getCustomFieldMainDiv()).find('input').first().clear().type(customField.customFieldName)
                //Clicking on the dropdown 
                cy.get(A5CustomFieldsPage.getCustomFieldMainDiv()).within(() => {
                    cy.get(A5CustomFieldsPage.getMainDivDropDown()).first().click()

                })
            })

        })
        //Selecting 'True/False' from the dropdown
        A5CustomFieldsPage.getSelectOption('True/False')
        //Clicking on the save button
        A5CustomFieldsPage.getSaveBtn().click()
        //Asserting that its been saved and moved to another location
        cy.url({ timeout: 15000 }).should('include', '/Admin/Clients')

    })

    it(`Create Billboard and add Rule as ${customField.customFieldName}`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()

        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")

        // Verify that the default value is "Active" when creating a new billboard
        ARDashboardPage.generalToggleSwitch('true', ARBillboardsAddEditPage.getGeneralPublishedToggleContainer())

        // enter valid title
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)

        // enter valid description
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).clear()
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

        // Verify Admin will be the default author
        cy.get(ARBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)

        //Upload an image and rename it to prevent the same name conflict.
        ARFileManagerUploadsModal.renameAndSelectUploadedFile('Image', miscData.billboard_01_filename, renamedFileName)

        // Specifying availability rules should be possible
        cy.get(ARBillboardsAddEditPage.getAvailabilityAddRuleBtn()).click()

        // verify Availability Rules
        cy.get(ARBillboardsAddEditPage.getFirstRulesContainer()).within(() => {
            cy.get(ARBillboardsAddEditPage.getRuleDropDownBtn()).eq(0).click()

            cy.get(ARBillboardsAddEditPage.getRuleDropDownOptions()).contains(customField.customFieldName).click()
            cy.get(ARBillboardsAddEditPage.getRuleDropDownBtn()).eq(1).click()
            cy.get(ARBillboardsAddEditPage.getRuleDropDownOptions()).contains('Yes').click()
            cy.get(ARBillboardsAddEditPage.getRuleDropDownBtn()).eq(1).click()
            cy.get(ARBillboardsAddEditPage.getRuleDropDownOptions()).contains('No').click()

        })

        // Save the billboard
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).should('not.have.attr', 'aria-disabled')
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain', 'Billboard has been created.')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")
    })

    it(`Create Online Course and add Rule as ${customField.customFieldName}  with Yes and No`, () => {

        //Signin as an admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Courses Report Page
        ARDashboardPage.getCoursesReport()
        //Create course with basic object lesson
        cy.createCourse('Online Course', ocDetails.courseName)
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')

        //Set enrollment rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
        //Adding rule with value of yes in boolean field 
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', customField.customFieldName.substring(0, 10), null, 'Yes', null)

        //Adding another rule with no in boolean field 
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', customField.customFieldName.substring(0, 10), null, 'No', null)

        //Here , the course has not been published 


    })

    it(`Create a group with rule ${customField.customFieldName}`, () => {
        //containsCustomFiled 2023-11-08T13:05:18+06:00
        customField.customFieldName = "CustomFiled 2023-11-08T13:05:18+06:00"
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGroupsReport()
        // "Add Group" button should be visible at the right sidebar
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Group')).should('be.visible').click()

        // Verify that the add new group page heading is "Add Group"
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Group')

        // Create Group with Valid Name
        cy.get(ARGroupAddEditPage.getNameTxtF()).type(groupDetails.groupName)
        //Clickin on the Assignment to automatic 
        cy.get(ARGroupAddEditPage.getAssignmentRadioBtn()).contains('Automatic').click()
        ARGroupAddEditPage.verifyAssignmentRadioBtn('Automatic', 'true')
        //Clicking on add Rule Button
        cy.get(ARGroupAddEditPage.getAddRuleBtn()).click()

        // verify Availability Rules
        cy.get(ARGroupAddEditPage.getFirstRulesContainer()).within(() => {
            cy.get(ARGroupAddEditPage.getRuleDropDownBtn()).eq(0).click()

            cy.get(ARGroupAddEditPage.getRuleDropDownOptions()).contains(customField.customFieldName.substring(0, 10)).click()
            cy.get(ARGroupAddEditPage.getRuleDropDownBtn()).eq(1).click()
            cy.get(ARGroupAddEditPage.getRuleDropDownOptions()).contains('Yes').click()
            cy.get(ARGroupAddEditPage.getRuleDropDownBtn()).eq(1).click()
            cy.get(ARGroupAddEditPage.getRuleDropDownOptions()).contains('No').click()

        })
        // Save Group
        cy.get(ARGroupAddEditPage.getSaveBtn()).click()
        cy.get(ARGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been created.')
    })

    it(`Delete created group named ${groupDetails.groupName}`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGroupsReport()
        // Search and delete Groups
        ARGroupAddEditPage.AddFilter('Name', 'Contains', groupDetails.groupName)
        cy.get(ARGroupAddEditPage.getTableCellContentByIndex(2)).should('contain', groupDetails.groupName)
        cy.get(ARGroupAddEditPage.getTableCellContentByIndex(2)).contains(groupDetails.groupName).click()

        cy.wrap(ARGroupAddEditPage.WaitForElementStateToChange(ARGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(ARGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()

        // Modal should appear
        // The title should be "Delete Group"
        cy.get(ARDeleteModal.getModalHeader()).should('contain', "Delete Group")

        // Delete icon should be visible on the modal
        cy.get(ARDeleteModal.getPromptIcon()).should('have.class', 'icon icon-trash')

        // verify Warning message
        cy.get(ARDeleteModal.getModalContent()).should('contain', ARDeleteModal.getDeleteMsg(groupDetails.groupName))

        // [Delete] and [Cancel] buttons should be visible
        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible')
        cy.get(ARDeleteModal.getARCancelBtn()).should('be.visible').click()

        // Modal should disappear
        cy.get(ARDeleteModal.getARCancelBtn()).should('not.exist')

        // user should be returned to the group report page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Groups')

        // the selected group should still remain selected
        cy.get(ARDashboardPage.getSelectRowCheckbox()).should('have.attr', 'aria-checked', 'true')

        cy.wrap(ARGroupAddEditPage.WaitForElementStateToChange(ARGroupAddEditPage.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(ARGroupAddEditPage.getAddEditMenuActionsByName('Delete Group')).click()

        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        // Verify that selecting the [Delete] button deletes the group
        cy.get(ARGroupAddEditPage.getToastSuccessMsg()).should('contain', 'Group has been deleted successfully.')
        cy.get(ARDeleteModal.getNoResultMsg()).should('have.text', "No results found.")
    })

    it(`Delete Billboard named ${billboardsDetails.billboardName}`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()

        ARDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        ARDashboardPage.selectTableCellRecord(billboardsDetails.billboardName, 2)
        ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete Billboard'))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Billboard')).click()
        ARDashboardPage.getConfirmModalBtnByText('Delete')
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it(`Delete the created custom field created earlier named ${customField.customFieldName} and OC`, () => {

        //Signin as an admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain', "GUI_Auto Sys_Admin_01")
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()

        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        //Clicking on custom fields
        cy.get(ARDashboardPage.getCustomFieldsTab()).should('have.text', 'Custom Fields').click()

        cy.get(A5CustomFieldsPage.getAddFieldBtn()).contains("Add Field").as('AddFieldBtn').scrollTo('bottom', { ensureScrollable: false })
        //Clicking on the add field button
        cy.get('@AddFieldBtn').click()

        //Finding the lenth of the li element 
        cy.get(A5CustomFieldsPage.getCustomFieldContainer()).its('length').as('index')


        //Deleting newly created custom fields
        cy.get('@index').then(($val) => {
            cy.get(A5CustomFieldsPage.getCustomFieldContainer()).eq($val - 2).should('be.visible')

            cy.get(A5CustomFieldsPage.getCustomFieldContainer()).eq($val - 2).within(() => {
                cy.get(A5CustomFieldsPage.getCustomFieldMainDiv()).find('input').first().invoke('val').then(($val) => {
                    expect($val).to.be.equal(fieldName)
                })
            })

            cy.get(A5CustomFieldsPage.getCustomFieldContainer()).eq($val - 2).within(() => {
                cy.get(A5CustomFieldsPage.getRemoveFilterBtnContainer()).within(() => {
                    //Clicking on the remove filter btn
                    cy.get(A5CustomFieldsPage.getRemoveFilterBtn()).click({ force: true, waitForAnimations: false })
                })
            })

        })

        //Deleteting the new custom field container
        cy.get('@index').then((val) => {
            cy.get(A5CustomFieldsPage.getCustomFieldContainer()).eq(val - 1).should('be.visible')

            cy.get(A5CustomFieldsPage.getCustomFieldContainer()).eq(val - 1).within(() => {
                cy.get(A5CustomFieldsPage.getRemoveFilterBtnContainer()).within(() => {
                    //Clicking on the remove filter btn
                    cy.get(A5CustomFieldsPage.getRemoveFilterBtn()).click({ force: true, waitForAnimations: false })
                })
            })

        })
        //Saving
        A5CustomFieldsPage.getSaveBtn().click()
        //Asserting that its been saved and moved to another location
        cy.url({ timeout: 15000 }).should('include', '/Admin/Clients')


    })
})


