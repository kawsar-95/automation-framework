import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import { ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu";
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"


describe('LE - Course Player - Assessment Lesson - Learner Side Validation', function(){
    
    let userID
    let courseName = ocDetails.courseName

    before(function () {
        
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        
        //Validate userGuid from URL
        cy.url().then((currentUrl) => { userID = currentUrl.slice(-36) 
            expect(userID).to.eq(`c7a56ad9-3230-4c63-a380-bf3a60813e88`)
        })

        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()

        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle() 
         cy.get(AREditClientUserPage.getSaveBtn()).click()

        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        
        //Create an online course
        ARCoursesPage.getAddOnlineCourse()
        cy.createCourse('Online Course', courseName)
    
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        
        //Publish the course and return the course id 
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
      })
    
    after(function() {
        
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getVShortWait()
        
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        arDashboardPage.getVShortWait()

        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        

        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        
        //Turn off Next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        arDashboardPage.getShortWait()

        //Delete created Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify Course Player labels for created online course', () => {
        
        //Login as a learner 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password,'/')

        //Navigate to catalog and search for created OC
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.getSearchAndEnrollInCourseByName(courseName)

        //Click on the crated OC and verify course player
        cy.get(LEDashboardPage.getCourseCardName()).contains(courseName).click()
        arDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getNextgenCourseModal()).should('be.visible')
    })    
   
})