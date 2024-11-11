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
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"


describe("AUT-702 - C7327 - ILC Sessions Report - Mark Attendance AR Form Regression", () => {
    after('Delete the test user and course as part of clean-up', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username])
    })

    it('Scenario 7 Mark Attendance - In Progress Session', () => {     
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel(`Add Instructor Led`)).should('have.text', `Add Instructor Led`).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).invoke('val', ilcDetails.courseName.slice(0, -1)).type(ilcDetails.courseName2.slice(-1))
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).type(ilcDetails.description)
        cy.get(ARILCAddEditPage.getGeneralLanguageDDown()).click({ force: true })
        cy.get(ARILCAddEditPage.getGeneralLanguageDDownOpt()).contains('English').click({ force: true })
        // Add Session to ILC with start date 2 days into the future
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
        
        cy.get(ARILCAddEditPage.getRecurringClasses()).contains('None').click()
        cy.get(ARILCActivityReportPage.getPropertyNameDDownOpt()).contains('day(s)').click()
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).clear().type(3)

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)

        //Open Completion Section
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
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username],ilcDetails.sessionName)
    })

    it('Scenario 7 Mark Attendance page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)

        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARCoursesPage.getGridTableColumnCourseName(ilcDetails.courseName)).should('be.visible')
    
        cy.get(ARDashboardPage.getGridTable(), {timeout:10000}).eq(0).click() 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).click()

        cy.get(ARILCSessionReportPage.getMarkAttendanceClassBtn()).eq(0).click()
        cy.get(ARILCSessionReportPage.getMarkAttendanceClassBtn()).eq(1).click()
 
        cy.get(ARILCSessionReportPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    })

    it('Scenario 7 Learner8 Transcript is correctly updated', () => {
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

        cy.get(ARUserTranscriptPage.getUserTranscriptStatus()).should('contain','In Progress')
        cy.get(ARUserTranscriptPage.getUserTranscriptScore()).should('contain','')
        cy.get(ARUserTranscriptPage.getUserTranscriptCredits()).should('contain','')  
    })

    it('Scenario 7 ILC Sessions Report is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
       
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(10)).should('contain', 0)
        cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(11)).should('contain', 0)
        
    })

    it('Scenario 7 Edit Activity Page is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Activity"))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
               
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity'), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
        cy.get(ARILCSessionReportPage.getEditActivityScore()).should('have.value', '')
        cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
        cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','In Progress')
    })

    it('Scenario 7 ILC Activity Report is correctly updated', () => {
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

        cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','InProgress')

        cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(0).should('contain','')

        cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(0).should('contain','')

        cy.get(ARILCActivityReportPage.getILCActivityReportClassAttended()).eq(0).should('contain','2')
    })

    it('Scenario 7 Mark Grades and Attendance Report is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)

        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARCoursesPage.getGridTableColumnCourseName(ilcDetails.courseName)).should('be.visible')
    
        cy.get(ARDashboardPage.getGridTable(), {timeout:10000}).eq(0).click() 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,6)).should('contain','In Progress')

        cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,7)).should('contain','')
    })

    it('Scenario 7 Course Enrollments Report is correctly updated', () => {
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

        cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(0).should('contain','66.67')

        cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','In Progress')
    })

})