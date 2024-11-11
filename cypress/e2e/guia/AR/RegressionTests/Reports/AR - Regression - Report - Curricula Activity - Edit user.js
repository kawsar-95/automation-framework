import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCurriculaActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage'
import ARILCActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { ecommFields, employmentDetailsSectionFields, userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'

describe('C7292 AUT-675, AR - Regression - Report - Curricula Activity - Edit user', function(){
    before(function () {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.visit('/admin')
        arDashboardPage.getCoursesReport()

        //Create curriculum
        cy.createCourse('Curriculum')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()

        // Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arDashboardPage.getShortWait()

        // elect Allow All Learners Enrollment All Learners Radio Button
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        arDashboardPage.getShortWait()

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username5])
    })
    
    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'curricula')

        // Delete User
        cy.apiLoginWithSession(userDetails.username5, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it("Filter the saved curriculum in Curricula Activity Report ",()=>{
         //Choose In Curricula Activity from reports
         cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
         cy.wrap(arDashboardPage.getMenuItemOptionByName('Curricula Activity')) 
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', "Curricula Activity")
        
        //Filter By course title
        ARCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)
        // ARCurriculaActivityReportPage.ChooseAddFilter('Azam CURR')
        arDashboardPage.getMediumWait()

        // Select user
        cy.get(ARILCActivityReportPage.getTableCellRecord(currDetails.courseName)).eq(0).click()
        arDashboardPage.getShortWait()

        // Click on Edit User button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        arDashboardPage.getMediumWait()

        // Verify edit user page should be display
        cy.get(arDashboardPage.getPageHeaderTitle()).should('contain', 'Edit User')

        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(commonDetails.appendText)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(commonDetails.appendText)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction(['Sub-Dept A'])


        //Fill out contact information section
        cy.get(ARUserAddEditPage.getAddressTxtF()).type(commonDetails.appendText)
        cy.get(ARUserAddEditPage.getAddress2TxtF()).type(ecommFields.address2 + ' '+ commonDetails.appendText)

        cy.get(ARUserAddEditPage.getCountryDDown()).click()
        cy.get(ARUserAddEditPage.getCountryDDownSearchTxtF()).eq(0).type(ecommFields.country2)
        cy.get(ARUserAddEditPage.getCountryDDownOpt()).contains(ecommFields.country2).click()
        ARUserAddEditPage.getMediumWait()
        cy.get(ARUserAddEditPage.getStateProvinceDDown()).click()
        cy.get(ARUserAddEditPage.getStateProvinceDDownSearchInputTxt()).eq(0).type(ecommFields.province2)
        cy.get(ARUserAddEditPage.getStateProvinceDDownOpt()).contains(ecommFields.province2).click()

        cy.get(ARUserAddEditPage.getCityTxtF()).type(commonDetails.appendText)
        cy.get(ARUserAddEditPage.getZipPostalCodeTxtF()).clear().type(ecommFields.postalCodeUSA)
        cy.get(ARUserAddEditPage.getPhoneTxtF()).type(commonDetails.appendText)

        //Fill out employee details section
        cy.get(ARUserAddEditPage.getEmployeeNumberTxtF()).type(employmentDetailsSectionFields.employeeNumber+ ' '+ commonDetails.appendText)
        cy.get(ARUserAddEditPage.getJobTitleTxtF()).type(employmentDetailsSectionFields.jobTitle+ ' '+ commonDetails.appendText)
        cy.get(ARUserAddEditPage.getLocationTxtF()).type(employmentDetailsSectionFields.location+ ' '+ commonDetails.appendText)
        cy.get(ARUserAddEditPage.getSupervisorDDown()).click()
        cy.get(ARUserAddEditPage.getSupervisorDDownSearchInputTxt()).eq(0).type(employmentDetailsSectionFields.supervisor)
        cy.get(ARUserAddEditPage.getSupervisorDDownOpt()).contains(employmentDetailsSectionFields.supervisor).click({force:true})
        cy.get(ARUserAddEditPage.getGenderDDown()).click()
        cy.get(ARUserAddEditPage.getGenderDDownOpt()).contains(employmentDetailsSectionFields.gender).click()
        cy.get(ARUserAddEditPage.getDateHiredBtn()).click()
        ARUserAddEditPage.getSelectDate(employmentDetailsSectionFields.dateHired)
        cy.get(ARUserAddEditPage.getDateTerminatedBtn()).click()
        ARUserAddEditPage.getSelectDate(employmentDetailsSectionFields.dateTerminated)

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        ARUserAddEditPage.getVShortWait()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', ARILCActivityReportPage.getUserUpdateSuccessText())
        ARUserAddEditPage.getShortWait()
        
        // Verify User should be navigate to curricula activity report page
        cy.url().should('contain', '/admin/curriculaActivity')
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', "Curricula Activity")
    })
})