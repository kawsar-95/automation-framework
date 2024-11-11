import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails} from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'

describe('C7331 AUT-693, AE Regression - Course Bundle - Availability - Expiration', () => {
    beforeEach('Login as Admin and create course for add bundle course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
       
    })

    after(() => {
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Create Course Bundle', () => {
        //Add to course bundle with all mandatory field should be filled correctly.
        cy.createCourse('Course Bundle')
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
       
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
     
        //Click Availability section - add access data
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Availability')).click().click()
    
        // Verify that Subsection should be displayed correctly Access date and Expiration
        cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Access Date').should('exist')
        cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Expiration').should('exist')
        
        // Verify that Navigate two option should be displayed:
        cy.get(ARCourseSettingsAvailabilityModule.getAvailabilityAccessDateRadioBtn()).contains('No Access Date').should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getAvailabilityAccessDateRadioBtn()).contains('Date').should('exist')
      
        // Verify that Navigate three option should be displayed:
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('No Expiration').should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Time from enrollment').should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Date').should('exist')
            

        // Select "Time From Enrollment" option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Time from enrollment').click()
             

        // Asserting Date format YYYY-MM-DD
        cy.get(ARILCAddEditPage.getAddSessionModalSubTitle()).contains('Expire in').should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInYearsTxtF()).should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInMonthsTxtF()).should('exist')
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).should('exist')


        // Select "Date" option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains(/^Date$/).click()
    
        // Verify date expire should be displayed with date and time
        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date)
       

        cy.get(ARCourseSettingsAvailabilityModule.getDateExpiresTimePickerBtn()).click()
        arCoursesPage.SelectTime(6,5,'PM')
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')

        // Asserting Course should be saved sucessfully.
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
    })
})

