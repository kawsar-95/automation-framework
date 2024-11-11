import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"


describe('AUT-165 - C963 - GUIA-Story - NASA-4392 - Course creation occurs in draft mode (cloned) - Add and Cancel', () => {

    beforeEach('Login as an Admin and navigate to the course page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Add an OC/ILC/Course Bundle/Curriculum Click Cancel', () => {
        // Create online course and then cancel
        ARCoursesPage.createCourseAndCancel('Online Course', ocDetails.courseName)

        // Verify that no new course is created
        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 75000}).contains('Courses')
        ARCoursesPage.verifyNoCourseIsCreated([ocDetails.courseName])

        // Create ILC course and then cancel
        ARCoursesPage.createCourseAndCancel('Instructor Led', ilcDetails.courseName)

        // Verify that no new course is created
        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 75000}).contains('Courses')
        ARCoursesPage.verifyNoCourseIsCreated([ilcDetails.courseName])

        // Create a course bundle and then cancel
        ARCoursesPage.createCourseAndCancel('Course Bundle', cbDetails.courseName)

        // Verify that no new course is created        
        ARCoursesPage.verifyNoCourseIsCreated([cbDetails.courseName])

        // Create Curriculum and then cancel
        ARCoursesPage.createCourseAndCancel('Curriculum', currDetails.courseName)

        // Verify that no new course is created
        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 75000}).contains('Courses')
        ARCoursesPage.verifyNoCourseIsCreated([currDetails.courseName])
    })
    
}) 


describe('GUIA-Story - NASA-4392 - Course creation occurs in draft mode (cloned) - Add and Logout', () => {

    beforeEach('Login as an Admin and navigate to the course page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Add an Online Course and Logout', () => {
        // Create online course, edit and then logout
        cy.createCourse('Online Course') 
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(ocDetails.courseName2)
        cy.logoutAdmin()
    })

    it('Add an ILC Course and Logout', () => {
        // Create online course, edit and then logout
        cy.createCourse('Instructor Led') 
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(ilcDetails.courseName2)
        cy.logoutAdmin()
    })

    it('Add an Course Bundle and Logout', () => {
        // Create online course, edit and then logout
        cy.createCourse('Course Bundle')  
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(cbDetails.courseName2)
        cy.logoutAdmin()
    })

    it('Add an Curriculum and Logout', () => {
        // Create online course, edit and then logout
        cy.createCourse('Curriculum')  
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCURRAddEditPage.getGeneralTitleTxtF())).clear().type(currDetails.courseName2)
        cy.logoutAdmin()
    })

    it('Verify that no courses have been created', () => {
        ARCoursesPage.verifyNoCourseIsCreated([ocDetails.courseName2, ilcDetails.courseName2, cbDetails.courseName2, currDetails.courseName2])
    })
}) 


describe('GUIA-Story - NASA-4392 - Course creation occurs in draft mode (cloned) - Add and Navigate Away', () => {

    beforeEach('Login as an Admin and navigate to the course page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Add an Online Course and navigaet to the users page', () => {
        // Create online course, and then navigaet to the users page
        cy.createCourse('Online Course') 
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(ocDetails.courseName2)
        cy.visit('/admin/users')
    })

    it('Add an ILC Course and navigaet to the users page', () => {
        // Create online course, and then navigaet to the users page
        cy.createCourse('Instructor Led') 
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(ilcDetails.courseName2)
        cy.visit('/admin/users')
    })

    it('Add an Course Bundle and navigaet to the users page', () => {
        // Create online course, and then navigaet to the users page
        cy.createCourse('Course Bundle')  
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(cbDetails.courseName2)
        cy.visit('/admin/users')
    })

    it('Add an Curriculum and navigaet to the users page', () => {
        // Create online course, and then navigaet to the users page
        cy.createCourse('Curriculum')  
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCURRAddEditPage.getGeneralTitleTxtF())).clear().type(currDetails.courseName2)
        cy.visit('/admin/users')
    })

    it('Verify that no courses have been created', () => {
        ARCoursesPage.verifyNoCourseIsCreated([ocDetails.courseName2, ilcDetails.courseName2, cbDetails.courseName2, currDetails.courseName2])
    })
})