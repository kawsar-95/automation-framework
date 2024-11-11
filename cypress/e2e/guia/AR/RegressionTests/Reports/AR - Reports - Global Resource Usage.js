import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { globalResources, resourceDetails } from '../../../../../../helpers/TestData/GlobalResources/globalResources'

describe('AR - Reports - Global Resource Usage', function () {

    before(function() {
        //Store Global resource # Times Accessed value
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Global Resources')
        arDashboardPage.getShortWait()
        //Filter for resource
        A5GlobalResourceAddEditPage.AddFilter('Name', 'Contains', globalResources.resource01Name)
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(globalResources.resource01Name).click()
        //Add column to report
        cy.get(arDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        cy.get(arDashboardPage.getCheckboxList()).contains('Number Of Times Accessed').click()//Store # Times Accessed value
        cy.get(arDashboardPage.getTableCellContentByIndex(5)).invoke('text').then((text) =>{
            globalResources.timesAccessed = parseInt(text);
        })
    })

    it('Verify Learner can Access Global Resource Via Search', () => {
        //Login as learner and search for global resource
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getNavSearch()).click()
        cy.get(LEDashboardPage.getNavSearchTxtF()).eq(0).type(globalResources.resource01Name).type('{enter}')
        //Open global resource
        cy.get(LEDashboardPage.getSearchResultItemName()).contains(globalResources.resource01Name).should('exist').click()
        LEDashboardPage.getMediumWait()
    })

    it('Verify Learner can Access Global Resource Via Dashboard Tile', () => {
        //Login as learner and go to Resources tile
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Resources')
        LEFilterMenu.getSearchForResourceByName(globalResources.resource01Name)
        //Open global resource
        cy.get(LEResourcesPage.getResourceName()).contains(globalResources.resource01Name).click()
        LEDashboardPage.getMediumWait()
    })

    it('Verify Global Resource Usage was Correctly Tracked in Report', () => {
        //Login as admin and filter for global resource
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Global Resources')
        arDashboardPage.getShortWait()
        A5GlobalResourceAddEditPage.AddFilter('Name', 'Contains', globalResources.resource01Name)
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(globalResources.resource01Name).click()
        //Verify # Times Accessed column can be added to report
        cy.get(arDashboardPage.getElementByTitleAttribute('Display Columns')).click() 
        cy.get(arDashboardPage.getCheckboxList()).contains('Number Of Times Accessed').click()

        //Verify # Times Accessed value has increased correctly (by 2)
        cy.get(arDashboardPage.getTableCellContentByIndex(5)).invoke('text').then((text) => {
            globalResources.timesAccessed +2 == parseInt(text);
        })
    })
})