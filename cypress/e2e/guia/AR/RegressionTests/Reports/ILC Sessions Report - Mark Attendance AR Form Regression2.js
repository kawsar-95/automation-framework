import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails} from "../../../../../../helpers/TestData/Courses/commonDetails"
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
import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARILCEditActivityPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"


describe("AUT-702 - C7327 - ILC Sessions Report - Mark Attendance AR Form Regression", () => {
    after('Delete the test user and course as part of clean-up', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2, userDetails.username3])
    })


    it("scenerio 2   Mark Attendance - Multiple Classes", () => {     
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel(`Add Instructor Led`)).should('have.text', 'Add Instructor Led').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).invoke('val', ilcDetails.courseName2.slice(0, -1)).type(ilcDetails.courseName2.slice(-1))
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).type(ilcDetails.description)
        cy.get(ARILCAddEditPage.getGeneralLanguageDDown()).click({ force: true })
        cy.get(ARILCAddEditPage.getGeneralLanguageDDownOpt()).contains('English').click({ force: true })
        // Add Session to ILC with start date 2 days into the future
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(ilcDetails.sessionDescription)
        
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
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        // cy.get(ARUploadFileModal.getSaveBtn()).click()

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName2], [userDetails.username,userDetails.username2, userDetails.username3],ilcDetails.sessionName)
    })

    it("scenerio 2 Mark Attendance page", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName2)

        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARCoursesPage.getGridTableColumnCourseName(ilcDetails.courseName2)).should('be.visible')
        
        cy.get(ARDashboardPage.getGridTable(), {timeout:10000}).eq(0).click() 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).click()

        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(4).click()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(6).click()

        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(8).click()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(9).click()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(10).click()

        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(12).dblclick()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(13).dblclick()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(14).dblclick()

        cy.get(ARBillboardsAddEditPage.getFileBrowserSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    })

    it("Scenerio 2  Learner 1 transcript update", () => {
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

        ARUserTranscriptPage.assertStatusAndScoreAndCredit({secondaryScore: ''})
    })

    it("Scenerio 2  Learner 2 transcript update", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToLearnerActivityPage()    
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
        
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARCoursesPage.getGridTableNameColumn()).contains("GUIA-CED").should('be.visible')

        cy.get(ARDashboardPage.getTableCellRecord(userDetails.username2)).click({ force: true })
        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        ARUserTranscriptPage.assertStatusAndScoreAndCredit({secondaryScore: ''})
    })

    it("Scenerio 2  Learner 3 transcript update", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToLearnerActivityPage()    
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username3)
        
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARCoursesPage.getGridTableNameColumn()).contains("GUIA-CED").should('be.visible')

        cy.get(ARDashboardPage.getTableCellRecord(userDetails.username3)).click({ force: true })
        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('be.visible').click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        ARUserTranscriptPage.assertStatusAndScoreAndCredit({secondaryScore: ''})
    })

    it("Scenerio 2 ILC Sessions Report is correctly updated", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
       
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName2)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(9)).invoke('text').then((text) => {
            if(text == 3){
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(9)).should('contain',3)
            }else if(text == 0){
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(9)).should('contain',0)
            }else{
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(9)).should('contain',1)
            }
        })

        cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(10)).invoke('text').then((text) => {
            if(text == 3){
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(10)).should('contain',3)
            }else if(text == 0){
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(10)).should('contain',0)
            }else{
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(10)).should('contain',1)
            }
        })

        cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(11)).invoke('text').then((text) => {
            if(text == 3){
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(11)).should('contain',3)
            }else if(text == 0){
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(11)).should('contain',0)
            }else{
                cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(11)).should('contain',1)
            }
        })
    })

    it("Scenerio 2 User3 Edit Activity Page is correctly updated", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Activity"))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName2)
               
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity'), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCSessionReportPage.getEditActivityStatus()).invoke('text').then((text) => {
            if(text == 'In Progress'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','In Progress')
            }else if(text == 'Complete'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value',100)
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','Complete')
            }else{
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain',"Not Started")
            }
        })
    })

    it("Scenerio 2 User2 Edit Activity Page is correctly updated", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Activity"))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName2)
               
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
        
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity'), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        
        cy.get(ARILCSessionReportPage.getEditActivityStatus()).invoke('text').then((text) => {
            if(text == 'In Progress'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','In Progress')
            }else if(text == 'Complete'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value',100)
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','Complete')
            }else{
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain',"Not Started")
            }
        })
    })

    it("Scenerio 2 User2 Edit Activity Page is correctly updated", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Activity"))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName2)
               
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username3)
        
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity'), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
       
        cy.get(ARILCSessionReportPage.getEditActivityStatus()).invoke('text').then((text) => {
            if(text == 'In Progress'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','In Progress')
            }else if(text == 'Complete'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value',100)
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','Complete')
            }else{
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain',"Not Started")
            }
        })
    })

    it("Scenerio 2 ILC Activity Report is correctly updated", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToILCActivityPage()        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(ilcDetails.courseName2)  

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCActivityReportPage.getGridDisplayBtn(), {timeout:10000}).click({force:true})

        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Credits').click()
        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Date Completed').click()
        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Classes Attended').click()

        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('First Name').click()
        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Last Name').click()

        assertILCReport(0)
        assertILCReport(1)
        assertILCReport(2)
    })

    it('Scenerio 2 Mark Grades and Attendance Report is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName2)

        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARCoursesPage.getGridTableColumnCourseName(ilcDetails.courseName2)).should('be.visible')
    
        cy.get(ARDashboardPage.getGridTable(), {timeout:10000}).eq(0).click() 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2), {timeout:10000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,7)).invoke('text').then((text) => {
            if(text == ''){
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,6)).should('contain','In Progress')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,7)).should('contain','')
            }else if(text == 100){
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,6)).should('contain','Complete')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,7)).should('contain','100')
            }else{
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,6)).should('contain','Not Started')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,7)).should('contain','')
            }
        })

        cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2, 7)).invoke('text').then((text) => {
            if (text == '') {
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,6)).should('contain', 'Not Started')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,7)).should('contain', '')
            } else if (parseInt(text, 10) == 100) {
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,6)).should('contain', 'Complete')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,7)).should('contain', '100.00')
            } else {
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,6)).should('contain', 'In Progress')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,7)).should('contain', '')
            }
        })

        cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(3,6)).invoke('text').then((text) => {
            if(text == ''){
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(3,6)).should('contain','Not Started')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(3,7)).should('contain','')
            }else if(text == 100){
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(3,6)).should('contain','Complete')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(3,7)).should('contain','100')
            }else{
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(3,6)).should('contain','In Progress')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(3,7)).should('contain','')
            }
        })
    })

    it('Scenerio 2 Course Enrollments Report is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        // Navigate to Courses
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")

        ARDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName2)
 
        // Select the curriculum
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
         
        // Click on Course Enrollments
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()

        cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(0).invoke('text').then((text) => {
            if(text == '66.67'){
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(0).should('contain','66.67')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','In Progress')
            }else if(text == '100'){
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(0).should('contain','100')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','Complete')
            }else{
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(0).should('contain','0')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','Not Started')
            }
        })

        cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(1).invoke('text').then((text) => {
            if(text == '66.67'){
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(1).should('contain','66.67')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(1).should('contain','In Progress')
            }else if(text == '100'){
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(1).should('contain','100')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(1).should('contain','Complete')
            }else{
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(1).should('contain','0')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(1).should('contain','Not Started')
            }
        })

        cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(2).invoke('text').then((text) => {
            if(text == '66.67'){
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(2).should('contain','66.67')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(2).should('contain','In Progress')
            }else if(text == '100'){
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(2).should('contain','100')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(2).should('contain','Complete')
            }else{
                cy.get(ARILCActivityReportPage.getILCReportProgress()).eq(2).should('contain','0')
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(2).should('contain','Not Started')
            }
        })
    })
})

function assertILCReport(rowNumber) {
    cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(rowNumber).invoke('text').then((text) => {
        if(text == 'NotStarted'){
            cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(rowNumber).should('contain','NotStarted')
            cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(rowNumber).should('contain','')
            cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(rowNumber).should('contain','')
            cy.get(ARILCActivityReportPage.getILCActivityReportClassAttended()).eq(rowNumber).should('contain','0')
        }else if(text == 'Complete'){
            cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(rowNumber).should('contain','Complete')
            cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(rowNumber).should('contain','100')
            cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(rowNumber).should('contain','')
            cy.get(ARILCActivityReportPage.getILCActivityReportClassAttended()).eq(rowNumber).should('contain','3')
        }else{
            cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(rowNumber).should('contain','InProgress')
            cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(rowNumber).should('contain','')
            cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(rowNumber).should('contain','')
            cy.get(ARILCActivityReportPage.getILCActivityReportClassAttended()).eq(rowNumber).should('contain','2')
        }
    })
}