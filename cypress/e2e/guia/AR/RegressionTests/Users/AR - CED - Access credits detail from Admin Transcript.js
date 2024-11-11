import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARUserTranscriptPage from '../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage'
import ARCreditsReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCreditsReportPage"

describe('C2076 -  NLE-2812 - Access credits detail from Admin Transcript', () => {
    const learnerUserName = `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))

        ARDashboardPage.getMediumWait()    
        cy.wrap(ARDashboardPage.AddFilter('Full Name', 'Equals', learnerUserName))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('User Transcript'), 1000))
        cy.get(ARUserPage.getAddEditMenuActionsByName('User Transcript')).click({ force: true })
    })

    it('Verify Credit Type total is clickable within the Credits section of the transcript', () => {        
        ARUserTranscriptPage.getMediumWait()
        // Assert that the clickable credit type is behind the feature flag
        cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
            cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).should('exist')
        })

        cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
            cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).its('length')
                .then((len) => {}).as('creditTypeCount')
        })

        // Capture the credit type name for later assertion
        cy.get('@creditTypeCount').then(count => {                 
            cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
                cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).each((el, index) => {
                    // try once to avoid detached element, will check only the 2nd credity type
                    if (index !== 0) {
                        return
                    }
                    cy.wrap(el).find(ARUserTranscriptPage.getCreditTypeNameContainer()).invoke('text').then(creditTypeName => {}).as('creditTypeName')                                   
                })
            })

            // Click the crdit value to natigage to the credit type report
            cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
                cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).each((el, index) => {
                    // From only the 2nd credit value
                    if (index !== 0) {
                        return
                    }
                    cy.wrap(el).find(ARUserTranscriptPage.getCreditTotalContainer()).click()
                    ARUserTranscriptPage.getLongWait()
                    cy.url().should('contain', '/admin/credits')  
                    ARUserTranscriptPage.getMediumWait()  
                })
            })
        })

        // Assert that the selected name is applied in the filter within the Credit report page
        cy.get(ARCreditsReportPage.getElementByDataNameAttribute('data-filter-item')).eq(0).within(() => {
            cy.get(ARCreditsReportPage.getSelectedUserInFilter()).eq(0).should('contain', learnerUserName)
        })

        // Assert that the selected credit type name is applied in the filter within the Credit report page
        cy.get(ARCreditsReportPage.getElementByDataNameAttribute('data-filter-item')).eq(1).click()
        ARCreditsReportPage.getShortWait()
        cy.get('@creditTypeName').then(creditTypeName => {
            cy.get(ARCreditsReportPage.getElementByTitleAttribute(creditTypeName)).should('exist')
        })
        
        // Go back to the user's transcript page
        cy.go('back')
        ARUserTranscriptPage.getMediumWait()
    })

    it('Verify once again that each Credit Type total is clickable within the Credits section of the transcript', () => {            
        ARUserTranscriptPage.getMediumWait()
        // Assert that the clickable credit type is behind the feature flag
        cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
            cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).should('exist')
        })

        cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
            cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).its('length')
                .then((len) => {}).as('creditTypeCount')
        })

        // Capture the credit type name for later assertion
        cy.get('@creditTypeCount').then(count => {                 
            cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
                cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).each((el, index) => {
                    // try once to avoid detached element, will check only the 2nd credity type
                    if (index !== 1) {
                        return
                    }
                    cy.wrap(el).find(ARUserTranscriptPage.getCreditTypeNameContainer()).invoke('text').then(creditTypeName => {}).as('creditTypeName')                                   
                })
            })

            // Click the crdit value to natigage to the credit type report
            cy.get(ARUserTranscriptPage.getElementByAriaLabelAttribute('Completions')).within(() => {
                cy.get(ARUserTranscriptPage.getElementByDataName('credit-item-btn')).each((el, index) => {
                    // From only the 2nd credit value
                    if (index !== 1) {
                        return
                    }
                    cy.wrap(el).find(ARUserTranscriptPage.getCreditTotalContainer()).click()
                    ARUserTranscriptPage.getLongWait()
                    cy.url().should('contain', '/admin/credits')  
                    ARUserTranscriptPage.getMediumWait()  
                })
            })
        })

        // Assert that the selected name is applied in the filter within the Credit report page
        cy.get(ARCreditsReportPage.getElementByDataNameAttribute('data-filter-item')).eq(0).within(() => {
            cy.get(ARCreditsReportPage.getSelectedUserInFilter()).eq(0).should('contain', learnerUserName)
        })

        // Assert that the selected credit type name is applied in the filter within the Credit report page
        cy.get(ARCreditsReportPage.getElementByDataNameAttribute('data-filter-item')).eq(1).click()
        ARCreditsReportPage.getShortWait()
        cy.get('@creditTypeName').then(creditTypeName => {
            cy.get(ARCreditsReportPage.getElementByTitleAttribute(creditTypeName)).should('exist')
        })
        
        // Go back to the user's transcript page
        cy.go('back')
        ARUserTranscriptPage.getMediumWait()    
    })
})