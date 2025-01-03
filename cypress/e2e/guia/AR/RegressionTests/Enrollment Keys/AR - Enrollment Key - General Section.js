import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import departments from '../../../../../fixtures/departments.json'
import courses from '../../../../../fixtures/courses.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import { generalFields } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'

describe('AR - Enrollment Key - General Section', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Enrollment Keys
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.intercept('/api/rest/v2/admin/reports/enrollment-keys/operations').as('getEKeys').wait('@getEKeys')
    })

    after(function() {
        //Delete enrollment key via API
        AREnrollmentKeyPage.deleteEKeyViaAPI(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, generalFields.eKeyId)
    })

    it('Create an Enrollment Key and Verify All General Fields', () => {
        //Create a new enrollment key
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()

        //Verify Name field is required
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type('a').clear()
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)

        //Verify Name field does not allow > 450 chars
        cy.get(AREnrollmentKeyPage.getNameTxtF()).invoke('val', AREnrollmentKeyPage.getLongString(450)).type('a')
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.CHAR_450_ERROR)

        //Enter valid Name
        cy.get(AREnrollmentKeyPage.getNameTxtF()).clear().type(generalFields.singleEKeyName)

        //Verify Department field is required
        cy.get(AREnrollmentKeyPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

        //Select a Department
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])

        //Verify Username radio btn option can be selected
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()

        //Verify courses empty state message
        cy.get(AREnrollmentKeyPage.getNoCoursesMsg()).should('contain', 'No courses have been added - this enrollment key will grant users access to 0 courses.')

        //Verify courses can be added to key
        cy.get(AREnrollmentKeyPage.getAddCoursesBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.OC_FILTER_01_NAME, courses.CURR_FILTER_01_NAME])
        AREnrollmentKeyPage.getShortWait()

        //Verify courses can be removed from key
        AREnrollmentKeyPage.getDeleteCourseByName(courses.CURR_FILTER_01_NAME)
        cy.get(AREnrollmentKeyPage.getCourseName()).contains(courses.CURR_FILTER_01_NAME).should('not.exist')

        //--- For Single Enrollment Key ---// 

        //Verify Key Name is required
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).type('a').clear()
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', 'Must contain 8 or more characters.')

        //Verify Key Name does not allow < 8 chars
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).type(AREnrollmentKeyPage.getLongString(7))
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', 'Must contain 8 or more characters.')

        //Verify Key Name does not allow > 4000 chars
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).invoke('val', AREnrollmentKeyPage.getLongString(4000)).type('a')
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.CHAR_4000_ERROR)

        //Verify Key Name does not allow special characters
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).clear().type('abcdef&$')
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', "Key Name may not contain")

        //Enter valid Key Name and verify URL is updated
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).clear().type(generalFields.eKeyName)

        //Verify Key can be auto generated by pressing Generate Btn
        cy.get(AREnrollmentKeyPage.getDirectLinkUrl()).should('contain', `${Cypress.config().baseUrl.slice(0, -1)}?KeyName=${generalFields.eKeyName}`)

        //Verify generated key is 20 chars
        cy.get(AREnrollmentKeyPage.getGenerateKeyBtn()).click()
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).invoke('val').should('have.length', 20)

        //Verify new key is generated each time the button is pressed
        for (let i = 0; i < 3; i++) {
            cy.get(AREnrollmentKeyPage.getGenerateKeyBtn()).click()
            cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).invoke('val').then(($key) => {
                cy.wrap($key).as(`key_${i}`)
            })

            if (i != 0) {
                //Verify new key is different than the previous
                cy.get(`@key_${i - 1}`).then(prevKey => {
                    cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).invoke('val').should('not.eq', prevKey)
                })
            }
        }

        //Verify URL is updated with generated key
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).invoke('val').then(($key) => {
            cy.get(AREnrollmentKeyPage.getDirectLinkUrl()).should('contain', `${Cypress.config().baseUrl.slice(0, -1)}?KeyName=${$key}`)
        })

        //-------------------------------//

        //--- For Bulk Enrollment Key ---// 

        //Switch toggle to Bulk setting
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getGenerateKeyToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()

        //Verify Automatic Key Name message
        cy.get(AREnrollmentKeyPage.getKeyNameMsg()).should('contain', 'Key name will be randomly generated and assigned.')

        //Verify Manual Key Name is a required field and does not allow > 255 chars
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getKeyNameToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleEnabled()).click()
        cy.get(AREnrollmentKeyPage.getKeyNameMsg()).should('contain', 'Text will be added to the beginning of the key name.')
        cy.get(AREnrollmentKeyPage.getManualKeyNameTxtF()).type('a').clear()
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)
        cy.get(AREnrollmentKeyPage.getManualKeyNameTxtF()).invoke('val', AREnrollmentKeyPage.getLongString(255)).type('a')
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.CHAR_255_ERROR)

        //Verify Automatic Reference ID message
        cy.get(AREnrollmentKeyPage.getReferenceIDMsg()).should('contain', 'Reference ID will be randomly generated and assigned.')

        //Verify Manual Reference ID is a required field and does not allow > 255 chars
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getReferenceIDToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleEnabled()).click()
        cy.get(AREnrollmentKeyPage.getManualReferenceIDTxtF()).type('a').clear()
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)
        cy.get(AREnrollmentKeyPage.getManualReferenceIDTxtF()).invoke('val', AREnrollmentKeyPage.getLongString(255)).type('a')
        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.CHAR_255_ERROR)

        //Verify Number of Generated Keys field only allows positive numerical values up to 2000
        cy.get(AREnrollmentKeyPage.getNumGeneratedKeysTxtF()).clear().type('0').blur()
        cy.get(AREnrollmentKeyPage.getNumGeneratedKeysTxtF()).should('have.value', '1')
        cy.get(AREnrollmentKeyPage.getNumGeneratedKeysTxtF()).clear().type('2500').blur()
        cy.get(AREnrollmentKeyPage.getNumGeneratedKeysTxtF()).should('have.value', '2000')
        cy.get(AREnrollmentKeyPage.getNumGeneratedKeysTxtF()).clear().type('2')

        //-------------------------------//

        //Switch back to Single Key and add Key Name
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getGenerateKeyToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleEnabled()).click()
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).clear().type(generalFields.eKeyName)

        //Verify Start and Expiry Date can be selected
        cy.get(AREnrollmentKeyPage.getStartDatePickerBtn()).click()
        AREnrollmentKeyPage.getSelectDate(generalFields.date1)
        cy.get(AREnrollmentKeyPage.getExpiryDatePickerBtn()).click()
        AREnrollmentKeyPage.getSelectDate(generalFields.date2)

        //Verify the Number of Uses fields only allows positive numerical values
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).type('0').blur()
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).should('have.value', '1')
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).clear().type('-3').blur()
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).should('have.value', '1')

        //Verify a Language can be selected
        cy.get(AREnrollmentKeyPage.getLanguageDDown()).click()
        cy.get(AREnrollmentKeyPage.getLanguageOpt()).contains('French').click()

        //Save Enrollment Key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('Edit Enrollment Key, Verify All Fields Persisted, Edit Fields', () => {
        //Filter and Edit EKey
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName)
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName, 2)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key')).click()
        arDashboardPage.getLShortWait()

        //Get enrollment key ID for deletion at end of test
        cy.url().should('contain', 'edit').then((currentURL) => {
            generalFields.eKeyId = currentURL.slice(-36); //Store ID
        })

        //Verify all fields persisted
        cy.get(AREnrollmentKeyPage.getNameTxtF()).should('have.value', generalFields.singleEKeyName) 
        cy.get(AREnrollmentKeyPage.getDepartmentF()).should('have.value', departments.DEPT_TOP_NAME) 
        cy.get(AREnrollmentKeyPage.getCourseName()).contains(courses.OC_FILTER_01_NAME).should('exist')
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).should('have.value', generalFields.eKeyName)
        cy.get(AREnrollmentKeyPage.getStartDateF()).should('have.value', generalFields.date1)
        cy.get(AREnrollmentKeyPage.getExpiryDateF()).should('have.value', generalFields.date2)
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).should('have.value', '1')
        cy.get(AREnrollmentKeyPage.getLanguageDDown()).should('contain', 'French')

        //Verify Generate Key selection no longer exists
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getGenerateKeyToggleContainer())).should('not.exist')

        //Edit Name
        cy.get(AREnrollmentKeyPage.getNameTxtF()).clear().type(generalFields.singleEKeyName + generalFields.appendText)

        //Edit Department
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.SUB_DEPT_A_NAME])

        //Edit Username option
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('Email Address').click()

        //Verify ILC session can be selected when ILC course is added to key
        AREnrollmentKeyPage.getDeleteCourseByName(courses.OC_FILTER_01_NAME)
        cy.get(AREnrollmentKeyPage.getAddCoursesBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.ILC_FILTER_01_NAME])
        //Select Session
        AREnrollmentKeyPage.getSelectILCSessionByName(courses.ILC_FILTER_01_NAME, courses.ILC_SESSION_01_NAME)

        //Edit Key Name
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).clear().type(generalFields.eKeyName + generalFields.appendText)

        //Edit Start & Expiry Date
        cy.get(AREnrollmentKeyPage.getStartDatePickerBtn()).click()
        AREnrollmentKeyPage.getSelectDate(generalFields.date3)
        cy.get(AREnrollmentKeyPage.getExpiryDatePickerBtn()).click()
        AREnrollmentKeyPage.getSelectDate(generalFields.date4)

        //Edit Number of Uses
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).clear().type('4')

        //Edit Language
        cy.get(AREnrollmentKeyPage.getLanguageDDown()).click()
        cy.get(AREnrollmentKeyPage.getLanguageOpt()).contains('English').click()

        //Save Enrollment Key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('Edit Enrollment Key, Verify All Changes Persisted, Verify Cancel Button', () => {
        //Filter and Edit EKey
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName + generalFields.appendText)
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName + generalFields.appendText , 2)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key')).click()
        arDashboardPage.getLShortWait()

        //Verify all changes persisted
        cy.get(AREnrollmentKeyPage.getNameTxtF()).should('have.value', generalFields.singleEKeyName + generalFields.appendText)
        cy.get(AREnrollmentKeyPage.getDepartmentF()).should('have.value', `.../${departments.SUB_DEPT_A_NAME}`)
        cy.get(AREnrollmentKeyPage.getCourseName()).contains(courses.ILC_FILTER_01_NAME).should('exist')
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).should('have.value', generalFields.eKeyName + generalFields.appendText)
        cy.get(AREnrollmentKeyPage.getStartDateF()).should('have.value', generalFields.date3)
        cy.get(AREnrollmentKeyPage.getExpiryDateF()).should('have.value', generalFields.date4)
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).should('have.value', '4')
        cy.get(AREnrollmentKeyPage.getLanguageDDown()).should('contain', 'English')

        //Make a change and verify cancel can be used to discard changes
        cy.get(AREnrollmentKeyPage.getNameTxtF()).clear().type('Edit')

        //Press Cancel
        cy.get(AREnrollmentKeyPage.getCancelBtn()).click()
        cy.get(arPublishModal.getContinueBtn()).click()
    })
})