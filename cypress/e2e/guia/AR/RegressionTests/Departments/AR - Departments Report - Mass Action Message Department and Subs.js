import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C1897 AUT-465, AR - Departments Report - Mass Action Message Department and Subs', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()
    })

    it('Verify Message Department and Subs and Cancel the compose', () => {
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departments.Dept_B_name)
        arDepartmentsAddEditPage.selectTableCellRecord(departments.Dept_B_name, 2)
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departments.Dept_C_name)
        arDepartmentsAddEditPage.selectTableCellRecord(departments.Dept_C_name, 2)

        // get department users
        cy.get(arDashboardPage.getTableCellContentByIndex(4)).each((td, index) => {
            cy.get(td).invoke('text').as(`deptUsers${index}`)
        })

        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department and Subs'))
        // 2. Mass action button "Message Department and Subs" should appear
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department and Subs')).should('be.visible').click()

        // 2. Admin should be redirected to the Compose Message page
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Compose Message')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // 3. "Send to" section should default to "Send to departments"
        ARComposeMessage.verifySendToRadioBtn('Send to departments', 'true')

        // 4. The initially selected department should be displayed
        cy.get(ARComposeMessage.getSelectedDepartment()).should('contain', departments.Dept_C_name)
        cy.get(ARComposeMessage.getSelectedDepartment()).should('contain', departments.Dept_B_name)

        // 8. Count displayed should be accurate
        cy.get(ARComposeMessage.getRecipientCount()).invoke('text').then(function(text){
            const totalUsers = Number(this.deptUsers0) + Number(this.deptUsers1)
            expect(text).to.contain(`This message will be sent to ${totalUsers} Users.`)
        })

        // Verify to ensure that a message is displayed to notify the admin IF there
        // are some inactive or non-learner users in the department are included
        cy.get('body').then($body => {
            if ($body.find(ARComposeMessage.getInactiveLearnersMsg()).length) {
                cy.get(ARComposeMessage.getInactiveLearnersMsg()).should('contain', 'Your selection contains inactive learners')
            }
            if ($body.find(ARComposeMessage.getNonlearnersMsg()).length) {
                cy.get(ARComposeMessage.getNonlearnersMsg()).should('contain', 'Your selection contains non-learners')
            }
        })

        // 6. Department should be removed successfully
        ARComposeMessage.removeSelectedDepartmentByName(departments.Dept_B_name)
        cy.get(ARComposeMessage.getSelectedDepartment()).should('not.contain', departments.Dept_B_name)

        // 5. Department should be added successfully and displayed
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getAddDepartmentBtn())).click()
        arSelectModal.SearchAndSelectFunction([departments.Dept_D_name])
        cy.get(ARComposeMessage.getSelectedDepartment()).should('contain', departments.Dept_D_name)
        arDashboardPage.getShortWait()

        // Verify to ensure that a message is displayed to notify the admin IF there
        // are some inactive or non-learner users in the department are included
        cy.get('body').then($body => {
            if ($body.find(ARComposeMessage.getInactiveLearnersMsg()).length) {
                cy.get(ARComposeMessage.getInactiveLearnersMsg()).should('contain', 'Your selection contains inactive learners')
            }
            if ($body.find(ARComposeMessage.getNonlearnersMsg()).length) {
                cy.get(ARComposeMessage.getNonlearnersMsg()).should('contain', 'Your selection contains non-learners')
            }
        })

        // 7. "Send to everyone under these departments" should be pre-selected
        ARComposeMessage.verifyRecipientDepartmentTypeRadioBtn('Send to everyone under these departments', 'true')

        // selecting the [Cancel] from the Message Department and Subs page
        cy.get(ARComposeMessage.getSubmitCancelFilterBtn()).click()
        cy.get(ARUnsavedChangesModal.getOKBtn()).should('be.visible').click()
        cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')

        // 11. Admin should be redirected to the Department report page
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Departments')
    })

    it('Verify Message Department and Subs and Send the Message', () => {
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departments.Dept_B_name)
        arDepartmentsAddEditPage.selectTableCellRecord(departments.Dept_B_name, 2)
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departments.Dept_C_name)
        arDepartmentsAddEditPage.selectTableCellRecord(departments.Dept_C_name, 2)

        // get department users
        cy.get(arDashboardPage.getTableCellContentByIndex(4)).each((td, index) => {
            cy.get(td).invoke('text').as(`deptUsers${index}`)
        })

        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department and Subs'))
        // 2. Mass action button "Message Department and Subs" should appear
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department and Subs')).should('be.visible').click()

        // 2. Admin should be redirected to the Compose Message page
        cy.get(arDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Compose Message')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // 3. "Send to" section should default to "Send to departments"
        ARComposeMessage.verifySendToRadioBtn('Send to departments', 'true')

        // 4. The initially selected department should be displayed
        cy.get(ARComposeMessage.getSelectedDepartment()).should('contain', departments.Dept_C_name)
        cy.get(ARComposeMessage.getSelectedDepartment()).should('contain', departments.Dept_B_name)

        // 8. Count displayed should be accurate
        cy.get('@deptUsers0').then((deptUsers0)=> {
            cy.get('@deptUsers1').then((deptUsers1)=> {
                const totalUsers = Number(deptUsers0) + Number(deptUsers1)
                cy.get(ARComposeMessage.getRecipientCount()).should('contain', `This message will be sent to ${totalUsers} Users.`)
            })
        })

        // Verify to ensure that a message is displayed to notify the admin IF there
        // are some inactive or non-learner users in the department are included
        cy.get('body').then($body => {
            if ($body.find(ARComposeMessage.getInactiveLearnersMsg()).length) {
                cy.get(ARComposeMessage.getInactiveLearnersMsg()).should('contain', 'Your selection contains inactive learners')
            }
            if ($body.find(ARComposeMessage.getNonlearnersMsg()).length) {
                cy.get(ARComposeMessage.getNonlearnersMsg()).should('contain', 'Your selection contains non-learners')
            }
        })

        // 6. Department should be removed successfully
        ARComposeMessage.removeSelectedDepartmentByName(departments.Dept_C_name)
        cy.get(ARComposeMessage.getSelectedDepartment()).should('not.contain', departments.Dept_C_name)

        // 5. Department should be added successfully and displayed
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getAddDepartmentBtn())).click()
        arSelectModal.SearchAndSelectFunction([departments.Dept_E_name])
        cy.get(ARComposeMessage.getSelectedDepartment()).should('contain', departments.Dept_E_name)
        arDashboardPage.getShortWait()

        // Verify to ensure that a message is displayed to notify the admin IF there
        // are some inactive or non-learner users in the department are included
        cy.get('body').then($body => {
            if ($body.find(ARComposeMessage.getInactiveLearnersMsg()).length) {
                cy.get(ARComposeMessage.getInactiveLearnersMsg()).should('contain', 'Your selection contains inactive learners')
            }
            if ($body.find(ARComposeMessage.getNonlearnersMsg()).length) {
                cy.get(ARComposeMessage.getNonlearnersMsg()).should('contain', 'Your selection contains non-learners')
            }
        })

        // 7. "Send to people in these departments only" should be pre-selected
        ARComposeMessage.verifyRecipientDepartmentTypeRadioBtn('Send to everyone under these departments', 'true')

        // selecting the [Send] from the Message Department and Subs page
        cy.get(ARComposeMessage.getSubjectTxtF()).click().type(departmentDetails.messageSubject)
        cy.get(ARComposeMessage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).type(departmentDetails.messageBody)

        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getSendBtn())).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getSendBtn())).click()

        // 11. Admin should be redirected to the Department report page
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Departments')
    })
})