import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { ilcDetails, enrollment } from '../../../../../../helpers/TestData/Courses/ilc'
import arCourseApprovalReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseApprovalReportPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import arLearnerCompetenciesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerCompetenciesReportPage'


describe('AR - Reports - Create Course with Enrollment Rules and Filter the data in Course approval report', function(){

    var i=0;
    let SearchData = [`${users.sysAdmin.admin_sys_01_lname}`,`${users.sysAdmin.admin_sys_01_fname}`,`${ilcDetails.courseName}`,`${departments.dept_top_name}`]; //test specific array
    let SearchDetails = [`Last Name`,`First Name`,`Course Title`,`Department`];

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Enrollment & Approval Rules Radio Buttons and Fields, & Publish ILC Course', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led')

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow All Learners Enrollment All Learners Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Select Other for Account Approval
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalRadioBtn()).contains('Other').click().click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalDDown()).click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalSearchTxt()).type(enrollment.approvalAccount)
        ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOpt(enrollment.approvalAccount)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    it('Enroll in course and Session by the learner side ', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        //Enroll learner in course
        LEFilterMenu.getSearchAndEnrollInCourseByName(ilcDetails.courseName)
    })
    it("Filter the saved course data in Session Approval Report ",()=>{
       
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Approvals'))
        cy.intercept('/Admin/CourseApprovals/GetCourseApprovals').as('getCourseApproval').wait('@getCourseApproval')
        
        for(i=0;i< SearchDetails.length;i++){
            if(i< SearchDetails.length-1){
            //Filter and validate last name ,first name,course title    
            arCourseApprovalReportPage.A5AddFilter(SearchDetails[i], 'Contains',SearchData[i])
            cy.get(arCourseApprovalReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCourseApprovalReportPage.getElementByTitleAttribute(arCourseApprovalReportPage.getRemoveBtn())).should('be.visible').click()
            }else if(i==SearchDetails.length-1){
            //Filter and validate dept. data 
            arLearnerCompetenciesReportPage.DeptAddFilter(SearchDetails[i], 'Is Only',SearchData[i])
            cy.get(arCourseApprovalReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).should('contain',SearchData[i])
            arCourseApprovalReportPage.getShortWait()
            arManageCategoriesPage.SelectManageCategoryRecord()
            }
          }
          //validate action btn levels
          arCourseApprovalReportPage.getRightActionMenuLabel()
        })
    
})