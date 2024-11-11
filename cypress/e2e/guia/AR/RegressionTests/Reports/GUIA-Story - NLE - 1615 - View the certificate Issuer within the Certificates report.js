import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCertificateReportPage, {certificateData} from "../../../../../../helpers/AR/pageObjects/Reports/ARCertificateReportPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-413 - C1773 - GUIA-Story - NLE - 1615 - View the certificate Issuer within the Certificates report', () => {
    before('Edit a Certificate to add Issuer name', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCertificatesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARDashboardPage.getA5AddFilterBtn(), {timeout:10000}).scrollIntoView()
        // Filter Certificate
        ARDashboardPage.A5AddFilter('Course', 'Starts With', courses.oc_02_admin_approval_naNAME)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).eq(0).should('contain', courses.oc_02_admin_approval_naNAME).click()

        cy.get(ARCertificateReportPage.getSidebarMenu()).contains('Edit', {timeout: 3000}).click()
        cy.get(ARCertificateReportPage.getIssuerTextInput()).invoke('val', certificateData.ISSUER_NAME1)
        cy.get(ARCertificateReportPage.getSaveModifyBtn()).click()  
        cy.get(ARCertificateReportPage.getGridLoaderOverlay(), {timeout: 3000}).should('not.be.visible')
    })

    it('Certificate Issuer within the Certificates Report', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCertificatesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        // Add Certificate Issuer column in the column headers
        cy.get(ARDashboardPage.getDisplayColumns()).click({force:true})
        cy.get(ARCertificateReportPage.getColumnFilterLabel()).contains('Certificate Issuer').should('exist').click()
        // Close Display Menu
        cy.get(ARDashboardPage.getDisplayColumns()).click({force:true}) 

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        // Assert that the Certificate Issuer column is added at the last (right most column in the column headers)
        cy.get(ARCertificateReportPage.getLayoutMenuItems()).its('length').as('colHeaderCount')
        cy.get('@colHeaderCount').then(count => {
            cy.get(ARCertificateReportPage.getLayoutMenuItems()).each((el, index) => {
                if (el.text === 'Certificate Issuer') {
                    cy.wrap(index).should('be.eq', count - 1)
                }
            })
        })
        
        cy.get('@colHeaderCount').then(count => {
            cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(count).invoke('text').then(issuerName => {
                // Sort by Certificate Issuer column                
                cy.get(ARCertificateReportPage.getIssuerColumnHeader()).click()
                cy.get(ARCertificateReportPage.getGridLoaderOverlay(), { timeout: 10000 }).should('not.be.visible')
                // Assert that the Certificate Issuer column has been sorted
                cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(count).invoke('text').then(sortedIssuerName => {
                    expect(sortedIssuerName).not.to.be.eq(issuerName)
                })
            })            
        })
        
        // Filter by Certificate Issuer column
        cy.get(ARCertificateReportPage.getIssuerColumnHeaderFilter(), {timeout: 3000}).click()
        cy.get(ARCertificateReportPage.getA5ValueTxtF()).type(certificateData.ISSUER_NAME1);
        cy.get(ARCertificateReportPage.getA5SubmitAddFilterBtn()).click();
        cy.get(ARCertificateReportPage.getA5SubmitAddFilterBtn(), {timeout:10000}).should('not.exist')
        cy.get(ARCertificateReportPage.getGridLoaderOverlay(), { timeout: 10000 }).should('not.be.visible')
        // Assert that the Certificate is filtered by the given Issuer name
        cy.get('@colHeaderCount').then(count => {
            cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(count - 1).invoke('text').then(issuerName => {
                expect(issuerName).contains(certificateData.ISSUER_NAME1)
            })
        })
    })
})