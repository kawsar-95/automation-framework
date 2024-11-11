
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import AREditClientInfoPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C6381 - LE - Regression - Verify learner that completed On login course once do not need to do it again upon logging in again.", () => {

    before("Prerequisite", () => {
        cy.viewport(1280, 720)
        //Log in to admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()

        //GO to Courses 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        // //Create An Online Course
        cy.createCourse('Online Course')
        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        //Clicking On Account Button
        cy.get(ARDashboardPage.getElementByDataNameAttribute('button-account')).click()
        ARDashboardPage.getShortWait()
        //Asserting Account and Clicking on Portal Settings
        cy.get(ARDashboardPage.getElementByDataNameAttribute("panels")).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute("title")).should('have.text', 'Account')
            //Click on Portal Settings button
            cy.get(ARDashboardPage.getPortalSettingsBtn()).click()
        })
        ARDashboardPage.getLongWait()
        //Asserting Client Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        //Click on Users Tab
        cy.get(AREditClientInfoPage.getTabsMenu()).contains('Users').click()
        ARDashboardPage.getShortWait()
        cy.get(AREditClientInfoPage.getTableContent()).within(() => {
            cy.get(ARDashboardPage.getElementByDataTabAttribute('Users')).within(() => {
                //Click on On Login Course Toggle
                cy.get(AREditClientInfoPage.getOnLoginCourseEnableToggle()).click()
            })

        })
        ARDashboardPage.getShortWait()
        cy.get(AREditClientInfoPage.getOnLoginCourseChooseDdown()).click()
        ARDashboardPage.getMediumWait()
        //Typing the Course Name
        cy.get(AREditClientInfoPage.getOnLoginCourseInputfield()).clear().type(ocDetails.courseName, { delay: 100 })
        ARDashboardPage.getMediumWait()
        //Selecting Course
        cy.get(AREditClientInfoPage.getOnLoginDdownSearchResult()).eq(0).click()
        //Clicking On Save Button
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(() => {
            cy.get(ARCouponsAddEditPage.getCouponSaveBtn()).click()
        })
        ARDashboardPage.getLongWait()

        //Create a new learner
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

    })


    it("Verify when a new learner logins to the LMS for the first time", () => {
        //Login to Learner side with newly created user
        LEDashboardPage.apiLoginWithSessionWithoutLEAssertion(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getLongWait()
        //Asserting On Login Course Module Modal
        cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
            cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course')
            cy.get(LEDashboardPage.getElementByAriaLabelAttribute("Logout and Complete Later")).should('have.text', 'Logout and Complete Later')
        })
        //Click on "Logout and Complete Later" Button
        cy.get(LEDashboardPage.getElementByAriaLabelAttribute("Logout and Complete Later")).should('have.text', 'Logout and Complete Later').click()
        LEDashboardPage.getMediumWait()
        //Asserting Logout
        cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('have.text', 'Login')

    })

    it("Verify When View and start Course is selected. ", () => {
        //Login to Learner side with newly created user
        LEDashboardPage.apiLoginWithSessionWithoutLEAssertion(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getLongWait()
        //Click on "View and Start Course" Button
        cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
            cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course').click()

        })
        LEDashboardPage.getShortWait()
        //Asserting Course is complete 
        cy.get(LECoursesPage.getCourseProgressPercentage()).first().should('have.text', '100%')
        //Clicking Log Off Button
        cy.get(LEDashboardPage.getLogOffBtn()).click()
        LEDashboardPage.getMediumWait()
        //Again Loggin in 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getVLongWait()
        //Verify learner is taken to dashboard
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('be.visible')

    })

    it(`Verify when a "existing" learner logins to the LMS and “On Login Course toggle was just enabled “ for the first time.`, () => {
        //Log in with an existing User
        LEDashboardPage.apiLoginWithSessionWithoutLEAssertion(users.learner04.learner_04_username, users.learner04.learner_04_password)
        LEDashboardPage.getLongWait()
        //Asserting On Login Course Module Modal
        cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
            cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course')
            cy.get(LEDashboardPage.getElementByAriaLabelAttribute("Logout and Complete Later")).should('have.text', 'Logout and Complete Later')
        })
        //Click on "Logout and Complete Later" Button
        cy.get(LEDashboardPage.getElementByAriaLabelAttribute("Logout and Complete Later")).should('have.text', 'Logout and Complete Later').click()
        LEDashboardPage.getMediumWait()


    })

    it("Verify When View and start Course is selected for an existing User ", () => {
        //Log in with an existing user 
        LEDashboardPage.apiLoginWithSessionWithoutLEAssertion(users.learner04.learner_04_username, users.learner04.learner_04_password)
        LEDashboardPage.getLongWait()
        //Click on "View and Start Course" Button
        cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
            cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course').click()

        })
        LEDashboardPage.getShortWait()
        //Asserting Course is complete 
        cy.get(LECoursesPage.getCourseProgressPercentage()).first().should('have.text', '100%')
        //Click on Log off Button
        cy.get(LEDashboardPage.getLogOffBtn()).click()
        LEDashboardPage.getMediumWait()
        //Again Logging in 
        cy.apiLoginWithSession(users.learner04.learner_04_username, users.learner04.learner_04_password)

        LEDashboardPage.getVLongWait()
        //Verify learner is taken to dashboard
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('be.visible')

    })


    it("Clean up ", () => {

        //Delete created user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        //Click on users
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        //Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        ARDashboardPage.getMediumWait()
        //Filter out the created user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        //Selecting the user
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on Delete Button
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        ARDashboardPage.getShortWait()
        //Click on Delete on Modal Button
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARDashboardPage.getMediumWait()

        //Clicking On Account Button
        cy.get(ARDashboardPage.getElementByDataNameAttribute('button-account')).click()
        ARDashboardPage.getShortWait()
        //Asserting Account and Clicking on Portal Settings
        cy.get(ARDashboardPage.getElementByDataNameAttribute("panels")).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute("title")).should('have.text', 'Account')
            cy.get(ARDashboardPage.getElementByTitleAttribute("Portal Settings")).click()

        })
        ARDashboardPage.getLongWait()
        //Asserting Client Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        cy.get(AREditClientInfoPage.getTabsMenu()).contains('Users').click()
        ARDashboardPage.getShortWait()
        //Click on Users Tab
        cy.get(AREditClientInfoPage.getTabsMenu()).contains('Users').click()
        ARDashboardPage.getShortWait()
        cy.get(AREditClientInfoPage.getTableContent()).within(() => {
            cy.get(ARDashboardPage.getElementByDataTabAttribute("Users")).within(() => {
                //Click on On Login Course Toggle
                cy.get(AREditClientInfoPage.getOnLoginCourseEnableToggle()).click()
            })

        })
        //Clicking on Save Button 
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(() => {
            cy.get(ARCouponsAddEditPage.getCouponSaveBtn()).click()
        })
        ARDashboardPage.getLongWait()
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)

    })



})