import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import {commonDetails} from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"

describe('C9168 - LE - Catalog/My Courses - Regression - Advance Filtering-Course Language', function() {
    before(() => {
        // Login as a sys admin and visit to course page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        // Create a course for all learners with lang "English"
        cy.createCourse('Online Course', ocDetails.courseName)
        cy.get(ARAddMoreCourseSettingsModule.getCourseLangDDown()).first().click()
        ARDashboardPage.getMediumWait()
        cy.log(`A course with name ${ocDetails.courseName} has been created`)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        // Open Catalog Visibility Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()

        // 1. Add Category 
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.category_01_name])


        // Store the course id for later use
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))   
        })

       // Create a course for all learners with lang "French"
       cy.createCourse('Online Course', ocDetails.courseName)
       cy.get(ARCBAddEditPage.getGeneralLanguageDDown()).click({ force: true })
       cy.get(ARCBAddEditPage.getGeneralLanguageDDownOpt()).contains(cbDetails.language).click({ force: true })
  
       cy.log(`A course with name ${ocDetails.courseName} has been created`)
       // Set enrollment rule - Allow self enrollment for all learners
       cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

      
        
       // Store the course id for later use
        cy.publishCourseAndReturnId().then((id) => { 
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    beforeEach(() => {
        
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, '/#/catalog')
    })  

    after(()=>{
        let set = new Set(commonDetails.courseIDs);
        const array = Array.from(set)
        for (let i = 0; i < array.length; i++) {
            cy.deleteCourse(array[i])
        }
    })

    it('Toggle should Show Categories to Enable and Disable it', () => {
            // Verify that 'Show categories' toggle can be enabled and disabled
            LEFilterMenu.getClickOnFilterBtn()
            LEFilterMenu.setShowCategories('true')
            // Wait until courses are re-loaded
            cy.get(LECatalogPage.getCategoryListItem()).should('have.length.least', 0)
    
            LEFilterMenu.setShowCategories('true')
            cy.get(LECatalogPage.getCardCourse()).should('have.length.least', 0)
         
    })


    it('Catalog-Advanced Filtering should filter by Course Language', () => {        
         
    
         // Under the 'Advance Filtering' dropdown, select 'Course Language'.
            LEFilterMenu.getClickOnFilterBtn()
            cy.get(LEFilterMenu.getAdvancedFilterDDown()).should('be.visible').select('Course Language', {force: true})
            LEDashboardPage.getLongWait()
            LECatalogPage.scrollToCourseLangFilter()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).should('be.visible').click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains('English').should('be.visible').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( 'Français').should('be.visible').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( 'Español').should('be.visible').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( '日本語').should('be.visible').click()
            LEDashboardPage.getMediumWait()
            //Verify the Search field function of the course language filter
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getCourseLangFilterSearchFieldTxt()).type('italiano')
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( 'Italiano').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getCourseLangFilterSearchFieldTxt()).type('due').click()
           // Verify that user can delete filter 
           cy.get(LECatalogPage.getRemoveCourseLangFilterBtn()).contains(' Remove language filter Español ').click({force:true})
           cy.get(LECatalogPage.getRemoveCourseLangFilterBtn()).contains(' Remove language filter 日本語').click({force:true})
           cy.get(LECatalogPage.getRemoveAllCourseLangFilterBtn()).click()

    })

    it('MyCourses-Advanced Filtering should filter by Course Language', () => {
            cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
            LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
            cy.url().should('include', '/#/courses/')
            cy.get(LECoursesPage.getCoursesPageTitle()).should('contain', 'My Courses')
            LECoursesPage.getMediumWait()
        

         // Under the 'Advance Filtering' dropdown, select 'Course Language'.
            LEFilterMenu.getClickOnFilterBtn()
            cy.get(LEFilterMenu.getAdvancedFilterDDown()).select('Course Language', {force: true})
            LEDashboardPage.getLongWait()
            LECatalogPage.scrollToCourseLangFilter()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).should('be.visible').click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains('繁體中文').should('be.visible').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( 'Deutsch').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( 'العربية').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( 'Português').click()
            LEDashboardPage.getMediumWait()
            //Verify the Search field function of the course language filter
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getCourseLangFilterSearchFieldTxt()).type('Türkçe')
            cy.get(LECatalogPage.getLECourseLangFilterDDown()).contains( 'Türkçe').click()
            cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
            cy.get(LECatalogPage.getCourseLangFilterSearchFieldTxt()).type('ita').click()
           // Verify that user can delete filter 
           cy.get(LECatalogPage.getRemoveCourseLangFilterBtn()).contains(' Remove language filter Deutsch').click({force:true})
           cy.get(LECatalogPage.getRemoveCourseLangFilterBtn()).contains(' Remove language filter 繁體中文 ').click({force:true})
           cy.get(LECatalogPage.getRemoveAllCourseLangFilterBtn()).click()

    })

    it('Search Result-Advanced Filtering should filter by Course Language', () => {  

           cy.get(LEDashboardPage.getNavSearch()).click()
           cy.get(LEDashboardPage.getSearchTxtField()).type('GUIA').click()
           LEDashboardPage.getMediumWait()

           // Under the 'Advance Filtering' dropdown, select 'Course Language'.
           LEFilterMenu.getClickOnFilterBtn()
           cy.get(LEFilterMenu.getAdvancedFilterDDown()).should('be.visible').select('Course Language', {force: true})
           LEDashboardPage.getShortWait()
           cy.get(LECatalogPage.getCourseLangFilterBtn()).click()
           cy.get(LECatalogPage.getCourselangList()).scrollTo('bottom')
           LEDashboardPage.getShortWait()
           cy.get(LECatalogPage.getRemoveAllCourseLangFilterBtn()).click()
           LEDashboardPage.getShortWait()

   
           // Logout learner
           cy.logoutLearner()
            // Assert that learner has logged out successfully and page is redirected to public-dashboard page
            cy.url().should('include','/#/public-dashboard')

    })
})

