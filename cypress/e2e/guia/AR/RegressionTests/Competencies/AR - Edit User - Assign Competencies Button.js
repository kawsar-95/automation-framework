import ARAssignCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARAssignCompetencyPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6846 AUT-762, AR - Edit User - Assign Competencies Button', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        //Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Competencies')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Verify that 
        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        // Save Competency
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        
    })

    beforeEach(() => {
        //Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      
        //Click on users
        cy.get(ARDashboardPage.getUserMenu()).click()
        //Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        //Verify that Users page is open 
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')

        //Select any user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        cy.get(ARDashboardPage.getTableCellName(4)).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        //Click on edit
        cy.get(ARUserPage.getEditUserBtn(),{timeout:15000}).should('have.attr','aria-disabled','false')
        cy.get(ARUserPage.getEditUserBtn()).click()
      
        //Click On Assign Competency
        cy.get(ARCompetencyAddEditPage.getAssignCompetenciesBtn(),{timeout:15000}).should('have.attr','aria-disabled','false')
        cy.get(ARCompetencyAddEditPage.getAssignCompetenciesBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
    })

    after(() => {
        //Delete created competency
      
        ARDashboardPage.A5AddFilter('Name', 'Contains', competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4),{timeout:15000}).should('be.visible')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        
        //Delete created user
        cy.visit('/admin')
      
        //Click on users
        cy.get(ARDashboardPage.getUserMenu()).click()
        //Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete'),{timeout:15000}).should('have.attr','aria-disabled','false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
     
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        
    })

    it("Edit User, Assign Competency and Cancel", () => {
        // Click Cancel
        cy.get(ARAssignCompetencyPage.getA5CancelBtn()).click()
      

        // Verify Admin returned to the Competencies Report
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Competencies')
    })

    it("Edit User, Assign Competency and don't Save", () => {
        //Search for competency and continue
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()
        cy.get(ARAssignCompetencyPage.getSearchCompetencies()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
       
        // Select any Competencies.
        ARAssignCompetencyPage.getCompetenciesDDownOpt(competencyDetails.competencyName.substring(0, 9))
        cy.get(ARAssignCompetencyPage.getCompetenciesChoseBtn()).click()
        

        //Click on plus icon to select user
        cy.get(ARAssignCompetencyPage.getUsersDDown()).click()
        cy.get(ARAssignCompetencyPage.getAddUserTextF()).type(userDetails.username)
        ARAssignCompetencyPage.getUsersDDownOpt(userDetails.firstName.substring(0, 5))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Click Cancel
        cy.get(ARAssignCompetencyPage.getA5CancelBtn()).click()
       

        cy.get(ARUnsavedChangesModal.getUnsavedModalMsg()).should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // Click Cancel form Confirm Modal
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName('Cancel')
       
        // Verify User is remains on the Assign Competencies Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Assign Competencies')

        // Click Cancel
        cy.get(ARAssignCompetencyPage.getA5CancelBtn()).click()
       
        // Verify Warning Message
        cy.get(ARUnsavedChangesModal.getUnsavedModalMsg(),{timeout:15000}).should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // Click don't Save
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName("Don't Save")
       

        // Verify Admin returned to the Competencies Report
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Competencies')
    })

    it('Edit User, Assign Competency and Save', () => {
        //Search for competency and continue
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()
        cy.get(ARAssignCompetencyPage.getSearchCompetencies()).type(competencyDetails.competencyName)

       
        // Select any Competencies.
        ARAssignCompetencyPage.getCompetenciesDDownOpt(competencyDetails.competencyName.substring(0, 9))
        cy.get(ARAssignCompetencyPage.getCompetenciesChoseBtn()).click()
       

        //Click on plus icon to select user
        cy.get(ARAssignCompetencyPage.getUsersDDown()).click()
        cy.get(ARAssignCompetencyPage.getAddUserTextF()).type(userDetails.username)
        ARAssignCompetencyPage.getUsersDDownOpt(userDetails.firstName.substring(0, 5))

        cy.get(ARAssignCompetencyPage.getA5SaveBtn()).click()
       

        // Verify Admin returned to the Competencies Report
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Competencies')
    })

    it('Edit User, Assign Competency and Save from Confirm Modal', () => {
        //Search for competency and continue
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()
        cy.get(ARAssignCompetencyPage.getSearchCompetencies()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        // Select any Competencies.
        ARAssignCompetencyPage.getCompetenciesDDownOpt(competencyDetails.competencyName.substring(0, 9))
        cy.get(ARAssignCompetencyPage.getCompetenciesChoseBtn()).click()
       

        //Click on plus icon to select user
        cy.get(ARAssignCompetencyPage.getUsersDDown()).click()
        cy.get(ARAssignCompetencyPage.getAddUserTextF()).type(userDetails.username)
        ARAssignCompetencyPage.getUsersDDownOpt(userDetails.firstName.substring(0, 5))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Click Cancel
        cy.get(ARAssignCompetencyPage.getA5CancelBtn()).click()
       

        cy.get(ARUnsavedChangesModal.getUnsavedModalMsg()).should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())

        // Click Save from Modal
        cy.get(ARUnsavedChangesModal.getSaveBtn()).click()
       

        // Verify Admin returned to the Competencies Report
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Competencies')
    })
})