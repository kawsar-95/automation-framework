import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('C1767 AUT-409, AR - CURR - NLE -Add Curricula group changes to support credit based completion(Admin)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })
    
    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Create Curriculum, Verify Completion Section Toggles, Radio Buttons and Fields, Upload Certificate, & Publish Course', () => {        
        cy.createCourse('Curriculum')

        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name, courses.oc_filter_02_name])

        // verify label "Minimum Credits"
        cy.get(ARCURRAddEditPage.getCompletionType()).should('contain', 'Minimum credits')

        // Enable the box when the credits option is selected
        cy.get(ARCURRAddEditPage.getRequiredCreditCountF()).should('not.exist')
        cy.get(ARCURRAddEditPage.getCompletionType()).contains('span', 'Minimum credits').click()
        cy.get(ARCURRAddEditPage.getMinimumcreditsBtn()).should('have.attr', 'aria-checked', 'true')
        cy.get(ARCURRAddEditPage.getRequiredCreditCountF()).should('be.visible')

        // Ensure the value is 0 or greater, can only be a number
        cy.get(ARCURRAddEditPage.getRequiredCreditCountF()).type(5).clear()
        cy.get(ARCURRAddEditPage.getRequiredCreditCountContainer() + ' ' + ARCURRAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)

        cy.get(ARCURRAddEditPage.getRequiredCreditCountF()).type(-45).blur()
        cy.get(ARCURRAddEditPage.getRequiredCreditCountContainer() + ' ' + ARCURRAddEditPage.getErrorMsg()).should('contain', miscData.negative_chars_error)
        
        cy.get(ARCURRAddEditPage.getRequiredCreditCountF()).clear().type('fsf').blur()
        cy.get(ARCURRAddEditPage.getRequiredCreditCountContainer() + ' ' + ARCURRAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)

        // Enter valid value
        cy.get(ARCURRAddEditPage.getRequiredCreditCountF()).type(45)

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})