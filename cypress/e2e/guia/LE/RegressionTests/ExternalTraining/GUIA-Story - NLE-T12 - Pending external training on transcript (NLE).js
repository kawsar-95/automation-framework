import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import ARExternalTrainingPage, { externalTrainingDetails } from "../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LETranscriptPage from "../../../../../../helpers/LE/pageObjects/User/LETranscriptPage"
import { users } from "../../../../../../helpers/TestData/users/users"

let externalTrainingCourses = []

describe('AUT-402 - C1751 - GUIA-Story - NLE-T12 - Pending external training on transcript (NLE)', () => {

    before('Create one Pending and one Approved External Training from the Learner side', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Learner Experience
        ARDashboardAccountMenu.goToLearnerExperience()

        LEDashboardPage.addExternalTraining('External Training', externalTrainingDetails.externalTrainingName, externalTrainingCourses)
        LEDashboardPage.addExternalTraining('No Admin Approval', externalTrainingDetails.externalTrainingName2, externalTrainingCourses)
    })

    it('Verify External Training records in "Pending" status are displayed', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Go to Learner Experience
        ARDashboardAccountMenu.goToLearnerExperience()

        // Go to Learner Transacript page
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
        // Verify that the 'Status' column has been added
        cy.get(LETranscriptPage.getExternalTrainingTableHeader()).should('contain', 'Status')
        // Verify that the status is Pending and Approved
        cy.get(LETranscriptPage.getExternalTrainingCourseNames()).each(courseLabel => {
            if (courseLabel.text().includes(externalTrainingDetails.externalTrainingName)) {
                cy.wrap(courseLabel.parent()).next().find(LETranscriptPage.getExternalTrainingStatusLabel()).should('contain', 'Pending')
            }

            if (courseLabel.text().includes(externalTrainingDetails.externalTrainingName2)) {
                cy.wrap(courseLabel.parent()).next().find(LETranscriptPage.getExternalTrainingStatusLabel()).should('contain', 'Approved')
            }
        })

        // Go to Admin side
        LESideMenu.openSideMenu()
        cy.get(LESideMenu.getAdminMenuItem(), {timeout: 1000}).click()
        cy.url().should('contain', '/dashboard', {timeout: 7500})
        ARDashboardPage.getExternalTrainingReport()

        ARExternalTrainingPage.assertExternalTrainingStatus(externalTrainingDetails.externalTrainingName, 'Pending Approval')
        ARExternalTrainingPage.assertExternalTrainingStatus(externalTrainingDetails.externalTrainingName2, 'Approved')
    })

    it('Decline an external training', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARExternalTrainingPage.getWaitSpinner(), {timeout: 3000}).should('not.exist', {timeout: 60000})
        ARDashboardPage.getExternalTrainingReport()
        ARExternalTrainingPage.A5AddFilter('Course Name', 'Contains', externalTrainingDetails.externalTrainingName)
        cy.get(ARExternalTrainingPage.getA5WaitSpinner(), {timeout: 3000}).should('not.exist')
        cy.get(ARExternalTrainingPage.getGridTable()).eq(0).click()
        cy.get(ARExternalTrainingPage.getDeclineButton(), {timeout: 3000}).click()
    })

    it('Verify that the "Declined" external training does not show up in the learner side', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        ARDashboardAccountMenu.goToLearnerExperience()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
        // Verify that the "Declined" external training does not show up
        cy.get(LETranscriptPage.getExternalTrainingCourseNames(), {timeout: 3000}).should('not.include.text', externalTrainingDetails.externalTrainingName)

        LESideMenu.openSideMenu()
        cy.get(LESideMenu.getAdminMenuItem(), {timeout: 1000}).click()
        cy.url().should('contain', '/dashboard', {timeout: 7500})
        ARDashboardPage.getExternalTrainingReport()
        // Delete the external trainings
        if (externalTrainingCourses.length > 0) {
            ARExternalTrainingPage.A5AddFilter('Course Name', 'Contains', externalTrainingCourses[0])
            cy.get(ARExternalTrainingPage.getA5WaitSpinner(), {timeout: 3000}).should('not.exist')        

            cy.get(ARExternalTrainingPage.getGridTable()).eq(0).click()
            ARExternalTrainingPage.getA5AddEditMenuActionsByNameThenClick('Delete')
            cy.get(ARExternalTrainingPage.getA5ConfirmBtn(), {timeout: 3000}).contains('OK').click()
            externalTrainingCourses = externalTrainingCourses.slice(1)
        }

        if (externalTrainingCourses.length > 0) {
            cy.get(ARExternalTrainingPage.getA5PageHeaderTitle(), {timeout: 60000}).should('External Training')
            ARExternalTrainingPage.A5AddFilter('Course Name', 'Contains', externalTrainingCourses[0])
            cy.get(ARExternalTrainingPage.getA5WaitSpinner(), {timeout: 3000}).should('not.exist')

            cy.get(ARExternalTrainingPage.getGridTable()).eq(0).click()
            ARExternalTrainingPage.getA5AddEditMenuActionsByNameThenClick('Delete')
            cy.get(ARExternalTrainingPage.getA5ConfirmBtn(), {timeout: 3000}).contains('OK').click()
        }
    })
})