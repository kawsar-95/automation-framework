import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import AREquivalentCoursesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/AREquivalentCourses.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C9467, C10189, C10186, C10191 - Equivalency fields and filters added to course, course activity, user enrollment and course enrollments reports', () => {
    beforeEach(() => {
        // Login as a sys admin and visit to course page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getCoursesReport()
    })

    it('Course Report "Course" ', () => {

         //Verify course Filter and add Include Equivalent course filter 
          AREquivalentCoursesModule.AddCourseFilterCourseReport('Course')
          AREquivalentCoursesModule.AddIncludeEqCourseFilter('Refine')
         // cy.get(AREquivalentCoursesModule.AddIncludeEqCourseFilter()).should('be.disabled')

         //Add/remove Equivalency ID Field 
          cy.get(ARDashboardPage.getDisplayColumns()).click({force:true})
          cy.get(ARDashboardPage.getChkBoxLabel()).contains('Equivalency ID',{timeout:3000}).click()
          cy.get(ARDashboardPage.getChkBoxLabel()).contains('Course Language',{timeout:3000}).click()
          cy.get(ARDashboardPage.getDisplayColumns()).click({force:true}) //Close menu

          //Verify Course Language Filter 
          AREquivalentCoursesModule.AEAddCourseLangFilter()
          AREquivalentCoursesModule.UpdateCourseLanguageFilter()
          
         //Verify Filter on Equivalent ID
          AREquivalentCoursesModule.EquivalentIDFilter('Equivalent ID Filter')

         //Edit Include Equivalent Course Filter to NO 
         AREquivalentCoursesModule.UpdateIncludeEqCourseFilter()

         //Revert Report back to default remove all filters and columns 
          AREquivalentCoursesModule.RemoveAllCourseEqFilters()  
    })

    it('Course Activity Report ',()  =>{

         ARDashboardPage.getCoursesActivityReport('Course Activity')
         AREquivalentCoursesModule.CourseActivityCourseFilter()
         AREquivalentCoursesModule.AddCourseActivityIncludeEqCourseFilter('Refine')

         //Add Fields 
         cy.get(ARDashboardPage.getDisplayColumns()).click({force:true})
         cy.get(ARDashboardPage.getChkBoxLabel()).contains('Equivalency ID',{timeout:3000}).click()
         cy.get(ARDashboardPage.getChkBoxLabel()).contains('Course Language',{timeout:3000}).click()
         cy.get(ARDashboardPage.getChkBoxLabel()).contains('Course ID',{timeout:3000}).click()
         cy.get(ARDashboardPage.getDisplayColumns()).click({force:true}) //Close menu
        
         //Verify Course Language Filter 
         AREquivalentCoursesModule.AEAddCourseLangFilter()
         AREquivalentCoursesModule.UpdateCourseActivityLanguageFilter()

         //Verify Filter on Equivalent ID
         AREquivalentCoursesModule.EquivalentIDFilter('Equivalent ID Filter')

         //Edit Include Equivalent Course Filter to NO 
         AREquivalentCoursesModule.UpdateIncludeEqCourseFilter()

         //Revert Report back to default remove all filters and columns 
         AREquivalentCoursesModule.RemoveAllCourseEqFilters()  

    })

    it('Course Enrollment Report ',()  =>{
         ARDashboardPage.getCourseEnrollmentReport('Course Enrollments')
         AREquivalentCoursesModule.CourseEnrollmentCourseFilter()
         AREquivalentCoursesModule.AddCourseActivityIncludeEqCourseFilter('Refine')

         //Add Fields 
         cy.get(ARDashboardPage.getDisplayColumns()).click({force:true})
         cy.get(ARDashboardPage.getChkBoxLabel()).contains('Equivalency ID',{timeout:3000}).click()
         cy.get(ARDashboardPage.getChkBoxLabel()).contains('Course Language',{timeout:3000}).click()
         cy.get(ARDashboardPage.getChkBoxLabel()).contains('Course ID',{timeout:3000}).click()
         cy.get(ARDashboardPage.getDisplayColumns()).click({force:true}) //Close menu

          //Verify Course Language Filter 
          AREquivalentCoursesModule.AEAddCourseLangFilter()

         //Verify Filter on Equivalent ID
         AREquivalentCoursesModule.EquivalentIDFilter('Equivalent ID Filter')
 
         //Edit Include Equivalent Course Filter to NO 
         AREquivalentCoursesModule.UpdateIncludeEqCourseFilter()

         //Revert Report back to default remove all filters and columns 
         AREquivalentCoursesModule.RemoveAllCourseEqFilters()  

    })
    
    it('User Enrollment Report ',()  =>{
         ARDashboardPage.getUserEnrollmentsReport('User Enrollments')
         AREquivalentCoursesModule.UserEnrollmentCourseFilter()
         AREquivalentCoursesModule.AddCourseActivityIncludeEqCourseFilter('Refine')

          //Add Fields 
          cy.get(ARDashboardPage.getDisplayColumns()).click({force:true})
          cy.get(ARDashboardPage.getChkBoxLabel()).contains('Equivalency ID',{timeout:3000}).click()
          cy.get(ARDashboardPage.getChkBoxLabel()).contains('Course Language',{timeout:3000}).click()
          cy.get(ARDashboardPage.getDisplayColumns()).click({force:true}) //Close menu

          //Verify Course Language Filter 
          AREquivalentCoursesModule.AEAddCourseLangFilter()

          //Verify Filter on Equivalent ID
         AREquivalentCoursesModule.EquivalentIDFilter('Equivalent ID Filter')

          //Edit Include Equivalent Course Filter to NO 
          AREquivalentCoursesModule.UpdateIncludeEqCourseFilter()

          //Revert Report back to default remove all filters and columns 
          AREquivalentCoursesModule.RemoveAllCourseEqFilters()  
    })





})