import AdminNavationModuleModule from "../../../../../../helpers/AR/modules/AdminNavationModule.module"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe("C2028 - AUT-570 - Core Regression - GUIA-Story - NLE-2525 User Transcript Layout", () => {
  let certficate=["Feb","April"]
  let sortedCert=[...certficate]
  sortedCert.sort()

  after('Delete courses and user',()=>{
    // Delete Courses
    for (let i = 0; i < commonDetails.courseIDs.length; i++) {
        cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
    }
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
    ARDashboardPage.deleteUsers([userDetails.username])
  })

  beforeEach('Login admin',()=>{
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
  })

  it("Create the firest test course", () => {
    ARDashboardPage.getCoursesReport()
    // Create ILC course
    cy.createCourse('Instructor Led', ilcDetails.courseName, true)

    // Open Completion Section
    cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

    // Toggle Certificate to ON
    ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
    // Select a Certificate File
    cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
    // Opening Media Library 
    cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
    cy.get(ARUploadFileModal.getChooseFileBtn()).click
    cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
    cy.get(ARUploadFileModal.getSaveBtn()).click()

    cy.get(ARCourseSettingsCompletionModule.getCustonCertificateNameBtn()).click()

    cy.get(ARCourseSettingsCompletionModule.getCustomCertificateNameInput()).type(certficate[0])

    cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
    })
    cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username],ilcDetails.sessionName)
  })


  it("Create the second test course", () => {
    ARDashboardPage.getCoursesReport()

    // Create ILC course
    cy.createCourse('Instructor Led', ilcDetails.courseName2, true)

    // Open Completion Section
    cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

    // Toggle Certificate to ON
    ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
    // Select a Certificate File
    cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
    // Opening Media Library 
    cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
    cy.get(ARUploadFileModal.getChooseFileBtn()).click
    cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
    cy.get(ARUploadFileModal.getSaveBtn()).click()

    cy.get(ARCourseSettingsCompletionModule.getCustonCertificateNameBtn()).click()
    cy.get(ARCourseSettingsCompletionModule.getCustomCertificateNameInput()).type(certficate[1])

    cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
    })

    AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName2], [userDetails.username],ilcDetails.sessionName)
  })

  it('Verify Transcript Layout',()=>{
    ARDashboardPage.getUsersReport()
    cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
    cy.get(ARUserPage.getGridFilterResultLoader(), {timeout: 15000}).should('not.exist')
    cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))  

    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getCourseName()).contains(ilcDetails.courseName).click()
    
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getEnrollmentActivity(), {timeout:10000}).should('be.visible')
    cy.get(ARUserTranscriptPage.getScoreInput()).type(50)
    cy.get(ARUserTranscriptPage.getScoreInput()).clear()
    cy.get(ARUserTranscriptPage.getRadioBtn(), {timeout:10000}).eq(1).contains('Completed').click()
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getCompletedOnSec(), {timeout:10000}).contains('Completed On').should('be.visible')
    cy.get(ARUserTranscriptPage.getSubmitBtn(),{timeout:10000}).click()
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')

    cy.get(ARUserTranscriptPage.getCourseName()).contains(ilcDetails.courseName2).click()

    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getEnrollmentActivity(), {timeout:10000}).should('be.visible')
    cy.get(ARUserTranscriptPage.getScoreInput()).type(50)
    cy.get(ARUserTranscriptPage.getScoreInput()).clear()
    cy.get(ARUserTranscriptPage.getRadioBtn(), {timeout:10000}).eq(1).contains('Completed').click()
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getCompletedOnSec(), {timeout:10000}).contains('Completed On').should('be.visible')
    cy.get(ARUserTranscriptPage.getSubmitBtn(),{timeout:10000}).click()
    cy.get(ARUserTranscriptPage.getToastSuccessMsg(), {timeout: 5000}).contains('Course activity has been updated')

    cy.get(ARUserTranscriptPage.getCollapseBtn(), {timeout:10000}).should('exist')
    cy.get(ARUserTranscriptPage.getCollapseIcon()).should('be.visible')
 
    cy.get(ARUserTranscriptPage.getTitle()).should('contain',"Profile")
    cy.get(ARUserTranscriptPage.getTitle()).should('contain',"Enrollments")

    ARUserTranscriptPage.getRightMenuContext()

    cy.get(ARUserTranscriptPage.getBackBtn()).click()
    cy.get(ARUserTranscriptPage.getGridFilterResultLoader(), {timeout: 15000}).should('not.exist')
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    // Update profile
    for(let i =0; i<certficate.length;i++){
        cy.get(ARUserTranscriptPage.getCertificateCourse()).should('contain',sortedCert[i])
      }
    cy.get(ARUserTranscriptPage.getEnrollmentBtn()).click()
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getTable()).should('exist')
  })

  it('Delete the first certificate',()=>{
    ARDashboardPage.getUsersReport()
    cy.get(ARUserPage.getGridFilterResultLoader(), {timeout: 7500}).should('not.exist')
    cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))    
    cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))

    cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')

    cy.get(ARUserTranscriptPage.getCertificateBtn()).click()
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getCertificateTable()).should('be.visible')
    cy.get(ARUserTranscriptPage.getCertificateTable(), {timeout:10000}).contains(ilcDetails.courseName2).should('exist').click()
    cy.get(ARUserTranscriptPage.getContextBtn()).contains('Delete').invoke('show', {timeout: 5000}).click()
    cy.get(ARUserTranscriptPage.getModal()).contains('OK').should('be.visible').click()
  })

  it('Delete the second certificate',()=>{
    ARDashboardPage.getUsersReport()
    cy.get(ARUserPage.getGridFilterResultLoader(), {timeout: 7500}).should('not.exist')
    cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))    
    cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))

    cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')

    cy.get(ARUserTranscriptPage.getCertificateBtn()).click()
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getCertificateTable()).should('be.visible')
    cy.get(ARUserTranscriptPage.getCertificateTable(), {timeout:10000}).contains(ilcDetails.courseName).should('exist').click()
    cy.get(ARUserTranscriptPage.getContextBtn()).contains('Delete').invoke('show', {timeout: 5000}).click()
    cy.get(ARUserTranscriptPage.getModal()).contains('OK').should('be.visible').click()
  })
  

  it('Assert certificate',()=>{
    ARDashboardPage.getUsersReport()
    cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
    cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
    cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
    cy.get(ARDashboardPage.getWaitSpinner() , {timeout:10000}).should('not.exist')
    cy.get(ARUserTranscriptPage.getCertificateCourse()).should('not.exist')
  })
})
