import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('Unenroll User from CB', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)
    })
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    it('Enroll Users', () => {
        //Navigate to Enroll Users
        
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        //Filter Users
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username2)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username3)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        
        // Select users
        cy.get(ARDashboardPage.getTableCellRecord()).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getTableCellRecord()).contains(userDetails.username2).click()
        cy.get(ARDashboardPage.getTableCellRecord()).contains(userDetails.username3).click()

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll Users')).should('have.attr' , 'aria-disabled' , 'false')
        // Enroll users
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll Users')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add-course')).click()
        // Select course
        cy.wrap(ARSelectModal.SearchAndSelectFunction([courses.cb_filter_01_name , courses.cb_filter_01_oc_child_01]))
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")


    })

    it('Un-enroll a learner ', () => {
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
        
        // Filter course
        ARDashboardPage.AddFilter('Name', 'Equals', courses.cb_filter_01_name)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getTableCellRecord(), {timeout:15000}).contains(courses.cb_filter_01_name).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')))
       // cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments') , {timeout:15000}).should('have.attr','aira-disabled','false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getPageHeaderTitle() , {timeout: 15000}).should('contain','Course Enrollments')
        ARDashboardPage.getLongWait()

        //Filter user
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getTableCellRecord(), {timeout:15000}).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        // Unenroll User
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Un-enroll User')))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).contains('OK').click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")

       
        
    })

    it("verify enrollment from user enrollment side" ,()=>{
        ARDashboardPage.getUsersReport()
        //Filter
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        //Select user
        cy.get(ARDashboardPage.getTableCellRecord()).contains(userDetails.username).click()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getPageHeaderTitle(),{timeout:15000}).should('contain','User Enrollments')
        ARDashboardPage.getLongWait()
        ARDashboardPage.AddFilter('Name', 'Equals', courses.cb_filter_01_name)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        // Learner is un-enrolled from the course bundle
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
        
        cy.get(ARDashboardPage.getElementByDataNameAttribute('remove-all-filters')).should('exist').and('be.visible')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('remove-all-filters')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.AddFilter('Name', 'Equals', courses.cb_filter_01_oc_child_01)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        // Learner is not un-enroll to the courses within the course bundle
        cy.get(ARDashboardPage.getGridTable()).first().should('contain', courses.cb_filter_01_oc_child_01)
    })
    it('Unenroll multiple learners', () => {
       
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()

        ARDashboardPage.AddFilter('Name', 'Equals', courses.cb_filter_01_name)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getTableCellRecord()).contains(courses.cb_filter_01_name).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout:15000}).should('contain','Course Enrollments')
         //this long wait is very necessary because this page loads very slowly
        ARDashboardPage.getLongWait()
        //Filter user
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username2)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username3)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getTableCellRecord()).contains(userDetails.username2).click()
        cy.get(ARDashboardPage.getTableCellRecord()).contains(userDetails.username3).click()
        
        // Unenroll Multiple users
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Un-enroll Users')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Un-enroll Users')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).contains('OK').click()
        ARDashboardPage.getLongWait()

      
      
    })

    it ("verify unenrollment of multiple users" , function () { 
        //Navigate to users
        ARDashboardPage.getUsersReport()
        //Filter
        ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username2)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        //Select user
        cy.get(ARDashboardPage.getTableCellRecord()).contains(userDetails.username2).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getPageHeaderTitle(),{timeout:15000}).should('contain','User Enrollments')
        //this long wait is very necessary because this page loads very slowly
        ARDashboardPage.getLongWait()
        ARDashboardPage.AddFilter('Name', 'Equals', courses.cb_filter_01_name)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        // Learner is un-enrolled from the course bundle
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
        
        cy.get(ARDashboardPage.getElementByDataNameAttribute('remove-all-filters')).click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.AddFilter('Name', 'Equals', courses.cb_filter_01_oc_child_01)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        // Learner is not un-enroll to the courses within the course bundle
        cy.get(ARDashboardPage.getGridTable()).first().should('contain', courses.cb_filter_01_oc_child_01)
        
    })
    after('Delete Users', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2, userDetails.username3])
    })
})