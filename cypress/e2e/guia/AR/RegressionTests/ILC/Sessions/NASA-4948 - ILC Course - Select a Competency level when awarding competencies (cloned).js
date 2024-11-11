import AdminNavationModuleModule from "../../../../../../../helpers/AR/modules/AdminNavationModule.module"
import ARCompetencyAddEditPage from "../../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARILCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARILCEditActivityPage from "../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage"
import ARAddMoreCourseSettingsModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREnrollUsersPage from "../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import ARUserTranscriptPage from "../../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import { competencyDetails } from "../../../../../../../helpers/TestData/Competency/competencyDetails"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../../helpers/TestData/Courses/ilc"
import { userDetails } from "../../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../../helpers/TestData/users/users"

let competencyName = competencyDetails.competencyName

describe('C940 - AUT-144 - NASA-4948 - Instructor Led Course - Select a Competency level under completion when awarding competencies (cloned).js',()=>{
    
    beforeEach('Login as admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    before("Create competency and learners", () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Competencies')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Verify that 
        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).clear().type(competencyName)
        // Competency name maybe curtailed in the textbox, so grab the real name in that case
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).invoke('val').as('competencyInputName')
        cy.get('@competencyInputName').then((name) => competencyName = name)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        // Save Competency
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
    })

    after('Delete users, course',()=>{
        // Delete test course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Delete test users
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
        
        // Delete the test competency
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Competencies')
      
        // Search and delete Competency
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        ARCompetencyPage.A5AddFilter('Name', 'Starts With', competencyName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        ARCompetencyPage.selectA5TableCellRecord(competencyName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        ARCompetencyPage.A5WaitForElementStateToChange(ARCompetencyPage.getA5AddEditMenuActionsByIndex(4))
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete')
    })

    it('Create ILC course with competency', () => {
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)

        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Add Competency btn
        cy.get(ARILCAddEditPage.getCompetenciesSec()).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyBtn(), {timeout:10000}).should('exist').click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencySecField(), {timeout:10000}).should('be.visible')

        // Competency field
        cy.get(ARILCAddEditPage.getCompetencySecDiv()).first().should('exist')

        // Level field
        cy.get(ARILCAddEditPage.getCompetencyLevelSec()).should('exist')

        // The Competency Field is required
        cy.get(ARILCAddEditPage.getCompetenciesSec()).first().within(() => {
            cy.get(ARILCAddEditPage.getCompetencyReqTitle()).should('contain',' (Required)')
        })

        // Click on choose btn
        cy.get(ARILCAddEditPage.getCompetenciesSec()).first().find(ARILCAddEditPage.getCompetencyForm()).first().within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyChoose(),{timeout:10000}).click({force:true})
        })

        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:10000}).should('exist')
        cy.get(ARILCAddEditPage.getCompetencyDDown()).within(() => {
            cy.get(ARILCAddEditPage.getCompetencyOptionItems()).contains(competencyName).click()
        })

        // Cempetency default list
        cy.get(ARILCAddEditPage.getCompetencyDefaultList()).should('exist')

        // The Level field is optional
        cy.get(ARILCAddEditPage.getCompetencyLevelSecTitle()).contains(' (Required)').should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
      
        // Enroll users to course
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username,userDetails.username2],ilcDetails.sessionName)
    })


    it('Award Compentecy to the first Learner', () => {
        ARDashboardPage.getUsersReport()
        cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'), {timeout:15000}).should('have.attr', 'aria-disabled', 'false').and('be.visible').click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARUserTranscriptPage.getCourseName()).contains(ilcDetails.courseName).click()
    
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCEditActivityPage.getSessionSectionContent(), {timeout: 30000}).should('exist')
        cy.get(ARUserTranscriptPage.getRadioBtn()).eq(1).contains('Completed').click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARUserTranscriptPage.getSaveBtn(), {timeout:10000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARUserTranscriptPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Course activity has been updated')
        cy.get(ARUserTranscriptPage.getCompetencies()).should('contain', competencyName)
    })

    it('Award Compentecy to the second Learner', () => {
        ARDashboardPage.getUsersReport()
        cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username2))
        cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username2))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript'),{timeout:10000}).should('have.attr', 'aria-disabled', 'false').and('be.visible').click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARUserTranscriptPage.getCourseName()).contains(ilcDetails.courseName).click()
    
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCEditActivityPage.getSessionSectionContent(), {timeout: 30000}).should('exist')
        cy.get(ARUserTranscriptPage.getRadioBtn()).eq(1).contains('Completed').click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARUserTranscriptPage.getSaveBtn(),{timeout:10000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARUserTranscriptPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Course activity has been updated')
        cy.get(ARUserTranscriptPage.getCompetencies()).should('contain',competencyName)
    })
})