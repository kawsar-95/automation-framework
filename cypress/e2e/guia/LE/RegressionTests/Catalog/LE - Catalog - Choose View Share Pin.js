import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import { users } from "../../../../../../helpers/TestData/users/users";

describe('C6320 - LE - Catalog - Choose View | Share | Pin', function () {
    beforeEach(() => {
        cy.viewport(1280, 768)
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, "/#/catalog")
    })

    it('Share, pin, and unpin a source in Card View', () => {
        // Click on the 'Choose View' button
        cy.get(LECatalogPage.getElementByAriaLabelAttribute('Choose View')).click()
        LECatalogPage.getShortWait()
        // Click on the 'Card View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Card View')).click()
        // tryin hover course using trigger
        cy.get(LECatalogPage.getCardCourse()).eq(0).should('be.visible')
        cy.get(LECatalogPage.getCardCourse()).eq(0).trigger('mouseover')
        // Click on the pin button
        cy.get(LECatalogPage.getCardCourse()).eq(0).find('button').eq(1).click({force:true})
        LECatalogPage.getMediumWait()

        // Assert that a message appears with test 'Pinned successfully.'
        cy.get(LECatalogPage.getToastNotificationMsg()).contains('Pinned successfully.')
        // Assert that the course has been pinned successfully
        cy.get(LECatalogPage.getCardCourse()).eq(0).find(LECatalogPage.getPinBtnActive()).eq(0).should('exist');

        // Click on the pin button again to unpin
        cy.get(LECatalogPage.getCardCourse()).eq(0).find('button').eq(1).click({force:true})
        LECatalogPage.getMediumWait()
        // Assert that a message appears with test 'Unpinned successfully.'
        cy.get(LECatalogPage.getToastNotificationMsg()).contains('Unpinned successfully.')
        // Assert that the course has been un-pinned successfully
        cy.get(LECatalogPage.getPinBtnActive()).should('not.exist')

        // Click on the Share button
        cy.get(LECatalogPage.getCardCourse()).eq(0).find('button').eq(0).click({force:true})
        // Click on the 'Copy link' button.
        cy.get(LECatalogPage.getCopyLinkBtn()).find('button').click()
        // Asssert that a share link has been copied and a message is diplayed
        cy.get(LECatalogPage.getShareCopiedMsg()).should('exist')
    })

    it('Share, pin, and unpin a source in Detail View', () => {
        // Click on the 'Choose View' button
        cy.get(LECatalogPage.getElementByAriaLabelAttribute('Choose View')).click()
        // Click on the 'Detail View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Detail View')).click()
        cy.get(LECatalogPage.getDetailCourse()).eq(0).should('be.visible')
        // Click on the pin button
        cy.get(LECatalogPage.getElementByTitleAttribute('Course Options')).eq(0).click()
        LECatalogPage.getShortWait()
        cy.get(LECatalogPage.getMenuItem()).eq(1).click({force:true})

        cy.get(LECatalogPage.getToastNotificationMsg()).contains('Pinned successfully.')
        cy.get(LECatalogPage.getElementByTitleAttribute('Course Options')).eq(0).click()
        cy.get(LECatalogPage.getPinBtnActive()).should('exist')

        // Click on the pin button again
        cy.get(LECatalogPage.getMenuItem()).eq(1).click({force:true})
        LECatalogPage.getMediumWait()
        cy.get(LECatalogPage.getToastNotificationMsg()).contains('Unpinned successfully.')
        cy.get(LECatalogPage.getPinBtnActive()).should('not.exist')

        // Click on the Share button
        cy.get(LECatalogPage.getElementByTitleAttribute('Course Options')).eq(0).click()
        cy.get(LECatalogPage.getMenuItem()).eq(0).click({force:true})

        // Click on the 'Copy link' button.
        cy.get(LECatalogPage.getCopyLinkBtn()).find('button').click()
        cy.get(LECatalogPage.getShareCopiedMsg()).should('exist')
    })

    it('Share, pin, and unpin a source in List View', () => {
        // Click on the 'Choose View' button
        cy.get(LECatalogPage.getElementByAriaLabelAttribute('Choose View')).click()
        // Click on the 'List View'
        cy.get(LECatalogPage.getElementByTitleAttribute('List View')).click()
        cy.get(LECatalogPage.getListCourse()).eq(0).should('be.visible')

        // Click on the pin button
        cy.get(LECatalogPage.getElementByTitleAttribute('Course Options')).eq(0).click()
        cy.get(LECatalogPage.getMenuItem()).eq(1).click({force:true})
        LECatalogPage.getMediumWait()
        cy.get(LECatalogPage.getToastNotificationMsg()).contains('Pinned successfully.')
        cy.get(LECatalogPage.getElementByTitleAttribute('Course Options')).eq(0).click()
        cy.get(LECatalogPage.getPinBtnActive()).should('exist')
        // Click on the pin button again
        cy.get(LECatalogPage.getMenuItem()).eq(1).click({force:true})
        LECatalogPage.getMediumWait()
        
        cy.get(LECatalogPage.getToastNotificationMsg()).contains('Unpinned successfully.')
        cy.get(LECatalogPage.getPinBtnActive()).should('not.exist')

        // Click on the Share button
        cy.get(LECatalogPage.getElementByTitleAttribute('Course Options')).eq(0).click()
        cy.get(LECatalogPage.getMenuItem()).eq(0).click({force:true})
        // Click on the 'Copy link' button.
        cy.get(LECatalogPage.getCopyLinkBtn()).find('button').click()

        cy.get(LECatalogPage.getShareCopiedMsg()).should('exist')
        cy.get(LECatalogPage.getShareModalCloseBtn()).eq(0).click()        
    })

    it('Choose Calendar View, Validate Date, and Logout', () => {
        // Click on the 'Choose View' button
        cy.get(LECatalogPage.getElementByAriaLabelAttribute('Choose View')).click()
        // Click on the 'List View'
        cy.get(LECatalogPage.getElementByTitleAttribute('Calendar View')).click()
        cy.get(LECatalogPage.getCalendarSelectedDateContainer()).invoke('text').then(today => expect(today).eq(new Date().getDate().toString()))

        // log out learner
        cy.logoutLearner()
        // Assert that learner has logged off successfully
        cy.url().should('include', '/#/public-dashboard')
    })
})