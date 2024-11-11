import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('C813, AR - ILC - An Administrator can Set Session Occurrence on a Monthly Basis (cloned)', function(){
    before('Create ILC , Publish Course', () => {
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

    it('Edit ILC, Verify Monthly Recurring Sessions', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // Cancel the session changes
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // get Class Start Date
        cy.get(ARILCAddEditPage.getElementByNameAttribute('date-input-0')).invoke('val').as('startDay')

        // Verify drop down default value is none
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).should('have.text', 'None')

        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()

        // Verify monthly recurrence option is available
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).should('contain', 'month(s)')
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('month(s)').click()
        ARILCAddEditPage.getShortWait()

        // Verify defaults to the day of the session start
        cy.get(ARILCAddEditPage.getILCSessionOnDayDropDown()).find('span').invoke('text').then((text) => {
            cy.get('@startDay').then((startDay)=> {
                expect(text.trim()).to.eq(Number(startDay.slice(-2)).toString())
            })
        })

        cy.get(ARILCAddEditPage.getILCSessionOnDayGraphicalSelector()).children('div')
            .filter(ARILCAddEditPage.getILCSessionCalenderItemSelected()).invoke('text').then((text) => {
                cy.get('@startDay').then((startDay)=> {
                    expect(text.trim()).to.eq(Number(startDay.slice(-2)).toString())
                })
            })

        // The days drop down is available   
        cy.get(ARILCAddEditPage.getILCSessionOnDayDropDown()).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('On Day')).eq(1).should('be.visible')

        // Slect A day
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('On Day')).eq(1).find('li').filter(':contains("16")').click()
        ARILCAddEditPage.getShortWait()

        // Verify days graphical selector is available
        cy.get(ARILCAddEditPage.getILCSessionOnDayGraphicalSelector()).should('be.visible')

        // Verify Updating either the multi-select or graphical selector also updates the opposite component
        // Verify default value change
        cy.get(ARILCAddEditPage.getILCSessionOnDayGraphicalSelector()).children('div')
            .filter(ARILCAddEditPage.getILCSessionCalenderItemSelected()).invoke('text').then((text) => {
                expect(text.trim()).to.eq('16')
            })
        
        cy.get(ARILCAddEditPage.getILCSessionOnDayGraphicalSelector()).children('div').contains('7').click()
        // Verify value change
        cy.get(ARILCAddEditPage.getILCSessionOnDayDropDown()).find('span').invoke('text').then((text) => {
            expect(text.trim()).to.eq('7')
        })
    })
})

