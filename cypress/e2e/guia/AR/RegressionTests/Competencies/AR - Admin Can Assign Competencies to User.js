import ARAssignCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARAssignCompetencyPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7341 - AUT-707 - Admin can assign competencies to user', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        //Login as admin
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
   
    it('Create a temporary Competency', () => {
        // Click the Courses menu item
        ARDashboardPage.getCompetenciesReport()
       
        // Verify that 
        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARCompetencyAddEditPage.getNameErrorMsg()).should('have.text', 'Name is required')

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        // Upload modal does not work on Admin Side, Code will be written for this when it is implemented in AE

        // Save Competency
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        
        // ARCompetencyAddEditPage.getA5TableCellRecord(competencyDetails.competencyName);
    })
    it('Assign Competency', () => {
        
        //Click on users
        ARDashboardPage.getUsersReport()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        //Verify that Users page is open 
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
        //Select any user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getTableCellName(4)).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        //Click on edit
        cy.get(ARDashboardPage.getElementByTitleAttribute('Edit User')).should("have.attr","aria-disabled","false")
        cy.get(ARDashboardPage.getElementByTitleAttribute('Edit User')).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        //Click On Assign Competency
        cy.get(ARDashboardPage.getElementByTitleAttribute('Assign Competencies')).click()

        //Search for competency and cancel
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()
        // Click on cancel
        cy.get(ARAssignCompetencyPage.getChooseCompetencyCancelBtn()).click()
       
        cy.get(ARDashboardPage.getAccountHeaderLabel(),{timeout:15000}).should('contain', 'Assign Competencies')
       

        //Search for competency and continue
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()
        cy.get(ARAssignCompetencyPage.getSearchCompetencies()).type(competencyDetails.competencyName)
        
        // Select any Competencies.
        ARAssignCompetencyPage.getCompetenciesDDownOpt(competencyDetails.competencyName.substring(0, 9))
        cy.get(ARAssignCompetencyPage.getCompetenciesChoseBtn()).click()
        

        //Click on plus icon to select user
        cy.get(ARAssignCompetencyPage.getUsersDDown()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARAssignCompetencyPage.getAddUserTextF()).type(userDetails.username)
        ARAssignCompetencyPage.getUsersDDownOpt(userDetails.firstName.substring(0, 5))
        cy.get(ARAssignCompetencyPage.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist") 
        
    })

    after('clean up',() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password,'/admin')
        ARDashboardPage.getCompetenciesReport()
       
        // Verify that 
        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        
        //Delete created competency
        ARDashboardPage.A5AddFilter('Name', 'Contains', competencyDetails.competencyName)
        cy.get(ARDashboardPage.getA5RemoveAllFilterBtn(),{timeout:15000}).should("exist")
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        //here a short wait is necessary
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2),{timeout:15000}).contains(competencyDetails.competencyName).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getA5AddEditMenuActionDeleteBtn()).click()
        
        cy.get(ARDeleteModal.getA5OKBtn()).click()

          //Delete the created User
          cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
          //Cleanup - Get userID and delete them
          cy.get(LEDashboardPage.getNavProfile()).click()  
          cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
          cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
          cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
          cy.url().then((currentURL) => {
              cy.deleteUser(currentURL.slice(-36));
          })

    })
})