import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C976 - Page limit and offset', () => {
    var courseName = '! - ' + ocDetails.courseName
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(() => {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Page limit and offset', () => {
        ARDashboardPage.getLongWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getGridTable()).its('length').then((length) => {
            expect(length).equals(20)
        })
        cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(1).invoke('text').then((title) => {
            cy.log('Title', title)
            cy.wrap(title).as('title1')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Page 2')).click()
        ARDashboardPage.getLongWait()
        // The offset (page number) and the items per page retain their last known values
        cy.get(ARDashboardPage.getGridTable()).its('length').then((length) => {
            expect(length).equals(20)
        })
        cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(1).invoke('text').then((title) => {
            cy.get('@title1').then((title1) => {
                expect(title1).not.equals(title)
            })
        })
    })
    it('As an admin I edit an item in the current report, but do not make any changes', () => {
        ARDashboardPage.getLongWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit')).click()
        ARDashboardPage.getVLongWait()
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type('z - ' + ocDetails.courseName)
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).contains('OK').click()
        ARDashboardPage.getMediumWait()
        // The offset (page number) and the items per page retain their last known values
        cy.get(ARDashboardPage.getGridTable()).its('length').then((length) => {
            expect(length).equals(20)
        })

    })
    it('Create Course', () => {
        ARDashboardPage.getLongWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()
        cy.createCourse('Online Course', courseName)
        ARDashboardPage.getMediumWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getLongWait()
    })
    it('As an admin I edit an item in the current report, and save any changes', () => {
        ARDashboardPage.getLongWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()
        cy.editCourse(courseName)
        ARDashboardPage.getLongWait()
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type('z - ' + ocDetails.courseName)
        cy.publishCourse()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('remove-all-filters')).click()
        // The offset (page number) and the items per page retain their last known values
        cy.get(ARDashboardPage.getGridTable()).its('length').then((length) => {
            expect(length).equals(20)
        })
    })
})