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
import ARILCEditActivityPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage"
import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"


describe("AUT-702 - C7327 - ILC Sessions Report - Mark Attendance AR Form Regression", () => {
    let status;

    after('Delete the test user and course as part of clean-up', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
    })

    it.only('Scenario 1 Mark Attendance - Single Class', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)

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
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username,userDetails.username2],ilcDetails.sessionName)
    })

    it.only('Scenario 1 Mark Attendance', () => {
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

        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(2).click()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(4).dblclick()
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(5).click()
        cy.get(ARILCSessionReportPage.getMarkAttendanceInput()).eq(10).type(40)
        cy.get(ARILCSessionReportPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCSessionReportPage.getSectionHeader(), {timeout: 5000}).should('contain', 'ILC Sessions')
    })

    it.only('Scenario 1 Learner1 Transcript is correctly updated', () => {
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

        ARUserTranscriptPage.assertStatusAndScoreAndCredit({primaryStatus: null, secondaryStatus: null, finalCredits: '40'})
    })

    it.only('Scenario 1 Learner2 Transcript is correctly updated', () => {
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

        ARUserTranscriptPage.assertStatusAndScoreAndCredit({primaryStatus: null, secondaryStatus: null, finaStatus: null})
    })

    it('Scenario 1 ILC Sessions Report is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(10)).should('contain', 1)
        cy.get(ARILCSessionReportPage.getILCSessionReportGridRow(11)).should('contain', 1)
    })

    it('Scenario 1 Learner1 Edit Activity Page is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Activity"))
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
               
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity'), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCSessionReportPage.getEditActivityStatus()).invoke('text').then((text) => {
            status = text
            if(status == 'Complete'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value',100)
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value',40)
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','Complete')
            }else{
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value',0)
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','Absent')
            }
        })
    })

    it('Scenario 1 Learner2  Edit Activity Page is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Activity"))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        // Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
       
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)

        // Select Session
        ARDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity', {timeout:10000})).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        
        cy.get(ARILCSessionReportPage.getEditActivityStatus()).invoke('text').then((text) => {
            status = text
            if(status == 'Complete'){
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value',100)
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value',40)
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','Complete')
            }else{
                cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('not.exist')
                cy.get(ARDashboardPage.getNumF()).should('have.value',0)
                cy.get(ARILCSessionReportPage.getEditActivityCredit()).should('have.value','')
                cy.get(ARILCSessionReportPage.getEditActivityStatus()).should('contain','Absent')
            }
        })
    })

    it('Scenario 1 ILC Activity Report is correctly updated', () => {
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

        cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).invoke('text').then((text) => {
            status = text
            if(status == 'Absent'){
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','Absent')
                cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(0).should('contain','0')
                cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(0).should('contain','')
                cy.get(ARILCActivityReportPage.getILCActivityReportClassAttended()).eq(0).should('contain','0')
            }else{
                cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(1).should('contain','Complete')
                cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(1).should('contain','100')
                cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(1).should('contain','40')
                cy.get(ARILCActivityReportPage.getILCActivityReportClassAttended()).eq(1).should('contain','1')
            }
        })
    })

    it('Scenario 1 Mark Grades and Attendance Report is correctly updated', () => {
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

        cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,7)).invoke('text').then((text) => {
            status = text
            if(status == 100){
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,6)).should('contain','Absent')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,7)).should('contain','0')
                
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,6)).should('contain','Complete')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,7)).should('contain','100')
            }else{
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,6)).should('contain','Absent')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(2,7)).should('contain','0')
                
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,6)).should('contain','Complete')
                cy.get(ARILCSessionReportPage.getMarkGradeAttendanceReportRow(1,7)).should('contain','100')
            }
        })
    })

    it('Scenario 1 Course Enrollments Report is correctly updated', () => {
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

        ARILCActivityReportPage.assertEnrollmentStatusAndProgress(0, 'Complete', '100')
        ARILCActivityReportPage.assertEnrollmentStatusAndProgress(1, 'Absent', '0')
    })

    it('scenario 3 Mark Attendance - Mark All', () => {
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
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCEditActivityPage.getAttendanceToggleContainer()).eq(0).click()
        cy.get(ARILCSessionReportPage.getMarkAttendanceScoreParentInput()).clear().type(50)
        cy.get(ARILCSessionReportPage.getCreditTxtF()).clear().type(5)

        cy.get(ARBillboardsAddEditPage.getFileBrowserSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    })

    it('scenerio 3 Mark Attendance Form is correctly updated', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToILCActivityPage()        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(ilcDetails.courseName)  

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCActivityReportPage.getGridDisplayBtn(), {timeout:10000}).click({force:true})

        cy.get(ARILCActivityReportPage.getGridTableDisplayColumnSelect()).contains('Credits').click()

        cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(0).should('contain','Complete')
        cy.get(ARILCActivityReportPage.getILCReportStatus()).eq(1).should('contain','Complete')

        cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(0).should('contain','50')
        cy.get(ARILCActivityReportPage.getILCActivityReportScore()).eq(1).should('contain','50')

        cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(0).should('contain','5')
        cy.get(ARILCActivityReportPage.getILCActivityReportCredit()).eq(1).should('contain','5')
    })
})
