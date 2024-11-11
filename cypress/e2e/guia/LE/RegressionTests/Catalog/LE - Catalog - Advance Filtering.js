import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import { attributes, commonDetails} from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import courses from '../../../../../fixtures/courses.json'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'

describe('C6321 - LE - Catalog - Regression - Advance Filtering', function() {
    before(() => {
        // Login as a sys admin and visit to course page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport() 
        // Create a course for all learners without any content
        cy.createCourse('Online Course', ocDetails.courseName)
        
        cy.log(`A course with name ${ocDetails.courseName} has been created`)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        
        // Set a vendor name attribute
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        cy.get(arAddMoreCourseSettingsModule.getVendorAttributeInput()).type(attributes.vendor)

        // Store the course id for later use
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        //create course bundle
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        cy.createCourse('Course Bundle', cbDetails.courseName)
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName])
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    after(() => {
        if (commonDetails.courseID !== null) {
            cy.deleteCourse(commonDetails.courseID)
        }
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'course-bundles')
        }
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, '/#/catalog')
    })  

    it('Toggle Show Categories to Enable and Disable it', () => {
        // Verify that 'Show categories' toggle can be enabled and disabled
        cy.get(LECatalogPage.getShowCategoriesToggle()).click({force: true})
        // Wait until courses are re-loaded
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)

        cy.get(LECatalogPage.getShowCategoriesToggle()).click({force: true})
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)
    })

    it('Select Online Courses', () => {
        cy.get(LECatalogPage.getCourseType('Online Course')).check({force: true})
        // Select 'Online Course' from Course Type checkboxes
        cy.get(LECatalogPage.getCatalogContainer()).contains('Online Course')
        // Assert that we've found at least one course with the type selected
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)
    })

    it('Select Instructor Led Courses', () => {
        cy.get(LECatalogPage.getCourseType('Instructor Led Course')).check({force: true})
        cy.get(LECatalogPage.getCatalogContainer()).contains('Instructor Led Course')
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)
    })

    it('Select Curriculum Courses', () => {
        cy.get(LECatalogPage.getCourseType('Curriculum')).check({force: true})
        cy.get(LECatalogPage.getCatalogContainer()).contains('Curriculum')
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)
    })

    it('Select Bundled Courses', () => {
        cy.get(LECatalogPage.getCourseType('Course Bundle')).check({force: true})
        cy.get(LECatalogPage.getCatalogContainer()).contains('Course Bundle')
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)
    })

    it('Search Courses by name', () => {
        // Search course by entering course name
        LEFilterMenu.SearchForCourseByName(courses.OC_ECOMM_01_NAME)
        cy.get(LECatalogPage.getCatalogContainer()).contains(courses.OC_ECOMM_01_NAME)
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)
    })

    it('Advanced Filtering by Vendor Name, and Logout', () => {        
        // Search for Online Course created earlier in the Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        cy.get(LECatalogPage.getLEMenuItems()).contains('Catalog').click()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        // Enroll a course with vendor created earlier 
        // so that we can search course by vendor name
        cy.get(LECatalogPage.getEnrollBtn()).should('have.text', 'Enroll')
        cy.get(LECatalogPage.getEnrollBtn()).contains('Enroll').click()
        LECatalogPage.getShortWait()

        // Under the 'Advance Filtering' dropdown, select 'Vendor'.
        cy.get(LEFilterMenu.getAdvancedFilterDDown()).select('Vendor', {force: true})
        LEDashboardPage.getMediumWait()

        // Search course by 'Vendor Name'
        cy.get(LECatalogPage.getSearchVendorField()).type(attributes.vendor)
        cy.get(LECatalogPage.getRightArrowIcon()).click()
        cy.get(LECatalogPage.getCatalogContainer()).contains(ocDetails.courseName)
        cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 1)

        // Logout learner
        cy.logoutLearner()
        // Assert that learner has logged out successfully and page is redirected to public-dashboard page
        cy.url().should('include','/#/public-dashboard')
    })
})