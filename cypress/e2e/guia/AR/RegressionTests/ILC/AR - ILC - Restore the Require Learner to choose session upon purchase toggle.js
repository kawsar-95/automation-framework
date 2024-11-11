import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECourseDetailsILCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'

describe('C7535 AUT-786, AR - ILC - Restore the Require Learner to choose session upon purchase toggle', function(){
    before('Create ILC without Sessions, Publish Course', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)

        // Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after( function() {
        // Delete Created Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        // Delete Users
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.deleteUsers([userDetails.username, userDetails.username2], userDetails.username3)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    // for step 1
    it('edit an existing ILC that was created before November 2022', () => {
        arDashboardPage.AddFilter('Date Added', 'Before', '2022-11-01')
        arDashboardPage.getMediumWait()

        // Filter Instructor Led Course type
        cy.get(arDashboardPage.getAddFilterBtn()).click();
        cy.get(arDashboardPage.getPropertyName() + arDashboardPage.getDDownField()).click();
        cy.get(arDashboardPage.getPropertyNameDDownSearchTxtF()).type('Type')
        cy.get(arDashboardPage.getPropertyNameDDownOpt()).contains(new RegExp("^" + 'Type' + "$", "g")).click()
        cy.get(arDashboardPage.getOperatorWithoutValue() + arDashboardPage.getDDownField()).click();
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('Instructor Led Course').click({ force: true });
        cy.get(arDashboardPage.getSubmitAddFilterBtn()).click()
        arDashboardPage.getMediumWait()

        cy.get(arDashboardPage.getTableCellName(2)).first().click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit')).click()
        arDashboardPage.getMediumWait()

        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Enable E-Commerce and updates as expected
        ARILCAddEditPage.setEnableECommerceToggle('true')
        arDashboardPage.getShortWait()

        // Require Learner to Choose Session Upon Purchase toggle as previously set 
        cy.get(ARILCAddEditPage.geRequireLearnerChooseSessionCheckbox()).should('have.attr', 'aria-checked', 'true')
    })
    
    // for step 2
    it('Edit a ILC with No Sessions And Enable Require Learner to Choose Session', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()
        
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment ALL  Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Enable E-Commerce and updates as expected
        ARILCAddEditPage.setEnableECommerceToggle('true')
        arDashboardPage.getShortWait()

        // Verify "Require Learners to Choose Session on Purchase" toggle is ON
        cy.get(ARILCAddEditPage.geRequireLearnerChooseSessionCheckbox()).should('have.attr', 'aria-checked', 'true')
        
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getVerifyCourseCardNameAndBtn(ilcDetails.courseName, 'No Sessions')
        LEDashboardPage.getMediumWait()
    })

    // for step 4
    it('Edit a ILC with No Sessions And Disable Require Learner to Choose Session', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()
        
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        // Enable E-Commerce
        ARILCAddEditPage.setEnableECommerceToggle('true')
        arDashboardPage.getShortWait()

        // Disable the Require Learner to Choose Session Upon Purchase toggle
        ARILCAddEditPage.setRequireLearnerChooseSessionUponPurchaseToggle('false')

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
 
         cy.get(LECourseDetailsILCModule.getShoppingCartActionButton()).should('exist').click()
         LEDashboardPage.getShortWait()
         cy.get(LECourseDetailsILCModule.getShoppingCartActionButton()).should('contain', 'Added to Cart')
    })

    // for step 5
    it('Edit a ILC with one or more Sessions And Disable Require Learner to Choose Session', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Add a session and open enrollment section
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
              
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        
        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)  
        ARILCAddEditPage.getMediumWait()
        
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        
        // Enable E-Commerce
        ARILCAddEditPage.setEnableECommerceToggle('true')
        arDashboardPage.getShortWait()

        // Disable the Require Learner to Choose Session Upon Purchase toggle
        ARILCAddEditPage.setRequireLearnerChooseSessionUponPurchaseToggle('false')
    
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()

        cy.get(LECourseDetailsILCModule.getShoppingCartActionButton()).should('exist').click()
        LEDashboardPage.getShortWait()
        cy.get(LECourseDetailsILCModule.getShoppingCartActionButton()).should('contain', 'Added to Cart')
    })

    // for step 3
    it('Edit a ILC And enable Require Learner to Choose Session', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Add a session and open enrollment section
        ARILCAddEditPage.getAddSession(sessions.sessionName_2, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
              
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        
        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)  
        ARILCAddEditPage.getMediumWait()
        
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        /
        // Enable E-Commerce
        ARILCAddEditPage.setEnableECommerceToggle('true')
        arDashboardPage.getShortWait()

        // Disable the Require Learner to Choose Session Upon Purchase toggle
        ARILCAddEditPage.setRequireLearnerChooseSessionUponPurchaseToggle('true')
        
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        cy.apiLoginWithSession(userDetails.username3, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()

        cy.get(LECourseDetailsILCModule.getShoppingCartActionButton()).should('not.exist')
        LEDashboardPage.getShortWait()

        // Go to uploads tab
        LECoursesPage.getCoursesPageTabBtnByName('Course Content')

        // Verify Message
        cy.get(LECourseDetailsILCModule.getWarningMessage()).should('have.text', 'Select a session to proceed with your course purchase')
    })
})
