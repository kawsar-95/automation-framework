import users from '../../../../../fixtures/users.json'
import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import AREmailTemplateModal from '../../../../../../helpers/AR/pageObjects/Modals/AREmailTemplateModal'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { generalFields, fieldsFields, fieldValues, messagesFields } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'

describe('AR - Enrollment Keys - Duplicate', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Enrollment Keys
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.intercept('/api/rest/v2/admin/reports/enrollment-keys/operations').as('getEKeys').wait('@getEKeys')
    })

    after(function () {
        //Delete enrollment key via API
        let eKeyIds = [generalFields.eKeyId, generalFields.eKeyId2]
        for (let i = 0; i < 2; i++) {
            AREnrollmentKeyPage.deleteEKeyViaAPI(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, eKeyIds[i])
        }
    })

    it('Create Enrollment Key', () => {
        //Create a new single enrollment key and fill in general fields, message template fields, and field fields
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type(generalFields.singleEKeyName)

        //Add department
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])

        //Select username type
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()

        //Add courses
        cy.get(AREnrollmentKeyPage.getAddCoursesBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.ilc_filter_01_name])
        //Select ILC Session
        AREnrollmentKeyPage.getSelectILCSessionByName(courses.ilc_filter_01_name, courses.ilc_session_01_name)

        //Generate key
        cy.get(AREnrollmentKeyPage.getGenerateKeyBtn()).click()

        //Select start and end dates
        cy.get(AREnrollmentKeyPage.getStartDatePickerBtn()).click()
        AREnrollmentKeyPage.getSelectDate(generalFields.date1)
        cy.get(AREnrollmentKeyPage.getExpiryDatePickerBtn()).click()
        AREnrollmentKeyPage.getSelectDate(generalFields.date2)

        //Enter number of uses
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).clear().type('2')

        //Select a language
        cy.get(AREnrollmentKeyPage.getLanguageDDown()).click()
        cy.get(AREnrollmentKeyPage.getLanguageOpt()).contains('English').click()

        //Enable and edit message template
        cy.get(AREnrollmentKeyPage.getSendEmailChkBox()).click()
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getCustomTemplateToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()
        cy.get(AREnrollmentKeyPage.getEditTemplateBtn()).click()
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear().type(messagesFields.subjectText)
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()
        //Save email template changes
        cy.get(AREmailTemplateModal.getSaveBtn()).click()

        //Add placeholder values and behaviour options to all fields
        for (let i = 0; i < fieldsFields.fieldNames.length; i++) {

            switch (fieldsFields.fieldNames[i]) {
                case 'Email Address':
                case 'Middle Name':
                case 'Job Title':
                case 'Employee Number':
                case 'Phone':
                case 'Location':
                case 'Address':
                case 'Address 2':
                case 'City':
                case 'Postal Code':
                    //Add placeholder value
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get(AREnrollmentKeyPage.getTxtF()).clear().type(fieldValues[fieldsFields.fieldNames[i]])

                        //Set all fields behaviour to optional
                        cy.get(AREnrollmentKeyPage.getBehaviourDDown()).click()
                        cy.get(AREnrollmentKeyPage.getDDownOpt()).contains('Optional').click()
                    })
                    break;
                case 'Country':
                case 'Province':
                case 'Language':
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get("td:nth-child(2)").within(() => {
                            //Add placeholder value
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).click()
                            cy.get(AREnrollmentKeyPage.getDDownTxtF()).type(fieldValues[fieldsFields.fieldNames[i]])
                            cy.get(AREnrollmentKeyPage.getDDownOpt()).contains(fieldValues[fieldsFields.fieldNames[i]]).click()
                        })
                        cy.get("td:nth-child(3)").within(() => {
                            //Set all fields behaviour to optional
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).click()
                            cy.get(AREnrollmentKeyPage.getDDownOpt()).contains('Optional').click()
                        })
                    })
                    break;
            }
        }

        //Save Enrollment Key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('Duplicate Enrollment Key, Verify Field Values, and Save', () => {
        //Filter for EKey
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName)
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName, 2)

        //Duplicate enrollment key
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Duplicate Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Duplicate Enrollment Key')).click()
        arDashboardPage.getLShortWait()
        //get original key id for deletion later
        cy.url().should('contain', 'add').then((currentURL) => {
            generalFields.eKeyId = currentURL.slice(-36); //Store ID
        })

        //Verify Name has - Copy appended to it
        cy.get(AREnrollmentKeyPage.getWaitSpinner()).should('not.exist')
        cy.get(AREnrollmentKeyPage.getNameTxtF()).should('have.value', `${generalFields.singleEKeyName} - Copy`)

        //Verify general fields were all duplicated
        cy.get(AREnrollmentKeyPage.getDepartmentF()).should('have.value', departments.DEPT_TOP_NAME)
        cy.get(AREnrollmentKeyPage.getCourseName()).should('contain', courses.oc_filter_01_name).and('contain', courses.ilc_filter_01_name)
        cy.get(AREnrollmentKeyPage.getILCSessionDDown()).should('contain', courses.ilc_session_01_name)
        cy.get(AREnrollmentKeyPage.getStartDateF()).should('have.value', generalFields.date1)
        cy.get(AREnrollmentKeyPage.getExpiryDateF()).should('have.value', generalFields.date2)
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).should('have.value', '2')
        cy.get(AREnrollmentKeyPage.getLanguageDDown()).should('contain', 'English')

        //Verify key name was not duplicated
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).should('have.value', '')
        //Enter key
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).type(generalFields.eKeyName)

        //Verify message template settings persisted
        cy.get(AREnrollmentKeyPage.getSendEmailChkBoxContainer()).within(() =>{
            cy.get(AREnrollmentKeyPage.getSendEmailChkBoxSelector()).should('have.attr', 'aria-checked', 'true')
        })
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getCustomTemplateToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        //Verify Email template settings persisted
        cy.get(AREnrollmentKeyPage.getEditTemplateBtn()).click()
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', messagesFields.subjectText)
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToLearnerToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREmailTemplateModal.getCancelBtn()).click() //close email modal

        //Verify field settings persisted
        for (let i = 0; i < fieldsFields.fieldNames.length; i++) {

            switch (fieldsFields.fieldNames[i]) {
                case 'Email Address':
                case 'Middle Name':
                case 'Job Title':
                case 'Employee Number':
                case 'Phone':
                case 'Location':
                case 'Address':
                case 'Address 2':
                case 'City':
                case 'Postal Code':
                    //Verify Fields and dropdowns persisted
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get(AREnrollmentKeyPage.getTxtF()).should('have.value', fieldValues[fieldsFields.fieldNames[i]])
                        cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Optional')
                    })
                    break;
                case 'Country':
                case 'Province':
                case 'Language':
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get("td:nth-child(2)").within(() => {
                            //Verify field persisted
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', fieldValues[fieldsFields.fieldNames[i]])
                        })
                        cy.get("td:nth-child(3)").within(() => {
                            //Verify dropdown persisted
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Optional')
                        })
                    })
                    break;
            }
        }

        //Save Duplicated Enrollment Key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('Edit Duplicated Enrollment Key and Verify Field Values Persisted', () => {
        //Filter for EKey and edit it
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', `${generalFields.singleEKeyName} - Copy`)
        arDashboardPage.selectTableCellRecord(`${generalFields.singleEKeyName} - Copy`, 2)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key')).click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getWaitSpinner()).should('not.exist')
        //Get enrollment key ID for deletion at end of test
        cy.url().should('contain', 'edit').then((currentURL) => {
            generalFields.eKeyId2 = currentURL.slice(-36); //Store ID
        })

        //Verify all fields persisted
        cy.get(AREnrollmentKeyPage.getDepartmentF()).should('have.value', departments.DEPT_TOP_NAME)
        cy.get(AREnrollmentKeyPage.getCourseName()).should('contain', courses.oc_filter_01_name).and('contain', courses.ilc_filter_01_name)
        cy.get(AREnrollmentKeyPage.getILCSessionDDown()).should('contain', courses.ilc_session_01_name)
        cy.get(AREnrollmentKeyPage.getStartDateF()).should('have.value', generalFields.date1)
        cy.get(AREnrollmentKeyPage.getExpiryDateF()).should('have.value', generalFields.date2)
        cy.get(AREnrollmentKeyPage.getNumberUsesTxtF()).should('have.value', '2')
        cy.get(AREnrollmentKeyPage.getLanguageDDown()).should('contain', 'English')
        cy.get(AREnrollmentKeyPage.getKeyNameTxtF()).should('have.value', generalFields.eKeyName)
        cy.get(AREnrollmentKeyPage.getSendEmailChkBoxContainer()).within(() =>{
            cy.get(AREnrollmentKeyPage.getSendEmailChkBoxSelector()).should('have.attr', 'aria-checked', 'true')
        })
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getCustomTemplateToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREnrollmentKeyPage.getEditTemplateBtn()).click()
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', messagesFields.subjectText)
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToLearnerToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AREmailTemplateModal.getCancelBtn()).click() //close email modal

        for (let i = 0; i < fieldsFields.fieldNames.length; i++) {

            switch (fieldsFields.fieldNames[i]) {
                case 'Email Address':
                case 'Middle Name':
                case 'Job Title':
                case 'Employee Number':
                case 'Phone':
                case 'Location':
                case 'Address':
                case 'Address 2':
                case 'City':
                case 'Postal Code':
                    //Verify Fields and dropdowns persisted
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get(AREnrollmentKeyPage.getTxtF()).should('have.value', fieldValues[fieldsFields.fieldNames[i]])
                        cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Optional')
                    })
                    break;
                case 'Country':
                case 'Province':
                case 'Language':
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get("td:nth-child(2)").within(() => {
                            //Verify field persisted
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', fieldValues[fieldsFields.fieldNames[i]])
                        })
                        cy.get("td:nth-child(3)").within(() => {
                            //Verify dropdown persisted
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Optional')
                        })
                    })
                    break;
            }
        }
    })
})