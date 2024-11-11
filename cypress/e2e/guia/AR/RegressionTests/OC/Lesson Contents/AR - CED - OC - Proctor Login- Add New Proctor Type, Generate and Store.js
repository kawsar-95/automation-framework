import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARQuestionBanksPage from '../../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage'
import arQuestionBanksAddEditPage from '../../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import A5GlobalResourceAddEditPage from '../../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEResourcesPage from '../../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARUploadInstructionsModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { qbDetails } from '../../../../../../../helpers/TestData/QuestionBank/questionBanksDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { lessonAssessment } from '../../../../../../../helpers/TestData/Courses/oc'
import { ocDetails } from '../../../../../../../helpers/TestData/Courses/oc'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECourseLessonPlayerPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import ARCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARCourseActivityReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage'
import ARCourseEnrollmentReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage'
import ARCBAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'

let proctorCode;

describe('C7307 - AUT691  - NASA-7210 - Code Proctoring - Add New Proctor Type, Generate and Store ', function () {

    it('Create Online Course with Learning Assesement with Questionnire and Proctor login enabled', () => {
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
        cy.get(ARAddObjectLessonModal.getEnablemaxattempts()).click({ force: true })
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(2)
        //Toggle on Allow Additional Attempts After Pass Toggle Btn
        cy.get(ARCoursesPage.getAllowAdditionalAttemptsAfterPassToggleBtn()).click()

        //Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        cy.get(arQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arQuestionBanksAddEditPage.getEnterQuestionBankName()).type("GUIA - CED - QBank")
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        arDashboardPage.getShortWait()
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBank()).contains("GUIA - CED - QBank").click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click()

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click()

        cy.get(arDashboardPage.getPageHeaderTitle()).should('contain', 'Add Online Course')
        arDashboardPage.getMediumWait()
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')
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
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARAddObjectLessonModal.getTableGridCell()).last().invoke('text').then((text) => {
            proctorCode = text;
        })

    })


    it('Verfiy the Proctor code is generated and the assessment can start successfully', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist', { timeout: 10000 })

        cy.wrap(arDashboardPage.WaitForElementStateToChange(LECourseDetailsOCModule.getStartBtn()))
        cy.get(LECourseDetailsOCModule.getStartBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist')
        //Details Toggle button should exists
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDetailsToggleBtn()).should('exist')
        //clicking on the button
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDetailsToggleBtn()).then(($toggleBtn) => {
            if ($toggleBtn.children('div').hasClass(LECourseLessonPlayerPage.getDownArrowIconClass())) {
                cy.wrap($toggleBtn).click()
            }
        })
        //Asserting that button has been toggled down
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDetailsToggleBtn()).children('div').should('have.class', LECourseLessonPlayerPage.getUpArrowIconClass())
        cy.get(LEDashboardPage.getStartquizbutton()).contains("Start Quiz").click({ force: true })

        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist')
        cy.get(LECourseLessonPlayerPage.getProctorCodeTextF()).should('be.visible').type(proctorCode)
        cy.get(LECourseLessonPlayerPage.getProctorLoginBtn()).should('be.visible').click()

        LEDashboardPage.getShortWait()
        cy.frameLoaded(LEDashboardPage.getQUIZiFrame())
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getTypeAnswerInput()).type("answer")
        cy.iframe(LEDashboardPage.getQUIZiFrame()).should('be.visible').find(LEDashboardPage.getSubmitAnswer()).contains("Submit Response").click()

        cy.get(LECoursesPage.getModalCloseBtn()).click()

    })

    it('Re-enroll the user and check proctor code is changed', () => {
    
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
        arEnrollUsersPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(userDetails.username).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments')))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(ocDetails.courseName).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Re-enroll User')))
        cy.get(arUserPage.getAddEditMenuActionsByName('Re-enroll User')).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click()

        //Navigate to Course Enrollments and get Proctor Code
        arDashboardPage.getCourseEnrollmentReport()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARCourseEnrollmentReportPage.getPageHeader()).should('have.text', 'Course Enrollments')
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
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARAddObjectLessonModal.getTableGridCell()).last().invoke('text').should('not.eq', proctorCode)

    })

    it('Un-enroll the user and check proctor code is changed', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
        arEnrollUsersPage.AddFilter('Username', 'Equals', userDetails.username)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(userDetails.username).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments')))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellRecord()).contains(ocDetails.courseName).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Un-enroll User')))
        cy.get(arUserPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        
        cy.get(ARPublishModal.getContinueBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Navigate to the Users page and enroll the user again
        arDashboardPage.getCoursesReport()
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
       
        //Navigate to Course Enrollments and get Proctor Code
        arDashboardPage.getCourseEnrollmentReport()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARCourseEnrollmentReportPage.getPageHeader()).should('have.text', 'Course Enrollments')
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
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARAddObjectLessonModal.getTableGridCell()).last().invoke('text').should('not.eq', proctorCode)
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