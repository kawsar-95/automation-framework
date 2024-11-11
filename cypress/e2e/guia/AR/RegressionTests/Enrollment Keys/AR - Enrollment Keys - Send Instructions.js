import miscData from '../../../../../fixtures/miscData.json'
import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import AREnrollmentKeyInstructionsPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyInstructionsPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARHangfireJobsPage from '../../../../../../helpers/AR/pageObjects/Hangfire/ARHangfireJobsPage'
import { generalFields, instructions } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { eKeyJobs } from '../../../../../../helpers/TestData/Hangfire/jobNames'

describe('AR - Enrollment Keys - Send Instructions', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Enrollment Keys
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.intercept('/api/rest/v2/admin/reports/enrollment-keys/operations').as('getEKeys').wait('@getEKeys')
    })

    it('Create Enrollment Key, Verify Send Instructions Button', () => {
        //Create a new single enrollment key and fill in required general fields
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type(generalFields.singleEKeyName) 
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()
        cy.get(AREnrollmentKeyPage.getGenerateKeyBtn()).click()
        arDashboardPage.getVShortWait()

        //Save enrollment key
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getMediumWait()

        //Verify Send Instructions Button does not exist if multiple enrollment keys are selected
        //Select all keys
        cy.get(AREnrollmentKeyPage.getElementByAriaLabelAttribute(AREnrollmentKeyPage.getRowSelectOption())).click()
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getSelectThisPageOption())).click()
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Send Enrollment Key Instructions')).should('not.exist')
    })

    it('Verify Send Enrollment Key Instructions', () => {
        //Filter for Ekey
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName)
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName , 2)
        
    
        //Verify Ekey can be deselected
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName , 2)
        cy.get(arDashboardPage.getTableCellContentByIndex(1)).should('not.be.checked')
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName , 2)

        //Verify send instructions button can be clicked
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Send Enrollment Key Instructions'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Send Enrollment Key Instructions')).click()
        arDashboardPage.getLShortWait()
        
        //Get enrollment key ID for deletion at end of test
        cy.url().should('contain', 'enrollmentKey').then((currentURL) => {
            generalFields.eKeyId = currentURL.slice(-36); //Store ID
        })

        //Verify email address field does not allow >255 chars
        cy.get(AREnrollmentKeyInstructionsPage.getAddEmailBtn()).click()
        cy.get(AREnrollmentKeyInstructionsPage.getEmailTxtF()).eq(0).invoke('val', AREnrollmentKeyInstructionsPage.getLongString(255)).type('a')
        cy.get(AREnrollmentKeyInstructionsPage.getErrorMsg()).should('contain', miscData.CHAR_255_ERROR)
        
        //Verify email address field does not accept incorrect email format
        cy.get(AREnrollmentKeyInstructionsPage.getEmailTxtF()).eq(0).clear().type(userDetails.emailAddress.slice(0,20))
        cy.get(AREnrollmentKeyInstructionsPage.getErrorMsg()).should('contain', miscData.ENTER_VALID_EMAIL)

        //Verify individual email addresses can be added / removed
        cy.get(AREnrollmentKeyInstructionsPage.getEmailTxtF()).eq(0).clear().type(userDetails.emailAddress)
        cy.get(AREnrollmentKeyInstructionsPage.getAddEmailBtn()).click()
        cy.get(AREnrollmentKeyInstructionsPage.getEmailTxtF()).eq(1).clear().type(userDetails.emailAddressEdited)
        cy.get(AREnrollmentKeyInstructionsPage.getEmailTxtF()).eq(1).parents().within(() => {
            cy.get(AREnrollmentKeyInstructionsPage.getTrashBtn()).eq(1).click()
        })
        //Verify recipient count
        cy.get(AREnrollmentKeyInstructionsPage.getReceipientCount()).should('contain', 'This message will be sent to 1 Users.')
       
        //Verify send to individuals only radio btn allows you to select and remove learners from the ddown
        cy.get(AREnrollmentKeyInstructionsPage.getSendToRadioBtn()).contains('Send to individuals only').click()

        //Select Learners from the DDown
        cy.get(AREnrollmentKeyInstructionsPage.getIndividualsDDown()).click()
        cy.get(AREnrollmentKeyInstructionsPage.getIndividualsTxtF()).type('GUIAutoL0')
        cy.get(AREnrollmentKeyInstructionsPage.getDDownOpt()).contains(users.learner01.learner_01_username).click()
        cy.get(AREnrollmentKeyInstructionsPage.getDDownOpt()).contains(users.learner02.learner_02_username).click()
        cy.get(AREnrollmentKeyInstructionsPage.getIndividualsDDown()).click() //close ddown
        //Verify recipient count
        cy.get(AREnrollmentKeyInstructionsPage.getReceipientCount()).should('contain', 'This message will be sent to 3 Users.')

        //Verify user can be removed
        cy.get(AREnrollmentKeyInstructionsPage.getUserSelectedOption()).contains(users.learner02.learner_02_username).parent().within(() => {
            cy.get(AREnrollmentKeyInstructionsPage.getXBtn()).click()
        })

        //Verify send to departments allows you to select multiple departments
        cy.get(AREnrollmentKeyInstructionsPage.getSendToRadioBtn()).contains('Send to departments').click()
        cy.get(AREnrollmentKeyInstructionsPage.getAddDepartmentsBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(AREnrollmentKeyInstructionsPage.getAddDepartmentsBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.SUB_DEPT_A_NAME])

        //Verify departments can be removed
        AREnrollmentKeyInstructionsPage.getDeleteDepartmentByName(departments.DEPT_TOP_NAME)

        //Verify ekey can be sent to all in department, or all under department
        cy.get(AREnrollmentKeyInstructionsPage.getDepartmentRadioBtn()).contains('Send to everyone under these departments').should('exist')
        cy.get(AREnrollmentKeyInstructionsPage.getDepartmentRadioBtn()).contains('Send to people in these departments only').should('exist')
        
        //Verify send to groups radio btn allows you to select and remove groups from the ddown
        cy.get(AREnrollmentKeyInstructionsPage.getSendToRadioBtn()).contains('Send to groups').click()
        //Select groups from the DDown
        cy.get(AREnrollmentKeyInstructionsPage.getGroupsDDown()).click()
        cy.get(AREnrollmentKeyInstructionsPage.getGroupsTxtF()).type('GUIA')
        cy.get(AREnrollmentKeyInstructionsPage.getDDownOpt()).contains(users.groups.guia_group_name).click()
        cy.get(AREnrollmentKeyInstructionsPage.getDDownOpt()).contains(users.groups.guia_group_name2).click()
        cy.get(AREnrollmentKeyInstructionsPage.getGroupsDDown()).click() //close ddown

        //Verify group can be removed
        cy.get(AREnrollmentKeyInstructionsPage.getSelectedOpt()).contains(users.groups.guia_group_name2).parent().within(() => {
            cy.get(AREnrollmentKeyInstructionsPage.getXBtn()).click()
        })

        //Verify Subject field is required
        cy.get(AREnrollmentKeyInstructionsPage.getSubjectTxtF()).clear()
        cy.get(AREnrollmentKeyInstructionsPage.getErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)

        //Enter Valid input into subject field
        cy.get(AREnrollmentKeyInstructionsPage.getSubjectTxtF()).type(instructions.subject)

        //Verify Body field can be edited
        cy.get(AREnrollmentKeyInstructionsPage.getBodyTxtF()).clear().type(`${instructions.body}: `)
        //Add key name to body from snippets
        cy.get(AREnrollmentKeyInstructionsPage.getSnippet()).contains('Key Name').click() 

        //Send instructions
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()

        //Verify toast success message 
        cy.get(AREnrollmentKeyPage.getToastSuccessMsg()).should('contain', "Enrollment key instructions sent.")
        AREnrollmentKeyPage.getHFJobWait() //Wait for jobs to complete
    })
})

