import users from '../../../../../fixtures/users.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import { assessmentDetails } from '../../../../../../helpers/TestData/Courses/oc'
import arAssessmentsReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARAssessmentsReportPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'



describe('AR - Reports - Create Course with Assessment ,publish the course and filter the course data in Assessments report', function(){
    var i=0;
    
    let SearchData = [`${ocDetails.courseName}`,`${assessmentDetails.ocAssessmentName}`]; //test specific array
    let SearchDetails = [`Course Name`, `Assessment Name`,`Type`];
    
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
        
    })
    it('Create OC Course,  with Assessments object and publish course', () => { 

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        cy.createCourse('Online Course')

        //Verify Assessment Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).clear().type(assessmentDetails.ocAssessmentName)

        //Save the Assessment
        cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click()
        arOCAddEditPage.getLShortWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    it("Filter the course data in Assessments Report ",()=>{
    
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Assessments'))
        cy.intercept('/Admin/Assessments/GetAssessments').as('getAssessments').wait('@getAssessments')
        for(i=0;i<SearchDetails.length;i++)
        {
        if(i <SearchDetails.length-1){
        arAssessmentsReportPage.A5AddFilter(SearchDetails[i], 'Starts With',SearchData[i])
        arAssessmentsReportPage.getShortWait()
        cy.get(arAssessmentsReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arAssessmentsReportPage.getElementByTitleAttribute(arAssessmentsReportPage.getRemoveBtn())).click()
        }else if(i==SearchDetails.length-1)
        {
        arAssessmentsReportPage.TypeAddFilter(SearchDetails[i], 'Exam')
        arAssessmentsReportPage.getVShortWait()
        cy.get(arAssessmentsReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(assessmentDetails.ocAssessmentType).should('be.visible')
        cy.get(arAssessmentsReportPage.getElementByTitleAttribute(arAssessmentsReportPage.getRemoveBtn())).click()
         }
        } 
        arAssessmentsReportPage.A5AddFilter(SearchDetails[0], 'Starts With',SearchData[0])
        arAssessmentsReportPage.getLShortWait()
        arManageCategoriesPage.SelectManageCategoryRecord()
        //Assert Action Button levels
        arAssessmentsReportPage.getRightActionMenuLabel()
        //Select Summary Report Button 
        arAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick('Summary Report')
        cy.intercept('**/Admin/Assessments/GetQuestionsByAssessment').as('getQuestionsByAssessment').wait('@getQuestionsByAssessment')
        //Validate QauestionAssessment page header
        cy.get(arAssessmentsReportPage.getA5PageHeaderTitle()).should('have.text', "Questions Report")
        //Select back to assessments Button and come back to Assessment Page
        arAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick('Back to Assessments')
        cy.intercept('**/Admin/Assessments/SingleSelectionGridActionsMenu').as('getSingleSelectionGrid').wait('@getSingleSelectionGrid')
        //Click on Assessment Activity btn
        arAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick('Assessment Activity')
        //Validate Assessment Activity page header
        cy.get(arAssessmentsReportPage.getA5PageHeaderTitle()).should('have.text', "Assessment Activity")
        arAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick('Back to Assessments')
        cy.intercept('**/Admin/Assessments/SingleSelectionGridActionsMenu').as('getSingleSelectionGrid').wait('@getSingleSelectionGrid')

        //Click on Answers Report btn
        arAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick('Answers Report')
        cy.intercept('**/Admin/Assessments/GetAnswers').as('getAnswer').wait('@getAnswer')
        cy.get(arAssessmentsReportPage.getA5PageHeaderTitle(),{timeout:2000}).should('have.text', "Answers Report")
        arAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick('Back')
        arAssessmentsReportPage.getShortWait()
        //Click on Deselect btn
        arAssessmentsReportPage.getA5AddEditMenuActionsByNameThenClick('Deselect')

    })  
})