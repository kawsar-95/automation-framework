import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSummaryReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseSummaryReportPage'
import ARCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage'


describe('C7840-AR - Filtering -  Sub-Category on Courses,Global resources, Resource category & Competencies Reports', () => {
    beforeEach(() => {
  
      // Sign in with System Admin account
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      ARDashboardPage.getCoursesReport()
  
    })

    it('Sub-Category filter "Course Report" ', () => {
      //Using the Category column filter on sub-categories
      ARCoursesPage.AddSubCategoryFilterCourseReport('And Sub-Categories of')

    })

    it('Sub-Category filter "Global Resource Report" ', () => {
      //Using the Category column filter on sub-categories
      ARDashboardPage.getGlobalResourcesReport()
      ARGlobalResourcePage.AddSubCategoryFilterGlobalResourceReport('And Sub-Categories of')
    })

    it('Sub-Category filter "Course Summary Report" ', () => {
        //Using the Category column filter on sub-categories
        ARDashboardPage.getCourseSummaryReport()
        ARCoursesPage.AddSubCategoryFilterCourseReport('And Sub-Categories of')
    })

    it('Sub-Category filter "Competencies Report" ', () => {
         //Using the Category column filter on sub-categories
         ARDashboardPage.getCompetenciesReport()
         ARCompetencyPage.AddSubCategoryFilterCourseReport('GUIAuto - Competency')


    })












})