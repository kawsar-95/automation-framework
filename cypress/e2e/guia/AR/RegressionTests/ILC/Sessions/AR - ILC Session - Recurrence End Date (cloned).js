import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import dayjs from 'dayjs'

describe('C817, AR - ILC Session - Recurrence End Date (cloned)', function(){
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

    it('Daily Recurring Session and Select a recurrence end date', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // Edit Session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // get Class Start Date
        cy.get(ARILCAddEditPage.getElementByNameAttribute('date-input-0')).invoke('val').as('startDay')

        // Verify drop down default value is none
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).should('have.text', 'None')

        // Select Daily Recurring Session 
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('day(s)').click()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(Math.floor(Math.random() * 5) + 1)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).invoke('val').as('repeatEvery')

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Date').click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('radio-button-DefinedEndDate')).should('have.attr', 'aria-checked', 'true')
        ARILCAddEditPage.getShortWait()

        // Verify Recurrence End Date default
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()). invoke('val').then((endDate) => {
            cy.get('@startDay').then((startDay)=> {
                cy.get('@repeatEvery').then((repeatEvery)=> {
                    const futureDate = String(dayjs(dayjs(startDay).add(Number(repeatEvery), 'day')).format()).slice(0, 10);
                    expect(endDate).to.eq(futureDate)
                })
            })
        })

        // Select a recurrence end date
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(4, 'Week'))

        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()
    })

    it('Weekly Recurring Session and Select a recurrence end date', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // Edit Session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // get Class Start Date
        cy.get(ARILCAddEditPage.getElementByNameAttribute('date-input-0')).invoke('val').as('startDay')

        // Select week(s) Recurring Session
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('week(s)').click()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(Math.floor(Math.random() * 3) + 1)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).invoke('val').as('repeatEvery')

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Date').click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('radio-button-DefinedEndDate')).should('have.attr', 'aria-checked', 'true')
        ARILCAddEditPage.getShortWait()

        // Verify Recurrence End Date default
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()). invoke('val').then((endDate) => {
            cy.get('@startDay').then((startDay)=> {
                cy.get('@repeatEvery').then((repeatEvery)=> {
                    const futureDate = String(dayjs(dayjs(startDay).add(Number(repeatEvery), 'week')).format()).slice(0, 10);
                    expect(endDate).to.eq(futureDate)
                })
            })
        })

        // Select a recurrence end date
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(4, 'Month'))

        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()
    })

    it('Weekday(s) Recurring Session and Select a recurrence end date', () => {
        cy.editCourse(ilcDetails.courseName)       
        ARILCAddEditPage.getMediumWait()

        // Edit Session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // get Class Start Date
        cy.get(ARILCAddEditPage.getElementByNameAttribute('date-input-0')).invoke('val').as('startDay')

        // Select week(s) on weekdays Recurring Session
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('week(s) on weekdays').click()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(Math.floor(Math.random() * 3) + 1)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).invoke('val').as('repeatEvery')

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Date').click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('radio-button-DefinedEndDate')).should('have.attr', 'aria-checked', 'true')
        ARILCAddEditPage.getShortWait()

        // Verify Recurrence End Date default
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()). invoke('val').then((endDate) => {
            cy.get('@startDay').then((startDay)=> {
                cy.get('@repeatEvery').then((repeatEvery)=> {
                    const futureDate = String(dayjs(dayjs(startDay).add(Number(repeatEvery), 'week')).format()).slice(0, 10);
                    expect(endDate).to.eq(futureDate)
                })
            })
        })

        // Select a recurrence end date
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(4, 'Month'))

        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()
    })

    it('Monthly Recurring Session and Select a recurrence end date', () => {
        cy.editCourse(ilcDetails.courseName)       
        ARILCAddEditPage.getMediumWait()

        // Edit Session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // get Class Start Date
        cy.get(ARILCAddEditPage.getElementByNameAttribute('date-input-0')).invoke('val').as('startDay')

        // Select month(s) Recurring Session
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('month(s)').click()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(Math.floor(Math.random() * 3) + 1)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).invoke('val').as('repeatEvery')

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Date').click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('radio-button-DefinedEndDate')).should('have.attr', 'aria-checked', 'true')
        ARILCAddEditPage.getShortWait()

        // Verify Recurrence End Date default
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()). invoke('val').then((endDate) => {
            cy.get('@startDay').then((startDay)=> {
                cy.get('@repeatEvery').then((repeatEvery)=> {
                    const futureDate = String(dayjs(dayjs(startDay).add(Number(repeatEvery), 'month')).format()).slice(0, 10);
                    expect(endDate).to.eq(futureDate)
                })
            })
        })

        // Select a recurrence end date
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(4, 'Year'))

        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()
    })

    it('Yearly Recurring Session and Select a recurrence end date', () => {
        cy.editCourse(ilcDetails.courseName)       
        ARILCAddEditPage.getMediumWait()

        // Edit Session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // get Class Start Date
        cy.get(ARILCAddEditPage.getElementByNameAttribute('date-input-0')).invoke('val').as('startDay')

        // Select year(s) Recurring Session
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('year(s)').click()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(Math.floor(Math.random() * 3) + 1)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).invoke('val').as('repeatEvery')

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Date').click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('radio-button-DefinedEndDate')).should('have.attr', 'aria-checked', 'true')
        ARILCAddEditPage.getShortWait()

        // Verify Recurrence End Date default
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()). invoke('val').then((endDate) => {
            cy.get('@startDay').then((startDay)=> {
                cy.get('@repeatEvery').then((repeatEvery)=> {
                    const futureDate = String(dayjs(dayjs(startDay).add(Number(repeatEvery), 'year')).format()).slice(0, 10);
                    expect(endDate).to.eq(futureDate)
                })
            })
        })

        // Select a recurrence end date
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Recurrence End Date')).find(ARILCAddEditPage.getDateInputField()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(10, 'Year'))

        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()
    })
})

