/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails,courseActivity,credit} from '../../../../../../helpers/TestData/Courses/commonDetails'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arCourseActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'

describe('AR-Create OC Course, Upload Certificate, & Publish Course and filter the data in course activity report', function () {
    var i=0;
    let SearchData = [`${defaultTestData.USER_LEARNER_LNAME}`, `${defaultTestData.USER_LEARNER_FNAME}`,`${departments.dept_top_name}`,`${courseActivity.attainedCertificate}`,`${courseActivity.courseStatus}`,`${commonDetails.course_Score}`]; //test specific array
    let SearchDetails = [`Last Name`, `First Name`,`Department`,`Attained Certificate`,`Status`,`Score`];
    
   

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.wait(2000)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wait(2000)
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Create OC Course, Upload Certificate, & Publish Course', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course')
         
        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Select Allow Enrollment All learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        AROCAddEditPage.getMediumWait() //Wait for toggles to become enabled
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')

        //Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute('image-preview')).eq(0).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute('media-library-apply')).click()
        arDashboardPage.getLongWait()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()

        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Course Enrollments")
        arManageCategoriesPage.SelectManageCategoryRecord()

        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()

        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))
        cy.get(AREditActivityPage.getScoreEnrollmentTxtF()).type(commonDetails.course_Score)
        cy.get(AREditActivityPage.getCreditEnrollmentTxtF()).type(credit.credit2)

        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        AREditActivityPage.getLongWait()
    })

    it("Filter the course data in Course activity report",()=>{
        
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Activity'))
        //Filter and select above course
        arCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)

        for(i=0;i<SearchData.length;i++)
        {
            if(i<SearchData.length-4){
            //Filter and validate the data for last and first name 
            arCourseActivityReportPage.AddFilter(SearchDetails[i], 'Starts With',SearchData[i] )        
            cy.get(arCourseActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseActivityReportPage.getRemoveAllBtn()).click()
            }else if(i==SearchData.length-4){
            //Filter and validate the data for dept 
            arCourseActivityReportPage.AddFilter(SearchDetails[i], 'Is Only',SearchData[i] )        
            cy.get(arCourseActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseActivityReportPage.getRemoveAllBtn()).click()
            }else if(i==SearchData.length-3){
            //Filter and validate the data for Attained Certificate 
            arCourseActivityReportPage.AddFilter(SearchDetails[i], 'Yes',null )        
            cy.get(arCourseActivityReportPage.getA5TableCellRecordByColumn(3+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseActivityReportPage.getRemoveAllBtn()).click()
            }else if(i==SearchData.length-2){
            //Filter and validate the data for Course status
            arCourseActivityReportPage.AddFilter(SearchDetails[i], 'Complete',null )        
            cy.get(arCourseActivityReportPage.getA5TableCellRecordByColumn(4+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseActivityReportPage.getRemoveAllBtn()).click()
            }else if(i==SearchData.length-1){
            arCourseActivityReportPage.AddFilter(SearchDetails[i], 'Equals',SearchData[i] ) 
            arCourseActivityReportPage.getTableColumnAndScrollIntoView()    
            cy.get(arCourseActivityReportPage.getA5TableCellRecordByColumn(4+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseActivityReportPage.getRemoveAllBtn()).click()
            }
        }
    })
})