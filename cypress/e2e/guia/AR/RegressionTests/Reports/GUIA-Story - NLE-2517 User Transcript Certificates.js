import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARCertificateReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCertificateReportPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-571 - C2029 GUIA-Story - NLE-2517 User Transcript Certificates', () => {
    beforeEach('System Admin Login', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
    })

    before('Create user', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    it('Verify Admin user has the correct permissions', () => {
        ARDashboardPage.getRolesReport()
        ARRolesAddEditPage.AddFilter('Name', 'Equals', rolesDetails.Admin)
        ARRolesAddEditPage.selectTableCellRecord(rolesDetails.Admin)
        cy.get(ARRolesAddEditPage.getAddEditMenuActionsByName('View Role'), {timeout: 3000}).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARRolesAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('View Role')
        ARRolesAddEditPage.assertChildPermission('Users', 'View', 'true')
        ARRolesAddEditPage.assertChildPermission('All Reports', 'User Transcript', 'true')
        ARRolesAddEditPage.assertChildPermission('All Reports', 'Certificates', 'true')
        ARRolesAddEditPage.assertChildPermission('All Reports', 'Learner Competencies', 'true')
    })

    it('Create Competency with Badge', () => {
        ARDashboardPage.getCompetenciesReport()
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARCompetencyAddEditPage.getNameErrorMsg() , {timeout:15000}).should('have.text', 'Name is required')

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        cy.get(ARCompetencyAddEditPage.getHasBadgeImageToggleON()).click()

        // Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFileInput(), { timeout:15000 } ).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        
        // Check If Private radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPrivateRadoioBtnSelected()
        // Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
       
        // Save Competency
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    })

    it('Create Online Course with Certificate', () => {
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course', ocDetails.courseName)
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Toggle Certificate to ON
        ARCourseSettingsCompletionModule.switchCertificateToggle()

        // Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        // Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')

        // Add competency
        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyBtn(), { timeout:10000 }).should('exist').click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
  
        // Click on choose btn
         cy.get(ARILCAddEditPage.getCompetenciesSec()).first().find(ARILCAddEditPage.getCompetencyForm()).first().within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyChoose(),{ timeout:10000 }).click({force:true})
        })

        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), { timeout:10000 }).should('exist')
        cy.get(ARILCAddEditPage.getCompetencyDDown()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyOptionItems()).contains(competencyDetails.competencyName).click()
        })

        // Cempetency default list
        cy.get(ARILCAddEditPage.getCompetencyDefaultList()).should('exist')

        // The Level field is optional
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains(' (Required)').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
         })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('Edit GUIAuto - Filter - OC01 course', () => {
        ARDashboardPage.getCoursesReport()
        cy.editCourse(courses.oc_filter_01_name)
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyBtn(), { timeout:10000 }).should('exist').click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
  
        // Click on choose btn
         cy.get(ARILCAddEditPage.getCompetenciesSec()).first().find(ARILCAddEditPage.getCompetencyForm()).first().within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyChoose(),{ timeout:10000 }).click({force:true})
        })

        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), { timeout:10000 }).should('exist')
        cy.get(ARILCAddEditPage.getCompetencyDDown()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyOptionItems()).contains(competencyDetails.competencyName).click()
        })

        // Cempetency default list
        cy.get(ARILCAddEditPage.getCompetencyDefaultList()).should('exist')

        // The Level field is optional
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains(' (Required)').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        ARDashboardPage.getCoursesReport()
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([courses.oc_filter_01_name], [userDetails.username])
    })

    it('Edit GUIAuto - Filter - OC02 course', () => {
        ARDashboardPage.getCoursesReport()
        cy.editCourse(courses.oc_filter_02_name)
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Toggle Certificate to ON
        ARCourseSettingsCompletionModule.switchCertificateToggle()

        // Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn(), {timeout: 3000}).click()
        // Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')

        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyBtn(), { timeout:10000 }).should('exist').click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
  
        // Click on choose btn
         cy.get(ARILCAddEditPage.getCompetenciesSec()).first().find(ARILCAddEditPage.getCompetencyForm()).first().within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyChoose(),{ timeout:10000 }).click({force:true})
        })

        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), { timeout:10000 }).should('exist')
        cy.get(ARILCAddEditPage.getCompetencyDDown()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyOptionItems()).contains(competencyDetails.competencyName).click()
        })

        // Cempetency default list
        cy.get(ARILCAddEditPage.getCompetencyDefaultList()).should('exist')

        // The Level field is optional
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains(' (Required)').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        ARDashboardPage.getCoursesReport()
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([courses.oc_filter_02_name], [userDetails.username])
    })

    it('Create Curriculum Course with Certificate', () => {
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Curriculum', currDetails.courseName)

        cy.get(ARILCSessionReportPage.getCancelBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Toggle Certificate to ON
        ARCourseSettingsCompletionModule.switchCertificateToggle()

        // Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        // Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')

        // Add competency btn
        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyBtn(), { timeout:10000 }).should('exist').click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
  
        // Click on choose btn
         cy.get(ARILCAddEditPage.getCompetenciesSec()).first().find(ARILCAddEditPage.getCompetencyForm()).first().within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyChoose(), { timeout:10000 }).click({force:true})
        })

        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), { timeout:10000 }).should('exist')
        cy.get(ARILCAddEditPage.getCompetencyDDown()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyOptionItems()).contains(competencyDetails.competencyName).click()
        })

        // Competency default list
        cy.get(ARILCAddEditPage.getCompetencyDefaultList()).should('exist')

        // The Level field is optional
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains(' (Required)').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()
         cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })
})

