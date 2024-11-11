import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C955 - Update Metrics for Course Bundle', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(() => {
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Add metrics and create Course', () => {
        // Navigate to Courses
       ARDashboardPage.getCoursesReport()

        cy.createCourse('Course Bundle')

        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        //here wait is necessary
        ARDashboardPage.getLShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()

        cy.get(ARDashboardPage.getElementByNameAttribute('audience')).type('Audience')
        cy.get(ARDashboardPage.getElementByNameAttribute('goals')).type('Goals')
        cy.get(ARDashboardPage.getElementByNameAttribute('externalId')).type('External ID')
        cy.get(ARDashboardPage.getElementByNameAttribute('vendor')).type('Vendor')

        // publish the course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
      
    })
    it('Edit Course Bundle, Remove added metrics', () => {
   
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()

        cy.editCourse(cbDetails.courseName)

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARDashboardPage.getLShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()

        cy.get(ARDashboardPage.getElementByNameAttribute('audience')).clear()
        cy.get(ARDashboardPage.getElementByNameAttribute('goals')).clear()
        cy.get(ARDashboardPage.getElementByNameAttribute('externalId')).clear()
        cy.get(ARDashboardPage.getElementByNameAttribute('vendor')).clear()

        cy.publishCourse()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
    })
    it('Edit Course Bundle, Add HTML tags', () => {
       
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
        cy.editCourse(cbDetails.courseName)

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARDashboardPage.getLShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()

        cy.get(ARDashboardPage.getElementByNameAttribute('audience')).type('<p>Audience</p>')
        cy.get(ARDashboardPage.getElementByNameAttribute('goals')).type('<a>Goals</a>')
        cy.get(ARDashboardPage.getElementByNameAttribute('externalId')).type('<h1>External ID</h1>')
        cy.get(ARDashboardPage.getElementByNameAttribute('vendor')).type('<h3>Vendor</h3>')

        //click on publish
        cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).contains('Publish').click({ force: true })

        cy.get(ARDashboardPage.getElementByDataNameAttribute('error')).should('contain', 'Field contains invalid characters.')

    })
    it('Edit Course Bundle, Add 4000 characters in Audience and 255 in external ID', () => {
      
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
    

        cy.editCourse(cbDetails.courseName)

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARDashboardPage.getLShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()

        let audienceString = 'a'.repeat(4100)
        let externalIDString = 'i'.repeat(256)
       

        cy.get(ARDashboardPage.getElementByNameAttribute('audience')).type(audienceString)

        cy.get(ARDashboardPage.getElementByNameAttribute('externalId')).type(externalIDString)

        cy.get(ARDashboardPage.getElementByDataNameAttribute('error')).should('contain', 'Field cannot be more than 4000 characters.')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('error')).should('contain', 'Field cannot be more than 255 characters.')


        //click on publish
        // cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).contains('Publish').click({ force: true })


    })
})