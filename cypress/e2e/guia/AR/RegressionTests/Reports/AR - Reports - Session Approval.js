import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions ,enrollment } from '../../../../../../helpers/TestData/Courses/ilc'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails} from '../../../../../../helpers/TestData/Courses/commonDetails'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arLearnerCompetenciesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerCompetenciesReportPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import arSessionApprovalReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARSessionApprovalReportPage'
import { venues } from '../../../../../../helpers/TestData/Venue/venueDetails'


describe('AR - Reports - Add Session - Create Course and Filter the data on Session Approval Report', function(){

     var i=0;
     let SearchData = [`${users.sysAdmin.admin_sys_01_lname}`,`${users.sysAdmin.admin_sys_01_fname}`,`${ilcDetails.courseName}`,`${sessions.sessionName_1}`,`${departments.dept_top_name}`]; //test specific array
     let SearchDetails = [`Last Name`,`First Name`,`Course Title`,`Session Title`,`Department`];

     
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

    })
     after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })
    it('Create Course and add session & Publish course', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        cy.createCourse('Instructor Led',ilcDetails.courseName, false)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
     
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click({timeout:5000})
        //Set Valid Title
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_1)
        ARILCAddEditPage.getFutureDate(2)
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate("2024-10-12")
        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        
        cy.get(ARILCAddEditPage.getApprovalTypeRadioBtn()).contains(enrollment.approvalTypes[1]).click()
        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

       //Publish Course
       cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = (id.request.url.slice(-36));
    })  
    })
    it('Enroll in course and Session by the learner side ', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        //Enroll learner in course
       LEFilterMenu.getSearchAndEnrollInCourseByName(ilcDetails.courseName)
       LEFilterMenu.getShortWait()
       LEFilterMenu.getCourseCardBtnThenClick(ilcDetails.courseName)
       LEDashboardPage.getMediumWait()
        //Enroll learner in session
        LEDashboardPage.getCourseSessionEnrollBtnThenClick(sessions.sessionName_1)
        LEDashboardPage.getLongWait()
   })

   it("Filter the saved course data in Session Approval Report ",()=>{
    
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Session Approvals'))
    cy.intercept('**/Admin/SessionApprovals/GetSessionApprovals').as('getSessionApproval').wait('@getSessionApproval')
    
    for(i=0;i< SearchDetails.length;i++){
        if(i< SearchDetails.length-1){
        //Filter and validate last name ,first name,course title ,Session title    
        arSessionApprovalReportPage.A5AddFilter(SearchDetails[i], 'Contains',SearchData[i])
        arSessionApprovalReportPage.getLShortWait()
        cy.get(arSessionApprovalReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arSessionApprovalReportPage.getElementByTitleAttribute(arSessionApprovalReportPage.getRemoveBtn())).scrollIntoView()
        cy.get(arSessionApprovalReportPage.getElementByTitleAttribute(arSessionApprovalReportPage.getRemoveBtn())).should('be.visible').click()
        }else if(i==SearchDetails.length-1){
        //Filter and validate dept data 
        arLearnerCompetenciesReportPage.DeptAddFilter(SearchDetails[i], 'Is Only',SearchData[i])
        arLearnerCompetenciesReportPage.getLShortWait()
        cy.get(arSessionApprovalReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).should('contain',SearchData[i])
        arSessionApprovalReportPage.getLShortWait()
        arManageCategoriesPage.SelectManageCategoryRecord()
        }
      }
      //validate action btn levels
      arSessionApprovalReportPage.getRightActionMenuLabel()
    })

})