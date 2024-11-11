import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'

describe('C949 AUT-152, AR - CURR - Must Complete All - Required to Complete (cloned)', function(){
    before('Add Curriculum', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Curriculum')

        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])
        
        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })
    
    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Edit cirriculum', () => {        
        cy.editCourse(currDetails.courseName)

        // verify label "Minimum courses"
        cy.get(ARCURRAddEditPage.getCompletionType()).should('contain', 'Minimum courses')

        // Enable the box when the Minimum courses option is selected
        cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).should('not.exist')
        cy.get(ARCURRAddEditPage.getCompletionType()).contains('span', 'Minimum courses').click()
        cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).should('be.visible')

        // Ensure the value is 0 or greater, can only be a number
        cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).type(5).clear()
        cy.get(ARCURRAddEditPage.getEequiredCourseCountContainer() + ' ' + ARCURRAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)

        cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).type(-45).blur()
        cy.get(ARCURRAddEditPage.getEequiredCourseCountContainer() + ' ' + ARCURRAddEditPage.getErrorMsg()).should('contain', miscData.negative_chars_error)
        
        cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).clear().type('fsf').blur()
        cy.get(ARCURRAddEditPage.getEequiredCourseCountContainer() + ' ' + ARCURRAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)

        cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).type(45)
        cy.get(ARCURRAddEditPage.getEequiredCourseCountContainer() + ' ' + ARCURRAddEditPage.getErrorMsg()).should('contain', 'Field must be less than or equal to 2.')

        // Enter valid value
        cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).clear().type(1)

        // Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})