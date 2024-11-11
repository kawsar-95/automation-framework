import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARCertificateReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCertificateReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6370 - Certificates', () => {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    after(() => {
        cy.deleteCourse(commonDetails.courseID)
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARDashboardPage.selectTableCellRecord(userDetails.username))
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete'), ARDashboardPage.getShortWait()))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), ARDashboardPage.getLShortWait()))
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(ARDashboardPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
    it('Create OC Course, Upload Certificate, & Publish Course', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course')

        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARDashboardPage.getShortWait()

        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getMediumWait() //Wait for toggles to become enabled

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')

        //Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        // cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARDashboardPage.getElementByDataNameAttribute('image-preview')).eq(0).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('media-library-apply')).click()
        // cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARDashboardPage.getVShortWait()
        // cy.get(ARUploadFileModal.getSaveBtn(), { timeout: 5000 }).click()
        ARDashboardPage.getLongWait()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARDashboardPage.getMediumWait()
        //Enroll Leaner in already created course
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])

    })
    it('Certificates', () => {
        //Navigate to certificates
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('Certificates')
        ARDashboardPage.getMediumWait()
        //Certificate should be displayed as per Sorting Like as
        cy.get(ARDashboardPage.getTableHeader()).eq(1).should('contain', 'Course')
        cy.get(ARDashboardPage.getTableHeader()).eq(2).should('contain', 'Last Name')
        cy.get(ARDashboardPage.getTableHeader()).eq(3).should('contain', 'First Name')
        cy.get(ARDashboardPage.getTableHeader()).eq(4).should('contain', 'Department')
        cy.get(ARDashboardPage.getTableHeader()).eq(5).should('contain', 'Certification Date')
        cy.get(ARDashboardPage.getTableHeader()).eq(6).should('contain', 'Expiry Date')
        cy.get(ARDashboardPage.getTableHeader()).eq(7).should('contain', 'Expires in Days')

        //Filter certificates
        ARDashboardPage.A5AddFilter('Course', 'Starts With', ocDetails.courseName)
        ARDashboardPage.getLongWait()

        //Select any Existing Certificate
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Edit')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'Delete')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'Download')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).should('contain', 'Deselect')

        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getMediumWait()
        //Update the certificate date
        cy.get(ARCertificateReportPage.getDatePicker()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getDayBtn()).eq(10).click()
        // Update the expiry date.
        cy.get(ARCertificateReportPage.getDatePicker()).eq(1).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getDayBtn()).eq(10).click()

        //Click on download button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        ARDashboardPage.getMediumWait()
        //Click on Save button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        //Update the certificate date
        cy.get(ARCertificateReportPage.getDatePicker()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getDayBtn()).eq(10).click()
        // Click on cancel
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getShortWait()
        cy.get(ARUnsavedChangesModal.getBlatantUnsavedChangesTxt()).should('exist')
        //Click on save
        cy.get(ARUnsavedChangesModal.getSaveBtn()).click()

        //Click on Edit again, cancel=>don't save
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        //Update the certificate date
        cy.get(ARCertificateReportPage.getDatePicker()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getDayBtn()).eq(10).click()
        // Click on cancel
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getShortWait()
        cy.get(ARUnsavedChangesModal.getBlatantUnsavedChangesTxt()).should('exist')
        //Click on don't save
        cy.get(ARUnsavedChangesModal.getModalContent()).within(() => {
            cy.get(ARUnsavedChangesModal.getDontSaveBtn()).click()
        })
        //Click on Edit again, cancel=>cancel
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        //Update the certificate date
        cy.get(ARCertificateReportPage.getDatePicker()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getMonthNextBtn()).eq(0).click()
        cy.get(ARCertificateReportPage.getDayBtn()).eq(10).click()
        // Click on cancel
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getShortWait()
        cy.get(ARUnsavedChangesModal.getBlatantUnsavedChangesTxt()).should('exist')
        //Click on Cancel
        cy.get(ARUnsavedChangesModal.getModalContent()).within(() => {
            cy.get(ARUnsavedChangesModal.getModalCancelBtn()).click()
        })

        //Click on View History
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARCertificateReportPage.getHistoryCloseBtn()).click()

        //Navigate to certificates
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getShortWait()
        cy.get(ARUnsavedChangesModal.getBlatantUnsavedChangesTxt()).should('exist')
        //Click on Don't save
        cy.get(ARUnsavedChangesModal.getModalContent()).within(() => {
            cy.get(ARUnsavedChangesModal.getDontSaveBtn()).click()
        })
        ARDashboardPage.getMediumWait()
        //Click on Deselect Button 
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click()
        ARDashboardPage.getShortWait()
        //Click on Delete=>Cancel
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        cy.get(ARDeleteModal.getA5CancelBtn()).click()
        //Click on Delete=>Ok
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
    })
})