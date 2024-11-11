import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { users } from "../../../../../../helpers/TestData/users/users"
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import AdminNavationModuleModule from "../../../../../../helpers/AR/modules/AdminNavationModule.module"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import { images, resourcePaths} from "../../../../../../helpers/TestData/resources/resources"
import { helperTextMessages } from "../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails"
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"


describe("AUT-702 - C7327 - ILC Sessions Report - Mark Attendance AR Form Regression", () => {
    after('Delete the test user and course as part of clean-up', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username])
    })

    it('Create competencies', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Competencies')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")

        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName, {delay :150})
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)
        cy.get(ARCompetencyAddEditPage.getHasBadgeImageToggleON(), {timeout:15000}).click()
        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        cy.get(ARCompetencyPage.getWaitSpinner()).should('not.exist')
         
        // Check Helper text when private radio button is selecetd
        cy.get(A5GlobalResourceAddEditPage.getPrivateRadioBtnHelperText()).should('have.text',helperTextMessages.textWhenPrivateSelecetd)
 
        // Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn() 
 
        // Check Helper text when Public radio button is selecetd
        cy.get(A5GlobalResourceAddEditPage.getPublicRadioBtnHelperText()).should('have.text',helperTextMessages.textWhenPublicSelecetd)
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()  
        cy.get(ARCompetencyPage.getWaitSpinner()).should('not.exist')
        // Save Competency
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

    })

    it('Scenario 14 Mark Attendance – Award Certificate And Competency', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)  

        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
        //Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        //Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARUploadFileModal.getSaveBtn()).click()

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyBtn(), {timeout:10000}).should('exist').click()
        })
        
        cy.get(ARCourseSettingsCompletionModule.getCourseCompetenciesContent()).eq(0).within(()=>{
            cy.get(ARDashboardPage.getDDown()).eq(0).click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:10000}).should('be.visible')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:10000}).contains(competencyDetails.competencyName).should('be.visible').click()

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

    
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username],ilcDetails.sessionName)
       })

    it('Scenario 14 Mark Attendance page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARCoursesPage.getGridTableColumnCourseName(ilcDetails.courseName)).should('be.visible')
        
        cy.get(ARDashboardPage.getGridTable(), {timeout:10000}).eq(0).click() 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).click()

        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCSessionReportPage.getMarkAttendanceClassBtn()).eq(2).click()

        cy.get(ARILCSessionReportPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    })

    it('Scenario 14 Learner16 Transcript is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToLearnerActivityPage()    
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARCoursesPage.getGridTableNameColumn()).contains("GUIA-CED").should('be.visible')

        cy.get(ARDashboardPage.getTableCellRecord(userDetails.username)).click({ force: true })
        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        
        cy.get(ARUserTranscriptPage.getCompetencies()).should('contain',competencyDetails.competencyName)

        cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).should('contain','Complete')
        cy.get(ARUserTranscriptPage.getUserTranscriptScore()).should('contain','100')
        cy.get(ARUserTranscriptPage.getUserTranscriptCredits()).should('contain','')  
    })

    it('Scenario 14 ILC Activity Report is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToILCActivityPage()        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(ilcDetails.courseName)  

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCActivityReportPage.getGridDisplayBtn(), {timeout:10000}).click({force:true})

        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Credits').click()
        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Date Completed').click()
        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Classes Attended').click()

        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('First Name').click()
        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Last Name').click()

        cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','Complete')

        cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(0).should('contain','100')

        cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(0).should('contain','')

        cy.get(ARILCActivityReportPage.getILCActivityReportClassAttended()).eq(0).should('contain','1')
    })

    it('Scenario 14 Course Enrollments Report is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

         ARDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName)
        // Select the curriculum
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
         
        // Click on Course Enrollments
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()

        cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(0).should('contain','100')

        cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','Complete')
    })
})