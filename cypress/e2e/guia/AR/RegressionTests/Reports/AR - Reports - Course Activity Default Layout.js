import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"

const defaultLayoutItemsInOrder = ['Last Name', 'First Name', 'Department', 'Date Completed', 'Attained Certificate', 'Certificate Date', 'Status', 'Score']

describe('GUIA-Auto-AE Regression || Reports || Course Activity - C5143', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
   
    it('The user wants to visit Course Activity report page and see default layout in order', () => {
        cy.viewport(1600,1000)
        //navigate to Reprots then Certificate page
        LEDashboardPage.getShortWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Activity'))
        //Filter and select a course
        ARCourseActivityReportPage.ChooseAddFilter(courses.oc_filter_01_name)
        arDashboardPage.getMediumWait()
        //Verify default layout order
        for(let i = 0; i < defaultLayoutItemsInOrder.length; i++){
            ARCourseActivityReportPage.getVerifyLayoutMenuItemByNameAndIndex(i,defaultLayoutItemsInOrder[i])
        }
    })
})