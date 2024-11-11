import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARILCActivityReportPage from "../../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import { users } from "../../../../../../../helpers/TestData/users/users"
import ARUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { ilcDetails } from "../../../../../../../helpers/TestData/Courses/ilc"
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import {userDetails, ecommFields, employmentDetailsSectionFields }  from '../../../../../../../helpers/TestData/users/UserDetails'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

describe("C7268 - AUT 667 - AR - ILC Activity - Edit user", function () {
    before(function () {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.visit('/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourses').wait(6000).wait('@getCourses')
        cy.createCourse('Instructor Led', ilcDetails.courseName)
        //publish Course
        cy.publishCourseAndReturnId().then((id)=> {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username5])

        //Choose In ILC Activity from reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('ILC Activity')
    })

    it('ILC Activity page opens - Edit user', function() {
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', "ILC Activity")
        // Select a course
        ARILCActivityReportPage.EnrollmentPageFilter(ilcDetails.courseName)
        // Select an ILC Activity from the list
        cy.get(ARILCActivityReportPage.getTableCellRecord(ilcDetails.courseName)).eq(0).click()
        ARILCActivityReportPage.getMediumWait()

        cy.get(ARILCActivityReportPage.getAddEditMenuActionsByName('Edit User')).click()
        ARILCActivityReportPage.getMediumWait()
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', 'Edit User')

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
    })

    after(function() {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        // Delete User
        cy.apiLoginWithSession(userDetails.username5, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
})