import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { commonDetails, courseEvalQuestions } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import arCourseEvaluationReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { fieldValues } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('AR - Reports - Course Evaluation,Enroll learner and filter the data in Course Evaluation report ', function(){
    
    var i=0;
    let SearchData = [`${fieldValues.question_Order}`,`${courseEvalQuestions.defaultQuestions[1]}`,`${fieldValues.total_Response}`]; //test specific array
    let SearchDetails = [`Question Order`,`Question`, `Total Responses`];

    
    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function() {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
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

    it('Verify Course Evaluation Toggles, Fields, Questions and publish course', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course')

        //Set Enrollment Rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        AROCAddEditPage.getLShortWait()

        //Verify Course Evaluation can be enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEnableCourseEvalToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()

        //Verify Evaluation Required can be enabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAttributesModule.getEvalRequiredToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()

        //Verify Evaluation can be taken at anytime can be enabled
        cy.get(AROCAddEditPage.getCancelDisableBtn()).click()

        //Verify default questions are all present and in correct order
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).each(($span, i) => {
            expect($span.text()).to.equal(courseEvalQuestions.defaultQuestions[i])
        })

        //Verify editing a question
        cy.get(ARCourseSettingsAttributesModule.getQuestionName()).contains(courseEvalQuestions.defaultQuestions[0]).parents(ARCourseSettingsAttributesModule.getQuestionContainer())
            .within(() => {
                cy.get(AROCAddEditPage.getPencilBtn()).click()
                cy.get(ARCourseSettingsAttributesModule.getQuestionTxtF()).clear().type(courseEvalQuestions.newQuestion) //Edit question name
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDown()).click() //Edit question answer type
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDownOpt()).contains('Text').click()
                //Save changes
                cy.get(AROCAddEditPage.getCheckMarkBtn()).click()
            })


        //Verify adding a new question
        cy.get(ARCourseSettingsAttributesModule.getAddEvalQuestionsBtn()).click()
        cy.get(ARCourseSettingsAttributesModule.getQuestionNumber()).its('length').then((length) => {
            cy.get(ARCourseSettingsAttributesModule.getQuestionNumber()).eq(length-1).parents(ARCourseSettingsAttributesModule.getQuestionContainer())
            .within(() => {
                cy.get(ARCourseSettingsAttributesModule.getQuestionTxtF()).type(courseEvalQuestions.newQuestion2)
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDown()).click()
                cy.get(ARCourseSettingsAttributesModule.getQuestionTypeDDownOpt()).contains('Rating').click()
                cy.get(AROCAddEditPage.getCheckMarkBtn()).click()
            })
        })

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })
   
    it("Filter the course evaluation data in Course Evaluations Report ",()=>{

        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Evaluations'))
        
        arCourseEvaluationReportPage.coursePanelAddFilter(ocDetails.courseName)
        arCourseEvaluationReportPage.getLShortWait()
        for(i=0;i< SearchDetails.length;i++)
        {
        if(i< SearchDetails.length-1){
        //Filter and select question from drop down
        arCourseEvaluationReportPage.A5AddFilter(SearchDetails[i], 'Equals',SearchData[i])
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arCourseEvaluationReportPage.getRemoveBtn()).should('be.visible').click()
        }else if(i==SearchDetails.length-1){
        arCourseEvaluationReportPage.A5AddFilter(SearchDetails[i], 'Equals',SearchData[i])
        cy.get(arDashboardPage.getA5TableCellRecordByColumn(3+parseInt([i]))).contains(SearchData[i]).should('be.visible')
        cy.get(arCourseEvaluationReportPage.getRemoveBtn()).scrollIntoView()
        arCourseEvaluationReportPage.getRemoveBtn(courseEvalQuestions.defaultQuestions[1])
        cy.get(arCourseEvaluationReportPage.getRemoveBtn()).should('be.visible').click()
        }
       }
    })
})