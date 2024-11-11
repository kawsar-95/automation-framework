
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6332 - LE - Regression - Complete an External Training', function(){
    beforeEach(() => {
        //Sign in As a Learner
        cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getLongWait()

        // Open External Training.
        LEDashboardPage.getTileByNameThenClick('External Training')
        LEDashboardPage.getMediumWait()
 
         // Click on the 'x' button
         cy.get(LEDashboardPage.getElementByTitleAttribute('Close External Training')).click()
         LEDashboardPage.getMediumWait()
 
         // Open External Training
         LEDashboardPage.getTileByNameThenClick('External Training')
         LEDashboardPage.getMediumWait()
 
         // Click on the 'cancel' button
         cy.get(LEDashboardPage.getElementByTitleAttribute('Cancel External Training')).click()
         LEDashboardPage.getMediumWait()
 
         // Open External Training
         LEDashboardPage.getTileByNameThenClick('External Training')
         LEDashboardPage.getMediumWait()
 
         // Assert that the note in the bottom have expected text
         cy.get(LEDashboardPage.getBottomNote()).should('have.text', 'Note: You cannot edit the External Training record after submission.')
         LEDashboardPage.getShortWait()

        // Fill Start Date
        cy.get(LEDashboardPage.getDateField()).contains('Start Date').click({force: true})
        LEDashboardPage.getShortWait()
        // Select Date
        LEDashboardPage.getSelectDate(1)
        LEDashboardPage.getShortWait()

        // click out side date picker 
        cy.get(LEDashboardPage.getExternalTrainingHeader()).click()

        // Fill Expiry Date
        cy.get(LEDashboardPage.getDateField()).contains('Expiry Date').click({force: true})
        LEDashboardPage.getShortWait()
        // Select Date
        LEDashboardPage.getSelectDate(2)
        LEDashboardPage.getShortWait()

        // Total Time Spent
        cy.get(LEDashboardPage.getElementByNameAttribute('TotalTimeSpent')).click({force: true}).type('10')

        // Description
        cy.get(LEDashboardPage.getElementByNameAttribute('Description')).click().type('Description')

        // Cost
        cy.get(LEDashboardPage.getElementByNameAttribute('Cost')).click().type('10')

        // Score
        cy.get(LEDashboardPage.getElementByNameAttribute('Score')).click().type('10')

        // Grade
        cy.get(LEDashboardPage.getElementByNameAttribute('Grade')).click().type('Grade')

        // Credits
        cy.get(LEDashboardPage.getElementByNameAttribute('Credits')).click().type('4')

        // Vendor
        cy.get(LEDashboardPage.getElementByNameAttribute('Vendor')).click().type('Vendor')

        // Vendor Address
        cy.get(LEDashboardPage.getElementByNameAttribute('VendorAddress')).click().type('Vendor Address')
    })

    it('Fill all the fields And Submit', () => {       
        // Fill Course Name
        cy.get(LEDashboardPage.getElementByNameAttribute('CourseName')).click({force: true}).type('Course Name')

        // Fill all Completion Date
        cy.get(LEDashboardPage.getDateField()).contains('Completion Date').click()
        LEDashboardPage.getShortWait()
        // Select Date
        LEDashboardPage.getSelectDate(0)
        LEDashboardPage.getShortWait()

        // Submit Button
        cy.get(ARDashboardPage.getSubmitBtn()).click()
        LEDashboardPage.getShortWait()

        // Assert that the form is submitted successfully as all required fields' values are entered
        LEDashboardPage.getTileByNameThenClick('External Training')
        LEDashboardPage.getMediumWait()
    })

    it('Fill all the fields except "Course Name" field and try to submit', () => {       
        cy.get(LEDashboardPage.getDateField()).contains('Completion Date').click({force: true})
        LEDashboardPage.getShortWait()
        LEDashboardPage.getSelectDate(0)
        LEDashboardPage.getShortWait()

        // Submit Button
        cy.get(ARDashboardPage.getSubmitBtn()).click()
        LEDashboardPage.getShortWait()

        // Assert that there is an error visible that prevents form submission
        cy.get(LEDashboardPage.getNameErrorMsg()).scrollIntoView().should('be.visible')
    })

    it('Fill all the fields except "Completion Date" field and try to submit, and logout', () => {       
        // Fill Course Name
        cy.get(LEDashboardPage.getElementByNameAttribute('CourseName')).click({force: true}).type('Course Name')

        // Submit Button
        cy.get(ARDashboardPage.getSubmitBtn()).click()

        // Assert that there is an error visible that prevents form submission
        cy.get(LEDashboardPage.getDateErrorMsg()).eq(1).scrollIntoView().should('be.visible')

        // close the modal dialog
        cy.get(LEDashboardPage.getExternalTrainingModal()).within(() => {
            cy.get('button').eq(0).click()
        })

        // Logout learner
        cy.logoutLearner()
        // Assert that learner has logged out successfully and page is redirected to public-dashboard page
        cy.url().should('include','/#/public-dashboard')
    })
})