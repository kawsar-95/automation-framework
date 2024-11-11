import users from '../../../../../fixtures/users.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import { taskDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { credit} from '../../../../../../helpers/TestData/Courses/commonDetails'
import AREditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arTaskReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARTaskReportPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCourseEvaluationReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage'

describe('AR -Reports - Create Course with Task ,publish course and filter the course data in Task report', function(){
    var i=0;
    
    let SearchData = [`${taskDetails.ocTaskName}`,`${ocDetails.courseName}`,`${userDetails.username}`,`${credit.credit2}`]; //test specific array
    let SearchDetails = [`Task`, `Course Name`,`Username`,`Credits`];
    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
       // Delete user
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), 1000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
    it('Create OC Course,  with Task object and publish course', () => { 

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course')
        
        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arAddMoreCourseSettingsModule.getShortWait()

       //Select 'All Learners' For Self Enrollment Rule
       ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Verify Task Object Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Task')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).clear().type(taskDetails.ocTaskName)

        //Save the Task
        cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click()
        arOCAddEditPage.getLShortWait()

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    it('should enroll a learner to an Online Course', function() {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        //Enroll Leaner in already created course
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        cy.wait(2000)
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/course-enrollments/operations').as('getCourseEnrollment').wait('@getCourseEnrollment')
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Course Enrollments")
    
        arCoursesPage.AddFilter(`Username`,`Equals`,userDetails.username)
        arManageCategoriesPage.SelectManageCategoryRecord()

        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        cy.intercept('/api/rest/v2/admin/reports/online-course-activities/operations').as('getEditEnrollment').wait('@getEditEnrollment')
        

        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))

        cy.get(AREditActivityPage.getCreditEnrollmentTxtF()).type(credit.credit2)
        cy.wrap(AREditActivityPage.WaitForElementStateToChange(AREditActivityPage.getSaveBtn()), 1000)
        cy.get(AREditActivityPage.getSaveBtn()).click()
        AREditActivityPage.getLongWait()
       })
       it("Filter the saved course data in Task Report ",()=>{

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Task'))
        //Choose the Course from the Drop Down
        arCourseEvaluationReportPage.coursePanelAddFilter(ocDetails.courseName)
        

        for(i=0;i< SearchDetails.length;i++){
            if(i< SearchDetails.length-1){
            //Filter the data for Task,Course Name,User Name    
            arTaskReportPage.A5AddFilter(SearchDetails[i], 'Contains',SearchData[i])
            cy.get(arTaskReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arTaskReportPage.getElementByTitleAttribute(arTaskReportPage.getRemoveBtn())).should('be.visible').click()
            }else if(i== SearchDetails.length-1){
            arTaskReportPage.A5AddFilter(SearchDetails[i], 'Equals',SearchData[i])
            cy.get(arTaskReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arTaskReportPage.getElementByTitleAttribute(arTaskReportPage.getRemoveBtn())).should('be.visible').click()
            }

        }
        arTaskReportPage.A5AddFilter(SearchDetails[0], 'Contains',SearchData[0])
        arTaskReportPage.getShortWait()
        cy.get(arTaskReportPage.getA5TableCellRecordByColumn(2+parseInt([0]))).contains(SearchData[0]).click()
        //Validate Action Btn Levels
        arTaskReportPage.getRightActionMenuLabel()
        //Click on Deselect btn
        arTaskReportPage.getA5AddEditMenuActionsByNameThenClick('Deselect')
       })
})