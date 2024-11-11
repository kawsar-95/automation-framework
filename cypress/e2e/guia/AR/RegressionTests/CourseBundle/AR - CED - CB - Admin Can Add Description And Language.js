import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREditClientInfoPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage"
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C957 - AR - CED - CB - Admin Can Add Description And Language', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('Add Description and language in create course bundle', () => {
     
        // Navigate to courses
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Course Bundle')).click()

       
        // A language can be selected for a Course Bundle
        cy.get(ARCBAddEditPage.getGeneralLanguageDDown()).should('be.visible')
        cy.get(ARCBAddEditPage.getGeneralLanguageDDown()).click({ force: true })
        cy.get(ARCBAddEditPage.getGeneralLanguageDDownOpt()).contains(cbDetails.language).click({ force: true })
        // A description can be set for a course bundle
        cy.get(ARCBAddEditPage.getDescriptionTxtF()).type(cbDetails.description).type('{selectall}')
        cy.get(ARDashboardPage.getBoldBtn()).click()
        cy.get(ARDashboardPage.getItalicBtn()).click()
        cy.get(ARDashboardPage.getUnderlineBtn()).click()

        // The General section is ordered as per story details
        cy.get(ARDashboardPage.getElementByDataNameAttribute('edit-course-bundle-general-section')).within(() => {
            // Order existing and additional components (added below) in the proper order
            cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Status').should('exist')
            cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Title').should('exist')
            cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Description').should('exist')
            cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Language').should('exist')
            cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Tags').should('exist')
            cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Automatic Tagging').should('exist')

        })

    })
    it(' Lists all languages set at portal level', () => {
       
        // Navigate to Portal Settings
        cy.get(ARDashboardPage.getElementByDataNameAttribute('button-account')).should('exist')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('button-account')).click()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Portal Settings')).click()
     
        // Go to Admin Privacy Policy
        cy.get(ARDashboardPage.getListItem()).contains('Admin Privacy Policy').click()
        // Get total number of languages
        cy.get(AREditClientInfoPage.getLanguageListItem()).its('length').then((length) => {
            cy.wrap(length).as('length')
            let i = 0
            var a = []
            for (i = 0; i < length; i++) {
                cy.get(AREditClientInfoPage.getLanguageListItem()).eq(i).invoke('text').then((text) => {
                    a.push(text)
                })
            }
            // Get list of available languages
            cy.wrap(a).as('languages')
        })
        cy.visit('admin/courseBundles/add')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARCBAddEditPage.getGeneralLanguageDDown()).click({ force: true })

        cy.get(ARCBAddEditPage.getLanguageOptionItems()).within(() => {
            cy.get('@length').then((length) => {
                // Compare total language length
                cy.get(ARCBAddEditPage.getGeneralLanguageDDownOpt()).its('length').then((length1) => {
                    expect(length).equals(length1)
                })
                cy.get('@languages').then((languages) => {
                    let j = 0
                    for (j = 0; j < languages.length; j++) {
                        // Compare each language from portal exists in CB
                        cy.get(ARCBAddEditPage.getGeneralLanguageDDownOpt()).should('contain', languages[j])
                    }
                })
            })
        })


    })
})