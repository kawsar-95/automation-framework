import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { generalFields, fieldsFields, fieldValues } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'

describe('AR - Enrollment Keys - Fields Section', function(){

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

    it('Create Enrollment Key and Verify Fields Section', () => {
        //Create a new single enrollment key and fill in required general fields
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type(generalFields.singleEKeyName) 
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()
        cy.get(AREnrollmentKeyPage.getGenerateKeyBtn()).click()
        
        //Verify fields are sorted in the correct order
        cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").invoke('text').should('eq', fieldsFields.fieldNames.join(''))
        
        //Verify Username, First Name, and Last Name fields are required and cannot be edited
        for (let i = 0; i < 3; i++) {
            cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(fieldsFields.fieldNames[i]).parent().within(() => {
                cy.get(AREnrollmentKeyPage.getReadOnlyTxtF()).should('exist')
                cy.get(AREnrollmentKeyPage.getReadOnlyDDown()).should('exist')
            })
        }

        //Verify each fields' input and behaviour options
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
                    //Verify Fields do not allow > 255 chars and dropdown options
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get(AREnrollmentKeyPage.getTxtF()).invoke('val', AREnrollmentKeyPage.getLongString(255)).type('a')
                        cy.get(AREnrollmentKeyPage.getErrorMsg()).should('contain', miscData.CHAR_255_ERROR)
                        //Enter Valid input
                        cy.get(AREnrollmentKeyPage.getTxtF()).clear().type(fieldValues[fieldsFields.fieldNames[i]])
                       
                        //Verify dropdown options
                        cy.get(AREnrollmentKeyPage.getBehaviourDDown()).click()
                        cy.get(AREnrollmentKeyPage.getDDownList()).invoke('text').should('eq', fieldsFields.behaviourOptions.join(''));
                        //Set field to optional
                        cy.get(AREnrollmentKeyPage.getDDownOpt()).contains('Optional').click()
                    })
                    break;
                case 'Country':
                case 'Province':
                case 'Language':
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get("td:nth-child(2)").within(() => {
                            //Enter valid input
                            cy.get(AREnrollmentKeyPage.getInputDDown()).click()
                            cy.get(AREnrollmentKeyPage.getDDownTxtF()).type(fieldValues[fieldsFields.fieldNames[i]])
                            cy.get(AREnrollmentKeyPage.getDDownOpt()).contains(fieldValues[fieldsFields.fieldNames[i]]).click()
                        })
                        cy.get("td:nth-child(3)").within(() => {
                            //Verify dropdown options
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).click()
                            cy.get(AREnrollmentKeyPage.getDDownList()).invoke('text').should('eq', fieldsFields.behaviourOptions.join(''));
                            //Set field to optional
                            cy.get(AREnrollmentKeyPage.getDDownOpt()).contains('Optional').click()
                        })
                    })
                    break;
            }
        }

        //Save enrollment key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('Edit Enrollment Key, Verify All Fields Persisted, Edit Fields', () => {
        //Filter and Edit EKey
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName)
        cy.get(arDashboardPage.getTableCellName(2)).contains(generalFields.singleEKeyName).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key')).click()
        arDashboardPage.getLShortWait()
        
        //Get enrollment key ID for deletion at end of test
        cy.url().should('contain', 'edit').then((currentURL) => {
            generalFields.eKeyId = currentURL.slice(-36); //Store ID
        })

        //Verify Fields persisted and edit them
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
                    //Verify Fields and dropdowns persisted, edit text fields and dropdowns
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get(AREnrollmentKeyPage.getTxtF()).should('have.value', fieldValues[fieldsFields.fieldNames[i]])
                        cy.get(AREnrollmentKeyPage.getTxtF()).type(generalFields.appendText)
                        cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Optional').click()
                        cy.get(AREnrollmentKeyPage.getDDownOpt()).contains('Required').click()
                    })
                    break;
                case 'Country':
                case 'Province':
                case 'Language':
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get("td:nth-child(2)").within(() => {
                            //Verify field persisted and edit it
                            if (fieldsFields.fieldNames[i] != "Province") {
                                cy.get(AREnrollmentKeyPage.getInputDDown()).should('contain', fieldValues[fieldsFields.fieldNames[i]]).click()
                            } else {
                                cy.get(AREnrollmentKeyPage.getInputDDown()).click()
                            }
                            let newField = `${fieldsFields.fieldNames[i]} 2`
                            cy.get(AREnrollmentKeyPage.getDDownTxtF()).type(fieldValues[newField])
                            cy.get(AREnrollmentKeyPage.getDDownOpt()).contains(fieldValues[newField]).click()
                        })
                        cy.get("td:nth-child(3)").within(() => {
                            //Verify dropdown persisted and edit it
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Optional').click()
                            cy.get(AREnrollmentKeyPage.getDDownOpt()).contains('Required').click()
                        })
                    })
                    break;
            }
        }

        //Save enrollment key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
    })

    it('Edit Enrollment Key, Verify All Changes Persisted', () => {
        //Filter and Edit EKey
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName)
        cy.get(arDashboardPage.getTableCellName(2)).contains(generalFields.singleEKeyName).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Enrollment Key')).click()
        arDashboardPage.getLShortWait()

        //Verify Fields edits persisted
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
                        cy.get(AREnrollmentKeyPage.getTxtF()).should('have.value', fieldValues[fieldsFields.fieldNames[i]] + generalFields.appendText)
                        cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Required')
                    })
                    break;
                case 'Country':
                case 'Province':
                case 'Language':
                    cy.get(AREnrollmentKeyPage.getFieldsTable()).find("tr td:nth-child(1)").contains(new RegExp("^" + fieldsFields.fieldNames[i] + "$", "g")).parent().within(() => {
                        cy.get("td:nth-child(2)").within(() => {
                            //Verify field persisted
                            let newField = `${fieldsFields.fieldNames[i]} 2`
                            cy.get(AREnrollmentKeyPage.getInputDDown()).should('contain', fieldValues[newField])
                        })
                        cy.get("td:nth-child(3)").within(() => {
                            //Verify dropdown persisted
                            cy.get(AREnrollmentKeyPage.getBehaviourDDown()).should('contain', 'Required')
                        })
                    })
                    break;
            }
        }
    })
})