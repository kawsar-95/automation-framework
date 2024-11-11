import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage";
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal";
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import arQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage";
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage";
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage";
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule";
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage";
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { lessonAssessment, ocDetails } from "../../../../../../helpers/TestData/Courses/oc";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users"


let proctorCode ;
describe('C2062 - AUT-587 - GUIA-Story - NLE-2680 - Proctor Code - Learner Side', ()=>{

    it('Create Online Course with Learning Assesement with Questionnire and Proctor login enabled', () =>{ 
        //create a new learner
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //log into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //go to courses
        arDashboardPage.getCoursesReport()
        //create an online course
        cy.createCourse('Online Course', ocDetails.courseName)
        // Syllabus section is displaying
        cy.get(ARCBAddEditPage.getCouseSyllabusHeader() + ' ' + ARCBAddEditPage.getHeaderLabel()).should('have.text', 'Syllabus')
        //Enable Proctor in Administrator mode
        cy.get(AROCAddEditPage.getSyllabusProctorToggle()).should('exist')
        //Clicking on Syllabus Proctor Toggle
        cy.get(AROCAddEditPage.getSyllabusProctorToggle()).click()
        //Setting Proctor type as code
        cy.get(AROCAddEditPage.getGenaralRadioBtn()).contains('Code').click()
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        //Add learning object Assessment  
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        //Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
        //Add Grade to Pass
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(100)
        //Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        //Enable Max attempts and set to 3  
        cy.get(ARAddObjectLessonModal.getEnablemaxattempts()).click({force: true})
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(2)
        //Toggle on Allow Additional Attempts After Pass Toggle Btn
        cy.get(ARCoursesPage.getAllowAdditionalAttemptsAfterPassToggleBtn()).click()
        
        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        cy.get(arQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        cy.get(arQuestionBanksAddEditPage.getEnterQuestionBankName()).type("GUIA - CED - QBank")
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        arDashboardPage.getShortWait()
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBank()).contains("GUIA - CED - QBank").click()
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click()
        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click()        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click() 
        
        cy.get(arDashboardPage.getPageHeaderTitle()).should('contain','Add Online Course')
        arDashboardPage.getMediumWait()
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published') 
        //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username]) 
        //Navigate to Course Enrollments and get Proctor Code
       arDashboardPage.getCourseEnrollmentReport()
        //Clicking on Course Choose button
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)
        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click()
        // The Proctor Code column appears in the Additional Columns list.
        cy.get(arDashboardPage.getDisplayColumnItemByName('Proctor Code')).should('exist')
        // The Proctor Code column can be added to the Course Enrollments Report
        cy.get(arDashboardPage.getDisplayColumnItemByName('Proctor Code')).click()
        cy.get(arDashboardPage.getTableDisplayColumnBtn()).click({ force: true })
        // The Proctor Code column is added to the existing columns
        // The Column is called Proctor Code
        cy.get(arDashboardPage.getTableHeader()).should('contain', 'Proctor Code')
        cy.wrap(arDashboardPage.AddFilter('Is Enrolled', 'Yes'))
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        cy.get(ARAddObjectLessonModal.getTableGridCell()).last().invoke('text').then((text)=>{
        proctorCode = text;
        })
      
    })


    it('Verfiy the Proctor code is generated and the assessment can start successfully',()=>{
        //Login into the learner side
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //clicking on the side menu
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        //waiting for the start button to be ready
        cy.wrap(arDashboardPage.WaitForElementStateToChange(LECourseDetailsOCModule.getStartBtn()))
        //Asserting that button is clickable
        cy.get(LECourseDetailsOCModule.getStartBtn()).should('have.attr' , 'aria-disabled' , 'false')
        //Clicking the start button
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LECourseLessonPlayerPage.getVShortWait()
        //Details Toggle button should exists
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDetailsToggleBtn()).should('exist')
        //clicking on the button
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDetailsToggleBtn()).then(($toggleBtn)=>{
            if ($toggleBtn.children('div').hasClass(LECourseLessonPlayerPage.getDownArrowIconClass())) {
                cy.wrap($toggleBtn).click()
            }
        })
        //Asserting that button has been toggled down
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDetailsToggleBtn()).children('div').should('have.class' , LECourseLessonPlayerPage.getUpArrowIconClass())
        //Starting the Quiz
        cy.get(LEDashboardPage.getStartquizbutton()).contains("Start Quiz").click({force: true})
        //Asserting that Proctor Login modal has been appeared
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Proctor Login')
        //Typing worng data into code field 
        cy.get(LECourseLessonPlayerPage.getProctorCodeTextF()).should('be.visible').type('00000')
        //clicking into login button
        cy.get(LECourseLessonPlayerPage.getProctorLoginBtn()).should('be.visible').click()
        //Login errror message is shown 
        cy.get(LECourseLessonPlayerPage.getProctorErrorMessage()).should('be.visible').and('contain','The code entered is incorrect. Please try again.')
        //typing the correct proctor code
        cy.get(LECourseLessonPlayerPage.getProctorCodeTextF()).should('be.visible').clear().type(proctorCode)
        //cliking on the login button
        cy.get(LECourseLessonPlayerPage.getProctorLoginBtn()).should('be.visible').click()
        //
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()
        //Clicking on the modal close button
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        //Asserting leaving early prompt 
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(0).should('exist').and('contain','Leaving this lesson early will require a proctor to login again.')
        cy.get(LECourseLessonPlayerPage.getEalyLeavePromptModalMessage()).eq(1).should('exist').and('contain','Are you sure you want to leave?')
        cy.get(LECourseLessonPlayerPage.getCancelButton()).click()
        
    })

    after("clean up",()=>{
        cy.deleteCourse(commonDetails.courseID)
        //Login into learner side 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(arDashboardPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(arDashboardPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

  
})