describe('AUT-571 - C2029 GUIA-Story - NLE-2517 User Transcript Certificates', () => {
    beforeEach('System Admin Login', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
    })

    after('Delete User', () => {
        cy.deleteCourse(commonDetails.courseID)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner() , { timeout:15000 }).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username])

        // Undo modifications maded in two 'Filter%' courses
        ARDashboardPage.getCoursesReport()
        cy.editCourse(courses.oc_filter_01_name)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        // Activate the course again
        ARCBAddEditPage.generalToggleSwitch('true', AROCAddEditPage.getCourseIsActiveToggle())

        // Remove competency
        cy.get(ARILCAddEditPage.getCompetenciesSec()).eq(0).within(() => {
            cy.get(ARILCAddEditPage.getDeleteCompetencyBtn(), { timeout:1000 }).eq(0).click({force: true})
        })
        cy.publishCourseAndReturnId()
        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
        cy.get(ARCoursesPage.getDeselectBtn(), {timeout: 3000}).click()

        // Edit the 2nd course
        cy.editCourse(courses.oc_filter_02_name)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        // Toggle Certificate to Off
        ARCourseSettingsCompletionModule.switchCertificateToggle('false')

        // Remove competency
        cy.get(ARILCAddEditPage.getCompetenciesSec()).eq(0).within(() => {
            cy.get(ARILCAddEditPage.getDeleteCompetencyBtn(), { timeout:1000 }).click({force: true})
        })
        cy.publishCourseAndReturnId()
    })

    it('Verify that the User Transcript displayed currectly', () => {       
        // Click on users
        ARDashboardPage.getUsersReport()
        // Filter user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // User Transcript 
        cy.get(ARUserTranscriptPage.getUserTranscriptMenu(), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARUserTranscriptPage.getUserProfileSec()).should('be.visible')
        cy.get(ARUserTranscriptPage.getUserTransCompetency()).should('contain', competencyDetails.competencyName)

        cy.get(ARUserTranscriptPage.getUserTransCertificate()).should('contain', courses.oc_filter_02_name)
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).should('contain', courses.oc_filter_01_name)
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).should('contain', ocDetails.courseName)
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).should('contain', currDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        // Delete course
        cy.deleteCourse(commonDetails.courseIDs[2], 'curricula') 
    })

    it('Verify that deleted course should not get displayed', () => {       
        // Click on users
        ARDashboardPage.getUsersReport()
        // Filter user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // User Transcript 
        cy.get(ARUserTranscriptPage.getUserTranscriptMenu(), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARUserTranscriptPage.getUserProfileSec()).should('be.visible')
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).contains(currDetails.courseName).should('not.exist')
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    })

    it('Delete certificate of a course', () => {       
        ARDashboardPage.getCertificatesReport()

        // Filter user
        ARDashboardPage.A5AddFilter('Course', 'Starts With', ocDetails.courseName)
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        cy.get(ARCertificateReportPage.getCertificateDeleteBtn()).should('be.visible').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARCertificateReportPage.getFooterBtn()).contains('OK').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    })

    it('After delete certificate verify Transcript', () => {       
        // Click on users
        ARDashboardPage.getUsersReport()
        // Filter user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // User Transcript 
        cy.get(ARUserTranscriptPage.getUserTranscriptMenu(), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARUserTranscriptPage.getUserProfileSec()).should('be.visible')
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).contains(ocDetails.courseName).should('not.exist')
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    })

    it('Inactivate the Online Course "GUIAuto - Filter - OC01"', () => {
        ARDashboardPage.getCoursesReport()
        cy.editCourse(courses.oc_filter_01_name)
        ARCBAddEditPage.generalToggleSwitch('false', 'isActive')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Verify that after Inactivate one course, it is displayed in the User Transcript', () => {       
        // Click on users
        ARDashboardPage.getUsersReport()
        // Filter user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // User Transcript 
        cy.get(ARUserTranscriptPage.getUserTranscriptMenu(), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARUserTranscriptPage.getUserProfileSec()).should('be.visible')
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).contains(courses.oc_filter_01_name).should('exist')
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    })

    it('Delete default course certificate file "GUIAuto - Filter - OC02"', () => {
        ARDashboardPage.getCoursesReport()
        cy.editCourse(courses.oc_filter_02_name)
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(ARAddMoreCourseSettingsModule.getCrossIcon()).click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('After delete certificate file, verify that the certificate displayed as grayed out', () => {       
        // Click on users
        ARDashboardPage.getUsersReport()
        // Filter user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // User Transcript 
        cy.get(ARUserTranscriptPage.getUserTranscriptMenu(), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARUserTranscriptPage.getUserProfileSec()).should('be.visible')
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).contains(courses.oc_filter_02_name).should('exist')
        
        cy.get(ARUserTranscriptPage.getUserTransCertificate()).contains(courses.oc_filter_02_name).parent().parent().within(() => {
            cy.get(ARUserTranscriptPage.getCertificateImage()).should('have.css', 'color', 'rgb(54, 54, 78)')
        })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    })

    it('Delete Competency', () => {
        ARDashboardPage.getCompetenciesReport()
        // Search and delete Competency
        ARCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        ARCompetencyPage.getVShortWait()
        ARCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        ARCompetencyPage.A5WaitForElementStateToChange(ARCompetencyPage.getA5AddEditMenuActionsByIndex(4))
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        // Verify Competency is deleted
        cy.get(ARCompetencyPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })
})