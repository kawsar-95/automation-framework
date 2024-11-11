import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { users } from '../../../../../../helpers/TestData/users/users'
import CreateCoursePage from '../../../../../../helpers/AR/pageObjects/SmokeObjects/CreateCoursePage'

let courseIds = []

describe('LE-Cover Recurring ILC Session', function(){

    beforeEach( function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
    })

    after(function() {
        for(let i = 0; i < courseIds.length; i++){
        cy.deleteCourse(courseIds[i], 'instructor-led-courses-new')
        }
    })

    it('Verify Recurring can be Created when Adding Session to ILC', () => {
        cy.wrap(CreateCoursePage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getShortWait()

        //Create ILC
        CreateCoursePage.getCreateCouseForSmoke('Instructor Led', ilcDetails.courseName, false)

        //Add a session
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        
        //Add a daily recurring
        ARILCAddEditPage.getAddDailyRecurringSession(1, 'Number of Occurrences', 3)

        // Save Session
          cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
          cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
  
        //Publish ILC
          cy.publishCourseAndReturnId().then((id) => {
              courseIds[0] = (id.request.url.slice(-36));
          })
    
    })

 
 it('Verify Recurring can be Created when Adding Session to ILC', () => {
        cy.wrap(CreateCoursePage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getShortWait()
       
        //Create ILC
        CreateCoursePage.getCreateCouseForSmoke('Instructor Led', ilcDetails.courseName, false)

        //Add a session
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        
        //Add a weekly recurring
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('week(s)').click()
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(2)
        cy.get(ARILCAddEditPage.getOnDayDDownClearBtnThenClick()).eq(0).click() //clear existing day
        cy.get(ARILCAddEditPage.getOnDayDDownOpt()).contains('Wednesday').click({force:true})
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).click() //close onDayDDown

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
  
        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            courseIds[1] = (id.request.url.slice(-36));
        })
    })
  

    

    it('Verify Recurring can be Created when Adding Session to ILC', () => {
        cy.wrap(CreateCoursePage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getShortWait()
        
        //Create ILC
        CreateCoursePage.getCreateCouseForSmoke('Instructor Led', ilcDetails.courseName, false)

        //Add a session
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        
        //Add a monthly recurring
        ARILCAddEditPage.getAddMonthlyRecurringSession(1,'21', 'Number of Occurrences', 3)

        // Save Session
          cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
          cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
  
        //Publish ILC
          cy.publishCourseAndReturnId().then((id) => {
            courseIds[2] = (id.request.url.slice(-36));
          })
    
    })

    it('Verify Recurring can be Created when Adding Session to ILC', () => {
        cy.wrap(CreateCoursePage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getShortWait()

        //Create ILC
        CreateCoursePage.getCreateCouseForSmoke('Instructor Led', ilcDetails.courseName, false)

        //Add a session
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        
        //Add a yearly recurring
        ARILCAddEditPage.getAddYearlyRecurringSession(1,'Oct','21', 'Number of Occurrences', 3)

        // Save Session
          cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
          cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
  
        //Publish ILC
          cy.publishCourseAndReturnId().then((id) => {
            courseIds[3] = (id.request.url.slice(-36));
          })
    })
})