describe('AR - Enrollment Keys - Send Instructions - Verify HF Job', function(){

    after(function() {
        //Delete enrollment key via API
        AREnrollmentKeyPage.deleteEKeyViaAPI(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, generalFields.eKeyId)
    })

    it('Verify SendEnrollmentKeyInstructionsJob', () => {
        cy.loginBlatantAdmin()
        let learnerId;
        //Go to Hangfire as Blatant admin, verify Ekey job
        if (Cypress.env('environment') === "qamain") {
            ARHangfireJobsPage.goToSucceededJobsQAMain()
            learnerId = users.learner01.learner01_qamain_id;
        } else if (Cypress.env('environment') === "qa2") {
            ARHangfireJobsPage.goToSucceededJobsQASecondary()
            learnerId = users.learner01.learner01_qa2_id;
        }
            
        //Verify SendEnrollmentKeyInstructionsJob
        cy.get(ARHangfireJobsPage.getJobName()).contains(eKeyJobs.SendEnrollmentKeyInstructionsJob).eq(0).click() //click most recent job of this type
        //Verfify correct client ID, EnrollmentKeyId, Learner01 ID, Email address
        cy.get(ARHangfireJobsPage.getParameterString()).invoke('text').then((text) => {
            let params = JSON.parse(text)
            expect(params.ClientId).to.equal(Cypress.env('client_ID'))
            expect(params.EnrollmentKeyId).to.equal(generalFields.eKeyId)
            expect(params.ToUserIds).to.contain(learnerId)
            expect(params.ToEmailAddresses).to.contain(userDetails.emailAddress)
        })
    })
})