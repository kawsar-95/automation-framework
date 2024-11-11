import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { competencies } from '../../../../../../helpers/TestData/Competency/competencies'
import ARLearnerCompetenciesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerCompetenciesReportPage'

const defaultLayoutItemsInOrder = ['Last Name', 'First Name', 'Department', 'Competency Name', 'Competency Level']
const defaultActionMenuItemsInOrder = ['Edit User', 'Message User', 'User Transcript', 'Delete Learner Competency', 'Deselect']

describe('GUIA-Auto-AE Regression || Reports || Learner Competencies - C5142', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit Learner Competencies report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Competencies'))

        //Verify default layout order
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            ARLearnerCompetenciesReportPage.getVerifyLayoutMenuItemByNameAndIndex(i ,defaultLayoutItemsInOrder[i])
        }

        //add user and competencies
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getSideBarMenu()).contains('Assign Competencies').click()
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getChooseField()).click().type(users.learner01.learner_01_username)
        cy.get(ARLearnerCompetenciesReportPage.getUserName()).contains(users.learner01.learner_01_username).click()
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getAddCompetenciesBtn()).click()
        cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModal()).within(()=>{
            cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModalCompetencies()).eq(62).click()
            cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModalContinueBtn()).click()       
        })

        //click cancel and verify the cancel message
        cy.get(ARLearnerCompetenciesReportPage.getSideBarMenu()).contains('Cancel').click()
        cy.get(ARLearnerCompetenciesReportPage.getUnsavedChangesModal()).should('be.visible')
        cy.get(ARLearnerCompetenciesReportPage.getUnsavedChangesModal()).should('contain', ARLearnerCompetenciesReportPage.getCancelMessage())
        cy.get(ARLearnerCompetenciesReportPage.getUnsavedChangesModal()).within(()=>{
            cy.get(ARLearnerCompetenciesReportPage.getCancelBtn()).click()
        })

        //click save and navigate to Compentencies
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getSideBarMenu()).contains('Cancel').click()
        cy.get(ARLearnerCompetenciesReportPage.getUnsavedChangesModal()).should('be.visible')
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getUnsavedChangesModal()).within(()=>{
         cy.get(ARLearnerCompetenciesReportPage.getSaveBtn()).click()
        })
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getCompetenciesModal()).should('contain', 'Competencies')
    })
    it('The user wants to visit Learner Competencies report page and see default layout in order', () => {

        //click assign and naviate to Competencies
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Competencies'))
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getSideBarMenu()).contains('Assign Competencies').click()
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getChooseField()).click().type(users.learner01.learner_01_username)
        cy.get(ARLearnerCompetenciesReportPage.getUserName()).contains(users.learner01.learner_01_username).click()
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getAddCompetenciesBtn()).click()
        cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModal()).within(()=>{
            cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModalCompetencies()).eq(62).click()
            cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModalContinueBtn()).click()       
        })
        cy.get(ARLearnerCompetenciesReportPage.getSideBarMenu()).contains('Assign').click()
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getCompetenciesModal()).should('contain', 'Competencies')
    })

    it('The user wants to visit Learner Competencies report page and see default layout in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Competencies'))

        //Verify default layout order
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            ARLearnerCompetenciesReportPage.getVerifyLayoutMenuItemByNameAndIndex(i ,defaultLayoutItemsInOrder[i])
        }

      //add user and competencies
      LEDashboardPage.getShortWait()
      cy.get(ARLearnerCompetenciesReportPage.getSideBarMenu()).contains('Assign Competencies').click()
      LEDashboardPage.getShortWait()
      cy.get(ARLearnerCompetenciesReportPage.getChooseField()).click().type(users.learner01.learner_01_username)
      cy.get(ARLearnerCompetenciesReportPage.getUserName()).contains(users.learner01.learner_01_username).click()
      LEDashboardPage.getShortWait()
      cy.get(ARLearnerCompetenciesReportPage.getAddCompetenciesBtn()).click()
      cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModal()).within(()=>{
          cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModalCompetencies()).eq(62).click()
          cy.get(ARLearnerCompetenciesReportPage.getSelectCompetenciesModalContinueBtn()).click()       
      })

        //click assign and naviate to Competencies
        cy.get(ARLearnerCompetenciesReportPage.getSideBarMenu()).contains('Assign').click()
        LEDashboardPage.getShortWait()
        cy.get(ARLearnerCompetenciesReportPage.getCompetenciesModal()).should('contain', 'Competencies')
    })

    it('The user wants to visit Learner Competencies report page and see Learner Competencies menu items in order', () => {
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Competencies'))

        //Verify default action menu items in order
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        LEDashboardPage.getShortWait()
        for(let i = 0; i < defaultActionMenuItemsInOrder.length; i++){
            ARLearnerCompetenciesReportPage.getActionMenuItemsInOrder(i,defaultActionMenuItemsInOrder[i])
        }
        cy.get(ARLearnerCompetenciesReportPage.getRightActionMenuContainer()).contains('Deselect').click()
   })
})