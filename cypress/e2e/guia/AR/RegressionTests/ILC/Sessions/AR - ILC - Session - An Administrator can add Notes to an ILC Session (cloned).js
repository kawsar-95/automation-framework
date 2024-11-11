import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'
import ARCourseSettingsAttributesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'

describe('C833, AR - ILC - Session - An Administrator can add Notes to an ILC Session (cloned)', function(){
    before('Create ILC with Daily Recurring Sessions, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        ARILCAddEditPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Edit ILC  Sessions and verify Approval radio buttons and messages', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // The updates to the session are Saved
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // Verify admin can add notes in an ILC session
        // Verify Notes in an ILC Session max is 4000 characters
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Change Log / Notes')).clear().type(arDashboardPage.getLongString(4001))
        ARILCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAttributesModule.getErrorMsgByFieldDataName('notes')).should('have.text', miscData.char_4000_error)

        //Enter Valid Note into Note Field
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Change Log / Notes')).clear().type(commonDetails.customNotes).blur()
        ARILCAddEditPage.getShortWait()

        // Save the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()


       // Verify admin can Edit notes in an ILC session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        //Enter Valid Note into Note Field
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Change Log / Notes')).should('have.value', commonDetails.customNotes)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Change Log / Notes')).type(commonDetails.appendText)

        // Save the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()


        // Verify admin can remove notes in an ILC session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        //Enter Valid Note into Note Field
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Change Log / Notes')).should('have.value', `${commonDetails.customNotes}${commonDetails.appendText}`)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Change Log / Notes')).clear()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Change Log / Notes')).should('have.value', '')

        // Save the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()
    })
})

