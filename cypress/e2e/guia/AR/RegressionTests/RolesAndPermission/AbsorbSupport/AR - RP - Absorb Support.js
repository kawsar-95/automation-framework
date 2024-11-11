/* 
    AR - Regress - RP - Absorb Support.js
    QAAUT-2549
    GUIA - Cypress - AR - Roles and Permission - Absorb Support
    Manual Test Case: https://jira.absorblms.com/secure/Tests.jspa#/testCase/4298
*/

import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import a5ClientsPage from '../../../../../../../helpers/AR/pageObjects/Setup/A5ClientsPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDashboardAccountMenu from '../../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu.js'
import arUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arViewHistoryModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARViewHistoryModal.js'
import arDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import users from '../../../../../../fixtures/users.json'

let CED_USERNAME = 'GUIA-RP-AS-User'+arUserPage.getTimeStamp();
const CED_USER_FNAME = 'GUIA';
const CED_USER_LNAME = 'RP-AS-User';
const CED_PASSWORD = 'testing1';
const CED_CONFIRMPASSWORD = 'testing1';
const appendText = ' - edited';


let CED_COURSE_NAME = 'GUIA - CED - OC - '+arCoursesPage.getTimeStamp();
//GUIAutoL08

describe('AR - RP - Absorb Support - Sign in to LMS', () => {

    beforeEach( () =>  {
        //should allow access to Absorb Support account
        cy.apiLoginWithSession(users.blatAdmin.ADMIN_BLAT_01_USERNAME, users.blatAdmin.ADMIN_BLAT_01_PASSWORD, '/admin')
        
        
        
    });

    it('should allow access to an AE portal', () => {
        
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain', users.blatAdmin.ADMIN_BLAT_01_FNAME + ' ' + users.blatAdmin.ADMIN_BLAT_01_LNAME);
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup',{timeout:5000}))).click()
        arDashboardPage.getMenuItemOptionByName('Clients')
        a5ClientsPage.getLShortWait();
        cy.wrap(a5ClientsPage.A5AddFilter('Client Name', 'Starts With', `GUIA AR`));
        a5ClientsPage.getShortWait();
        cy.wrap(a5ClientsPage.selectA5TableCellRecord('GUIA AR'));        
        a5ClientsPage.getShortWait();
        cy.wrap(a5ClientsPage.getA5ClientPageSidebar('Absorb Support'));        
        cy.wrap(a5ClientsPage.getA5ClientPageAbsorbSupportModalOK())
    })

    it('should verify that Absorb Support has sysadmin access', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        cy.get(arDashboardPage.getMenuItem()).contains('Clients').should('exist')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click();
        arDashboardPage.getShortWait();
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click();
        arDashboardPage.getVShortWait();
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('be.visible');
    })

    it('should verify that Absorb Support cannot change password and user settings', () => {
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click();
        arDashboardPage.getShortWait();
        cy.get(arDashboardAccountMenu.getChangePasswordBtn()).should('be.visible');
        cy.get(arDashboardAccountMenu.getUserSettingsBtn()).should('be.visible');
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click();        
    })    

    it('should verify that Absorb Support is not visible as a record on Users Report', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click();        
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users')); 
        arDashboardPage.getShortWait()      
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', 'AbsorbSupport'));
        arUserPage.getMediumWait()
        cy.wrap(arUserPage.verifyTableCellRecordDoesNotExist('AbsorbSupport'));
    })     

    it('should verify that Absorb Support can CED a learner', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click();
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'));
        cy.intercept('**/admin/reports/users').as('getUsersReport').wait('@getUsersReport');        
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `${CED_USERNAME}`));
        arUserPage.getLShortWait()
        if(arUserPage.verifyTableCellRecordDoesNotExist(`${CED_USERNAME}`)){
            cy.get(arUserPage.getAddEditMenuActionsByName('Add User')).click()
            cy.get(arUserAddEditPage.getFirstNameTxtF()).clear().type(`${CED_USER_FNAME}`)
            cy.get(arUserAddEditPage.getLastNameTxtF()).clear().type(`${CED_USER_LNAME}`)
            cy.get(arUserAddEditPage.getEmailAddressTxtF()).type(`qa.guiauto1@absorblms.com`)
            cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(`${CED_USERNAME}`)
            cy.get(arUserAddEditPage.getPasswordTxtF()).clear().type(`${CED_PASSWORD}`)
            cy.get(arUserAddEditPage.getConfirmPasswordTxtF()).clear().type(`${CED_CONFIRMPASSWORD}`)
            cy.get(arUserAddEditPage.getDepartmentTxtF()).click()
            ARSelectModal.SearchAndSelectFunction(['Top Level Dept'])
            cy.wrap(arUserPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), arUserAddEditPage.getShortWait()))
            cy.get(arUserAddEditPage.getSaveBtn()).click()
            
        } else {

            cy.get(arUserPage.getRemoveFilterBtn()).click()
            cy.wrap(arUserPage.AddFilter('Username', 'Contains', `${CED_USERNAME}`));
            arUserPage.getLShortWait()
            cy.wrap(arUserPage.selectTableCellRecord(`${CED_USERNAME}`));
            cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), arUserPage.getShortWait()))
            cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
            cy.wrap(arUserPage.WaitForElementStateToChange(arUserAddEditPage.getUsernameTxtF()))
            cy.get(arUserPage.getAddEditMenuActionsByName('View History')).click()
            cy.get(arViewHistoryModal.getViewHistoryCreatedBy()).contains('Absorb Support '+ users.blatAdmin.ADMIN_BLAT_01_USERNAME);
            arViewHistoryModal.getLShortWait()
            cy.get(arViewHistoryModal.getViewHistoryCloseBtn()).click();
            cy.get(arUserPage.getCancelBtn()).click();
            arDeleteModal.getDeleteItem()
            arUserPage.getShortWait()
        }
       
    })

    it('should verify that Absorb Support can impersonate a learner', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click();        
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'));
        cy.intercept('**/users/operations').as('getUsersOperations').wait('@getUsersOperations');        
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `${users.learner01.LEARNER_01_USERNAME}`))
        arUserPage.getLShortWait()
        cy.wrap(arUserPage.selectTableCellRecord(`${users.learner01.LEARNER_01_USERNAME}`));
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Impersonate'), arUserPage.getShortWait()));
        cy.get(arUserPage.getAddEditMenuActionsByName('Impersonate')).click();
        LEDashboardPage.getMediumWait();
        cy.intercept('**/my-catalog?_sort=name&showCompleted=true').as('getLearnerCatalog').wait('@getLearnerCatalog');        
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('be.visible').contains('Welcome')
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        cy.get(LEDashboardPage.getMenuItems()).find('button').contains('Stop Impersonating').click()
    })

    it('should verify that Absorb Support can CED a Course', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click();
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'));    
         
        arDashboardPage.getShortWait();

        cy.wrap(arCoursesPage.AddFilter('Name', 'Starts With', `${CED_COURSE_NAME}`));
        
        if(arUserPage.verifyTableCellRecordDoesNotExist(`${CED_COURSE_NAME}`)){
            cy.createCourse('Online Course', CED_COURSE_NAME)
            cy.publishCourse()
        }

        /* should be enabled once course auditing story is done by AE team - 
        currently has a bug where in Absorb Support is recoded as System instead of Absorb Support on View History

        cy.wrap(arCoursesPage.AddFilter('Name', 'Starts With', `${CED_COURSE_NAME}`));
        cy.wrap(arCoursesPage.selectTableCellRecord(`${CED_COURSE_NAME}`))
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getEditBtn()))
        cy.get(arCoursesPage.getEditBtn()).click()
        cy.get(arCoursesPage.getAddEditMenuActionsByName('View History')).click()
        cy.get(arViewHistoryModal.getViewHistoryCreatedBy()).contains('Absorb Support '+ users.blatAdmin.ADMIN_BLAT_01_USERNAME);
        cy.get(arViewHistoryModal.getViewHistoryCloseBtn()).click();
        cy.get(arUserPage.getCancelBtn()).click();        
        */

        cy.wrap(arCoursesPage.selectTableCellRecord(`${CED_COURSE_NAME}`))
        arDeleteModal.getDeleteItem()
        arUserPage.getShortWait()
        cy.wrap(arUserPage.verifyTableCellRecordDoesNotExist(`${CED_COURSE_NAME}`));
    })       
})