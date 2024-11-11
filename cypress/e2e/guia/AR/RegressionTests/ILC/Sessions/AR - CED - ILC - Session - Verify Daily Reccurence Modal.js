import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { users } from '../../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'


describe('GUIA-Story - NASA-1806 - ILC - Session Recurrence - C919', function(){ 
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Verify Daily Recurring Sessions Modal', () => {
    //Navigate and click Add Sessions button on a new ILC
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Instructor Led')).click()   
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()
        arDashboardPage.getMediumWait()

        //Verify that Add Session modal pops up and contains Add Recurring Classes section after click on Add Sessions button
        cy.get(ARILCAddEditPage.getAddSessionModalContainer()).within(()=>{

            cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Add Recurring Classes').scrollIntoView().should('exist')
            cy.get(ARILCAddEditPage.getAddSessionModalDropDowns()).eq(1).should('contain','None')
            cy.get(ARILCAddEditPage.getAddSessionModalDropDowns()).eq(1).click()
            cy.get(ARILCAddEditPage.getAddSessionModalDropDownItems()).contains('day(s)').click()

            //Verify that Repeat Every and Recur Until sections are existed
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).should('exist')
            cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Recur Until').should('exist')

            //Verify Repeat Every box rounds up decimal numbers
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).clear().type(2.5)
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).should('exist').click()
            arDashboardPage.getMediumWait()
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).should('have.attr','value', 3)
            
            //Verify empty Repeat Every box throws an error
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).clear()
            cy.get(ARILCAddEditPage.getAddSessionRepeatEveryFieldErorrMessage()).should('be.visible')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).should('not.have.value')
            arDashboardPage.getMediumWait()
            
            //Verify Repeat Every box does not accept any data form but a number
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).clear().type("ABC")
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).should('exist').click()
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).click()
            cy.get(ARILCAddEditPage.getAddSessionRepeatEveryFieldErorrMessage()).should('be.visible')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).should('not.have.value')
            
            //Verify Number of Occurrences rounds up decimal numbers
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).clear().type(2.5)
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).click()
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).should('have.attr','value',3)
            
            //Verify Number of Occurrences box does not accept any data form but a number
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).clear().type("ABC")
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).should('exist').click()
            cy.get(ARILCAddEditPage.getAddSessionRepeatEveryFieldErorrMessage()).should('be.visible')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).should('not.have.value')
            
            //Verify that Date option is existed in Recur Until section
            cy.get(ARILCAddEditPage.getAddSessionModalRadioBtns()).contains('Date').should('exist').click()
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Recurrence End Date')).should('be.visible')
            
            
            //Verify that changes can be successfully disappear without any change when user clicks cancel button after passing accurate data set for Number of Occurences and Repeat Every boxes
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).clear().type(3)
            cy.get(ARILCAddEditPage.getAddSessionModalRadioBtns()).contains('Number of Occurrences').click()
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).clear().type(3)
            cy.get(ARILCAddEditPage.getAddSessionModalCancelBtn()).click()
            arDashboardPage.getMediumWait()
        }) 
        //Verify that changes can be successfully saved after passing accurate data set for Number of Occurences and Repeat Every boxes
        cy.get(ARILCAddEditPage.getAddSessionNoSessionMessage()).scrollIntoView().should('be.visible').and('contain','No sessions have been added.')
        
        //Click Add Sessions button to open Add Session Mondal again
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()
        arDashboardPage.getMediumWait()
        cy.get(ARILCAddEditPage.getAddSessionModalContainer()).within(()=>{
            //Fill the required filed to able to save changes
            cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Add Recurring Classes').scrollIntoView().should('exist')
            cy.get(ARILCAddEditPage.getAddSessionModalDropDowns()).eq(1).click()
            cy.get(ARILCAddEditPage.getAddSessionModalDropDownItems()).contains('day(s)').click()

            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Repeat Every')).clear().type(3)
            cy.get(arDashboardPage.getElementByAriaLabelAttribute('Number of Occurrences')).clear().type(3)
            cy.get(ARILCAddEditPage.getAddSessionModalSaveBtn()).click()
            arDashboardPage.getMediumWait()
        })

        cy.get(ARILCAddEditPage.getILCSessionDetailsBtns()).contains('Total Sessions').should('not.be.visible')
    })
})

