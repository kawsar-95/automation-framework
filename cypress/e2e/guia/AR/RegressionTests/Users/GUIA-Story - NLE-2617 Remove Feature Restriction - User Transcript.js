import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREditActivityPage from "../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage"
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


let courseTypes = ['online-courses', 'instructor-led-courses-new', 'curricula'];

describe('AUT-578 - C2038 GUIA-Story - NLE-2617 Remove Feature Restriction - User Transcript', () => {
    beforeEach('Login as System Admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
    })

    after('Delete User and Courses', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], courseTypes[i])
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username])
    })

    it('Create Competency with Badge', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
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

    it('Create Online Course with Competency, Badge and Certificate', () => {
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course', ocDetails.courseName)
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getCertificateToggleBtn()
        // Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        // Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')

        // Add Competency button
        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyBtn(), { timeout:10000 }).should('exist').click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
  
        // Click on choose button
         cy.get(ARILCAddEditPage.getCompetenciesSec()).first().find(ARILCAddEditPage.getCompetencyForm()).first().within(() => {
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
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains('Required').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('Create ILC Course with Competency, Badge and Certificate', () => {
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getCertificateToggleBtn()
        // Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        // Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')

        // Add Competency btn
        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyBtn(), { timeout:10000 }).should('exist').click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
  
        // Click on choose button
         cy.get(ARILCAddEditPage.getCompetenciesSec()).first().find(ARILCAddEditPage.getCompetencyForm()).first().within(() => {
            cy.get(ARILCAddEditPage.getCompetencyChoose(),{ timeout:10000 }).click({force:true})
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
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains('Required').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username])
    })

    it('Create Curriculum Course with Competency, Badge and Certificate', () => {
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Curriculum', currDetails.courseName)

        cy.get(ARILCSessionReportPage.getCancelBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getCertificateToggleBtn()
        // Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        // Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')

        // Add Competency btn
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

        // Cempetency default list
        cy.get(ARILCAddEditPage.getCompetencyDefaultList()).should('exist')

        // The Level field is optional
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains('Required').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })

    it('Verify user Transcript displayed currectly', () => {       
        // Click on users
        ARDashboardPage.getUsersReport()
        // Filter user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // User Transcript 
        cy.get(ARILCActivityReportPage.getUserTranscriptBtn(), {timeout: 5000}).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')


        cy.get(ARUserTranscriptPage.getUserProfileSec()).should('be.visible')
        cy.get(ARUserTranscriptPage.getUserTransBadge()).should('exist')
        cy.get(ARUserTranscriptPage.getUserTransCompetency()).should('contain', competencyDetails.competencyName)
        cy.get(ARUserTranscriptPage.getCertificateName()).should('contain', ocDetails.courseName)
        cy.get(ARUserTranscriptPage.getCertificateName()).should('contain', currDetails.courseName)


        cy.get(ARUserTranscriptPage.getCourseNameCol()).should('contain', ilcDetails.courseName)
        cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).should('contain', 'Not Started')

        cy.get(ARUserTranscriptPage.getCourseNameCol()).should('contain', ocDetails.courseName)
        cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).should('contain', 'Complete')
 
        cy.get(ARUserTranscriptPage.getCourseNameCol()).should('contain', currDetails.courseName)
        cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).should('contain', 'Complete')

        cy.get(ARUserTranscriptPage.getCourseNameCol()).contains(ilcDetails.courseName).click()
        
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(AREditActivityPage.getRadioBtn()).eq(1).should('have.attr', 'aria-checked', 'false')
        cy.get(ARCURRAddEditPage.getRadiobtn(), { timeout: 10000 }).eq(1).click().click()
        cy.get(AREditActivityPage.getRadioBtn()).eq(1).should('have.attr', 'aria-checked', 'true')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        
        cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('be.visible')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARUserTranscriptPage.getSubmitBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

        cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).contains('Not Started').should('not.exist')
        cy.get(ARUserTranscriptPage.getCertificateName()).should('contain', ilcDetails.courseName)
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