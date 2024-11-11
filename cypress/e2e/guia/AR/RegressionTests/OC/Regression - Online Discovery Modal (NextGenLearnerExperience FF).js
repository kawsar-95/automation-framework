import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAvailabilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import AREditClientInfoPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage"
import LECatalogPage, { TestCourseNames } from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"


describe('C7529 - AUT-782 Regression - Online Discovery Modal (NextGenLearnerExperience FF)', () => {
    before('The NextGenLearnerExperience FF is ON,Then Enable Next Generation LE client toggle is ON', () => {  
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        LEDashboardPage.turnOnNextgenToggle()
    })     

    beforeEach('Login as an Admin and visit the Course Report page', ()=> {
        // Admin logins and visits to Courses page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        // Admin logins and visits to Courses page
        ARDashboardPage.getCoursesReport()
    })

    it('Create an Online Course `Course with no poster` with no poster and Allow Self-Enrollment set to `All Learners`.', () => {
        cy.createCourse('Online Course', TestCourseNames.CourseWithNoPosters)
        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click({force:true})
        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist') 
    })

    it('Create an Online Course `Course with 5 posters` with 5 posters with different orientations (portrait and landscape images), and Self-Enrollment Rules of All Learners', () => {
        cy.createCourse('Online Course', TestCourseNames.CourseWithPosters)
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click({force:true})
        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        for (let i = 0; i < 5; i++) {
            cy.get(AROCAddEditPage.getCourseSettingsByCatalogVisibilityBtn()).click({force:true}).click({force:true})
            cy.get(AROCAddEditPage.getAddPosterBtn()).click({force:true})
            cy.get(LECatalogPage.getCoursePosterAt(0)).click({force:true})
            cy.get(LECatalogPage.getImagePreview()).eq(0).click({force:true})
            cy.get(LECatalogPage.getApplyMediaLibrary()).click({force:true})
        }
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist') 
    })

    it('Create an Online Course `Course with long name.....` with a very very long course name, and Self-Enrollment Rules of All Learners.', () => {
        cy.createCourse('Online Course', TestCourseNames.CourseWithLongName)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click({force:true})
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist') 
    })

    it('Create an Online Course `Course with prerequisites` with prerequisites enabled, and Self-Enrollment Rules set to All Learners.', () => {
        cy.createCourse('Online Course', TestCourseNames.CourseWithPreRequisites)
        cy.get(AROCAddEditPage.getCourseSettingsAvailabilityBtn()).click({force:true})
        cy.get(AROCAddEditPage.getCourseSettingsAvailabilityBtn()).click({force:true})
        // Toggle Allow Enrollment to ON
        ARILCAddEditPage.generalToggleSwitch('true', ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer())

        // Click on Add Pre-requisites button
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteButton()).click({force:true})
        cy.get(ARCourseSettingsAvailabilityModule.getPrerequisiteNameTxtPreqOn(),{timeout:15000}).clear().type(commonDetails.prerequisiteName)
        // Select a course
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseDDownPreqOn()).click({force:true})
        cy.get(ARCourseSettingsAvailabilityModule.getValidCertPrerequisiteCourseSearchTxtInput()).clear().type(courses.oc_filter_01_name)
        ARCourseSettingsAvailabilityModule.getPrerequisiteCourseOpt(courses.oc_filter_01_name)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:15000}).click({force:true})
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist') 
    })

    it('Create an Online Course `Course with price` with E-Commerce enabled and Allow Self-Enrollment set to `All Learners`.', () => {
        cy.createCourse('Online Course', TestCourseNames.CourseWithPrice)
        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click({force:true})
        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Enable E-Commerce
        ARILCAddEditPage.generalToggleSwitch('true', ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer())
        // Allow Public Purchase
        ARILCAddEditPage.generalToggleSwitch('true', ARCourseSettingsEnrollmentRulesModule.getEnablePublicPurchaseContainer())

        // Set Default Price
        cy.get(ARCourseSettingsEnrollmentRulesModule.getDefaultPriceTxtF()).clear().type(12)
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist') 
    })

    it('Create an Online Course `Course with re-enrollment` with Re-enrollment enabled and Allow Self-Enrollment set to `All Learners`.', () => {
        cy.createCourse('Online Course', TestCourseNames.CourseWithReEnrollment)
        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click({force:true})
        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.get(AROCAddEditPage.getCourseSettingsCompletionBtn()).click({force:true})
        cy.get(AROCAddEditPage.getCourseSettingsCompletionBtn()).click({force:true})
        // Toggle Allow Re-enrollment to ON
        ARILCAddEditPage.generalToggleSwitch('true', ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer())
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist') 
    })

    it('Enable the `Learner Un-enrollment` toggle under users tab of the portal settings.', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
 
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn(), {timeout: 1000}).should('exist').click()

        //Asserting Client Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        //Click on Defaults Tab
        cy.get(AREditClientInfoPage.getTabsMenu()).contains('Users').click({force:true})
        //Scrolling into Enrolled Enabled 
        cy.get(AREditClientInfoPage.getIsLearnerEnrollEnabled()).scrollIntoView()
        cy.get(AREditClientInfoPage.getIsLearnerEnrollEnabled()).within(() => {
            //initially its on
            cy.get(AREditClientInfoPage.getCssClassToggle()).click({force:true})
            cy.get(AREditClientInfoPage.getCssClassToggle()).should('have.class', 'toggle')
            //Turning it back on 
            cy.get(AREditClientInfoPage.getCssClassToggle()).click({force:true})
            cy.get(AREditClientInfoPage.getCssClassToggle()).should('have.class', 'toggle on')
        })

        //Clicking on Save Button 
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(() => {
            cy.get(ARCouponsAddEditPage.getCouponSaveBtn()).click({force:true})
        })
    })

    it('As a learner, login to LE portal. See the Discovery Modal without posters', () => {
        // Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click({force:true})
        // Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})
        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)

        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(TestCourseNames.CourseWithNoPosters)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithNoPosters).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')

        cy.get(LECatalogPage.getDiscoveryImageModal()).should('exist', `background-color: linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.2));`)
    })

    it('As a learner,see the poster(s) in the Discovery Modal', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click({force:true})
        // Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})
        
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(TestCourseNames.CourseWithPosters)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithPosters).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')

        cy.get(LECatalogPage.getDiscoveryImageModal()).should('exist', LECatalogPage.getAbsorbLogoSmallBG())
        cy.get(LECatalogPage.getOpenImage()).click({ force: true })
        cy.go('back')

    })

    it('As a Learner, I want to see the name of the course in the Discovery Modal', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click({force:true})
        //Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})
        
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName('long Name')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithLongName).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LECatalogPage.getCourseDiscoveryModalBannerTitle()).contains(TestCourseNames.CourseWithLongName)

    })

    it('As a Learner, I want to see pre-requisites associated with the OC in the Discovery Modal ', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click({force:true})
        //Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(TestCourseNames.CourseWithPreRequisites)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithPreRequisites).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LECatalogPage.getCourseDiscoveryModalPrerequisiteContainer()).should('exist').contains('You must complete 1 of the following course(s) before you can start this course.')
    })
    
    it('As a Learner, I want to see any costs associated with the OC in the Discovery Modal as well as have an option to view the course in my shopping cart', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click({force:true})
        //Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})
        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(TestCourseNames.CourseWithPrice)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithPrice).click({force:true})

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LECatalogPage.getCourseDiscoveryModalBannerContent()).should('exist').contains('$12.00')
        cy.get(LECatalogPage.getCart(), {timeout: 15000}).should('have.attr', 'aria-disabled', 'false').contains('Add to Cart').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LECatalogPage.getCart()).should('have.attr', 'aria-disabled', 'false').contains('View Cart')
    })

    it('As a Learner, I want to see the Secondary buttons in the Discovery Modal and be able to enroll and re-enroll into the Online Course.', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click({force:true})
        //Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})
        
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(TestCourseNames.CourseWithReEnrollment)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithReEnrollment).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')    
        cy.get(LECatalogPage.getDiscoveryEnrollBtn(), { timeout: 15000 }).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        // re-enroll into the Online Course.
        cy.get(LECatalogPage.getDiscoveryReEnrollTitleBtn(), {timeout: 15000}).click({ force: true })
        cy.get(LECatalogPage.getCourseDiscoveryCloseBtn()).click()
    })

    it('As a Learner, I want to see the Secondary buttons in the Discovery Modal and be able to Pin, Share, and Unenroll into the Online Course', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click({force:true})
        //Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(TestCourseNames.CourseWithReEnrollment)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithReEnrollment).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LECatalogPage.getMenu()).should('have.attr', 'aria-disabled', 'false')

        cy.get(LECatalogPage.getMenu(), {timeout:5000}).should('have.attr' , 'aria-disabled' , 'false').click({force:true})
        // As a Learner, I want to see the Secondary buttons in the Discovery Modal and be able to Pin, Share, and Unenroll into the Online Course
        cy.get(LECatalogPage.getFlyOverMenu(),{timeout:2000}).contains('Pin')
        cy.get(LECatalogPage.getFlyOverMenu(), { timeout: 2000 }).contains('Share')
        cy.get(LECatalogPage.getCourseDiscoveryModalBannerTitle()).click()

        // As a Learner, I want to Share the link for this course from the Discovery Modal
        cy.get(LECatalogPage.getMenu(), {timeout:5000}).should('have.attr', 'aria-disabled', 'false')

        cy.get(LECatalogPage.getMenu(), { timeout: 15000 }).should('have.attr', 'aria-disabled', 'false').click({ force: true })
        
        cy.get(LECatalogPage.getCourseDiscoveryModalBannerTitle()).click()

        // As a Learner, I want to Pin a course for later from the Discovery Modal
        cy.get(LECatalogPage.getMenu()).should('have.attr', 'aria-disabled', 'false')

        cy.get(LECatalogPage.getMenu(), { timeout: 15000 }).should('have.attr', 'aria-disabled', 'false').click({ force: true })

        cy.get(LECatalogPage.getFlyOverMenu(), { timeout: 15000 }).contains('Pin').click({ force: true })

        cy.get(LECatalogPage.getToastNotificationMsg(), { timeout: 15000 }).contains('Pinned successfully.') 
        cy.get(LEDashboardPage.getToastNotificationCloseBtn()).click()

        cy.get(LECatalogPage.getCourseDiscoveryModalBannerTitle()).click()
        cy.get(LECatalogPage.getMenu(), {timeout: 3000}).should('have.attr', 'aria-disabled', 'false')

        cy.get(LECatalogPage.getMenu(), { timeout: 20000 }).should('have.attr', 'aria-disabled', 'false').click({ force: true })

         // As a Learner, I want to unpin a previously pinned course from the Discovery Modal
        cy.get(LECatalogPage.getFlyOverMenu(), { timeout: 15000 }).contains('Unpin').click({ force: true })

        cy.get(LECatalogPage.getToastNotificationMsg(), { timeout: 15000 }).contains('Unpinned successfully.') 
        cy.get(LEDashboardPage.getToastNotificationCloseBtn()).click()

        // As a learner, I want to close the online discovery modal.
        cy.get(LECatalogPage.getCourseDiscoveryCloseBtn(),{timeout:20000}).click()
    })

    it('As a Learner, I want to check the mobile responsiveness of the online course Discovery Modal', () => {
        //Set viewport size and wait for tiles to resize
        cy.viewport('iphone-xr')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn()), {timeout: 3000}).click({force:true})
        //Click on Portal Settings button
        cy.get(ARDashboardPage.getLearnerAndReviwerExperienceBtn()).contains('Learner Experience').click({force:true})

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)

        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(TestCourseNames.CourseWithNoPosters)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(TestCourseNames.CourseWithNoPosters).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')

        cy.get(LECatalogPage.getDiscoveryImageModal()).should('exist', `background-color: linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.2));`)
        cy.get(LECatalogPage.getCourseDiscoveryCloseBtn(),{timeout:20000}).click()

        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Log Off')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
    })

    it('Delete courses created for the test', () => {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'online-courses')
        }
   })
})