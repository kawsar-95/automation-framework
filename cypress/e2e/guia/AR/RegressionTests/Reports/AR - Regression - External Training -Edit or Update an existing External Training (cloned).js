import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARExternalTrainingPage from "../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage"

describe('C7390 - AR - Regression - External Training - Edit or Update an existing External Training (cloned)', function(){
    
    beforeEach('Login as an Admin go to External Training', function(){
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataName('title')).should('contain.text','Reports')
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('External Training'))
        ARDashboardPage.getMediumWait()
    })

    it('External training page should be displayed', function(){
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('exist')
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain.text','External Training')
    })

    it('External Training from the list of External Training Activity', function(){
        cy.get(ARExternalTrainingPage.getSidebarTitles()).should('not.exist')
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        // Action items should exist
        cy.get(ARExternalTrainingPage.getSidebarTitles()).should('exist')
    })

    it('Edit External Training Submission Page should be displayed', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getEditButton()).should('exist')
        cy.get(ARExternalTrainingPage.getEditButton()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain.text','Edit External Training Submission')

        cy.get(ARExternalTrainingPage.getEditExternalTrainingMarkAsRadio()).contains('Approved').should('exist')
        cy.get(ARExternalTrainingPage.getEditExternalTrainingMarkAsRadio()).contains('Declined').should('exist')
        
        cy.get(ARExternalTrainingPage.getEditExternalTrainingMarkAsRadio()).contains('Approved').click()
        cy.get(ARExternalTrainingPage.getEditExternalTrainingMarkAsRadioSelected()).contains('Approved').should('exist')

        cy.get(ARExternalTrainingPage.getEditExternalTrainingMarkAsRadio()).contains('Declined').click()
        cy.get(ARExternalTrainingPage.getEditExternalTrainingMarkAsRadioSelected()).contains('Declined').should('exist')
    })

    it('Edit External Training Submission Page Field', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()

        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getEditButton()).click()
        ARExternalTrainingPage.getLShortWait()

        ARExternalTrainingPage.getDateElementByLabelAndClick('Completion Date') // open the date
        cy.get(ARExternalTrainingPage.getDateElementClearItem()).click()        // clear the date
        ARExternalTrainingPage.getDateElementByLabelAndClick('Completion Date') // open the date
        cy.get(ARExternalTrainingPage.getDateElementSelectedToday()).click()    // select today
        
        ARExternalTrainingPage.getDateElementByLabelAndClick('Start Date')      // open the date
        cy.get(ARExternalTrainingPage.getDateElementClearItem()).click()        // clear the date
        ARExternalTrainingPage.getDateElementByLabelAndClick('Start Date') // open the date
        cy.get(ARExternalTrainingPage.getDateElementSelectedToday()).click()    // select today

        ARExternalTrainingPage.getDateElementByLabelAndClick('Expiry Date')     // open the date
        cy.get(ARExternalTrainingPage.getDateElementClearItem()).click()        // clear the date
        ARExternalTrainingPage.getDateElementByLabelAndClick('Expiry Date') // open the date
        cy.get(ARExternalTrainingPage.getDateElementSelectedToday()).click()    // select today

        cy.get(ARExternalTrainingPage.getElementByNameAttribute('CourseName')).clear().type('Test Course Name')
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('TotalTimeSpent')).clear().type(100)
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('Description')).clear().type('Description')
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('Cost')).clear().type('Cost')
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('Score')).clear().type(100)
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('Grade')).clear().type('Grade')
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('Credits')).clear().type(123)
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('Vendor')).clear().type('Vendor')
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('VendorAddress')).clear().type('Vendor Address')
    })

    it('Edit External Training Submission Page Modal Exist', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getEditButton()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('CourseName')).type('a')

        cy.get(ARExternalTrainingPage.getCancelButton()).click()
        ARExternalTrainingPage.getShortWait()

        // Should open modal
        cy.get(ARExternalTrainingPage.getConfirmModal()).should('be.visible')
        cy.get(ARExternalTrainingPage.getConfirmModal()).find(ARExternalTrainingPage.getConfirmModalBtnLinks()).should('contain', 'Save')
        cy.get(ARExternalTrainingPage.getConfirmModal()).find(ARExternalTrainingPage.getConfirmModalBtnLinks()).should('contain', "Don't Save")
        cy.get(ARExternalTrainingPage.getConfirmModal()).find(ARExternalTrainingPage.getConfirmModalBtnLinks()).should('contain', 'Cancel')
    })

    it('Edit External Training Submission Page Modal Cancel', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getEditButton()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('CourseName')).type('a')

        cy.get(ARExternalTrainingPage.getCancelButton()).click()
        ARExternalTrainingPage.getShortWait()

        cy.get(ARExternalTrainingPage.getConfirmModalCancelButton()).click()
        //Navigate should be External Training Page
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain.text','Edit External Training Submission')
    })

    it('Edit External Training Submission Page Modal Dont Save', function(){
        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getEditButton()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('CourseName')).type('a')

        cy.get(ARExternalTrainingPage.getCancelButton()).click()
        ARExternalTrainingPage.getShortWait()

        cy.get(ARExternalTrainingPage.getConfirmModalDontSaveButton()).click()
        //Navigate should be External Training Page
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain.text','External Training')
    })

    it('Edit External Training Submission Page Modal Save', function(){
        let timestamp = ARExternalTrainingPage.getTimeStamp()
        // If we use hardcoded text next test will fail because text field will be unchanged

        // Select first row
        cy.get(ARExternalTrainingPage.getExternalTrainingFirstResultItem()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getEditButton()).click()
        ARExternalTrainingPage.getShortWait()
        cy.get(ARExternalTrainingPage.getElementByNameAttribute('CourseName')).clear().type(timestamp)

        cy.get(ARExternalTrainingPage.getCancelButton()).click()
        ARExternalTrainingPage.getShortWait()

        cy.get(ARExternalTrainingPage.getConfirmModalSaveButton()).click()
        ARExternalTrainingPage.getShortWait()
        //Navigate should be External Training Page
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain.text','External Training')

        cy.get(ARExternalTrainingPage.getExternalTrainingSelectedResultItem()).next().should('contain.text',timestamp)
    })
})

