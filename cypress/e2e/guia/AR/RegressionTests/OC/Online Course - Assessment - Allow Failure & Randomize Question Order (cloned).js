import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { lessonAssessment, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-98 - GC882 - UIA-Story - NASA-3056 - Online Course - Assessment - Allow Failure & Randomize Question Order (cloned)', () => {

    after('Delete the online course created for the test', () => {
        cy.deleteCourse(commonDetails.courseID)
    })

    beforeEach('Login as a System Admnin and navigate to the Courses Report Page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Create an Online course, add assessment, allow failure, turn on randomize question and answer and save', () => {
        // Create an active Online course
        cy.createCourse('Online Course', ocDetails.courseName)
        // Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)

        // Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()

        // Turn ON Allow Failure toggle
        cy.get(ARAddObjectLessonModal.getAddassessmentModal()).within(()=>{
            ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getAllowFailureToggleContainer())
        })

        // Turn on Randomize Question Order toggle
        AROCAddEditPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeQuestionOrderToggleContainer())

        // Turn on Randomize Answer Order toggle
        AROCAddEditPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeAnswerOrderToggleContainer())

        // Turn on Show Answers toggle
        AROCAddEditPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getShowCorrectAnswerToUserToggleContainer())

        cy.get(ARAddObjectLessonModal.getandClickApplybutton(), {timeout: 3000}).click()
        ARDashboardPage.getShortWait()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')

        // Assert that the course has been saved along with the given settings
        cy.editCourse(ocDetails.courseName)          
        cy.get(AROCAddEditPage.getChapterTitle(), {timeout: 3000}).contains(ocDetails.defaultChapterName).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            cy.get(AROCAddEditPage.getEditLessonObjectBtn()).click()
        })
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()

        // Verify that the toggle states are persisted
        // Randomize Question Order Toggle
        cy.get(ARAddObjectLessonModal.getElementByDataNameAttribute(ARAddObjectLessonModal.getRandomizeQuestionOrderToggleContainer()) + ' ' + ARAddObjectLessonModal.getToggleStatus()).invoke('attr','aria-checked').then((status) => {
            expect(status).eq('true')
        })

        // Randomize Answer Order Toggle
        cy.get(ARAddObjectLessonModal.getElementByDataNameAttribute(ARAddObjectLessonModal.getShowCorrectAnswerToUserToggleContainer()) + ' ' + ARAddObjectLessonModal.getToggleStatus()).invoke('attr','aria-checked').then((status) => {
            expect(status).eq('true')
        })

        // Show correct answer Toggle
        cy.get(ARAddObjectLessonModal.getElementByDataNameAttribute(ARAddObjectLessonModal.getShowCorrectAnswerToUserToggleContainer()) + ' ' + ARAddObjectLessonModal.getToggleStatus()).invoke('attr','aria-checked').then((status) => {
            expect(status).eq('true')
        })
    })

    it('Create an Online course, allow retake after, turn on randomize question and answer and save', () => {
        // Create an active Online course
        cy.editCourse(ocDetails.courseName)

        cy.get(AROCAddEditPage.getChapterTitle(), {timeout: 3000}).contains(ocDetails.defaultChapterName).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            cy.get(AROCAddEditPage.getEditLessonObjectBtn()).click()
        })
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()

        // Select "Allow Retake After" and enter number of days
        ARAddObjectLessonModal.getSelectFailureTypeRadioButtonsByName('Allow Retake After:')
        cy.get(ARAddObjectLessonModal.getAllowRetakeAfterTextF()).clear().type(5)

        // Turn on Randomize Question Order toggle
        AROCAddEditPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeQuestionOrderToggleContainer())
        // Turn on Randomize Answer Order toggle
        AROCAddEditPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeAnswerOrderToggleContainer())
        // Turn on Show Answers toggle
        AROCAddEditPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getShowCorrectAnswerToUserToggleContainer())
        cy.get(ARAddObjectLessonModal.getandClickApplybutton(), {timeout: 3000}).click()

        cy.publishCourse()

        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
        ARCoursesPage.deselectAllGridRows()
        // Assert that the course has been saved along with the given settings
        cy.editCourse(ocDetails.courseName)          
        cy.get(AROCAddEditPage.getChapterTitle(), {timeout: 3000}).contains(ocDetails.defaultChapterName).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            cy.get(AROCAddEditPage.getEditLessonObjectBtn()).click()
        })
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()

        // Assert that the course has been saved along with the given settings
        cy.get(ARAddObjectLessonModal.getAllowRetakeAfterTextF()).invoke('val').then(value => {
            expect(value).eq('5')
        })
    })

    it('Create an Online course, turn off allow failure and save', () => {
        // Create an active Online course
        cy.editCourse(ocDetails.courseName)
        cy.get(AROCAddEditPage.getChapterTitle(), {timeout: 3000}).contains(ocDetails.defaultChapterName).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            cy.get(AROCAddEditPage.getEditLessonObjectBtn()).click()
        })

        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        // Toggle Allow Failure to OFF
        cy.get(ARAddObjectLessonModal.getAddassessmentModal()).within(()=>{
            ARDashboardPage.generalToggleSwitch('false' , ARAddObjectLessonModal.getAllowFailureToggleContainer())
        })
        // AROCAddEditPage.generalToggleSwitch('false', ARCourseSettingsCompletionModule.getAllowFailureToggleContainer())
        cy.get(ARAddObjectLessonModal.getandClickApplybutton(), {timeout: 3000}).click()
        cy.publishCourse()

        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 3000}).contains('Courses')
        ARCoursesPage.deselectAllGridRows()
       // Assert that the course has been saved along with the given settings
       cy.editCourse(ocDetails.courseName)          
       cy.get(AROCAddEditPage.getChapterTitle(), {timeout: 3000}).contains(ocDetails.defaultChapterName).parents(AROCAddEditPage.getChapterContainer()).within(() => {
           cy.get(AROCAddEditPage.getEditLessonObjectBtn()).click()
       })
       cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()

       cy.get(ARAddObjectLessonModal.getAddassessmentModal()).within(() => {
            cy.get(ARAddObjectLessonModal.getElementByDataNameAttribute(ARAddObjectLessonModal.getAllowFailureToggleContainer()) + ' ' + ARAddObjectLessonModal.getToggleStatus()).invoke('attr','aria-checked').then((status) => {
                expect(status).eq('false')
            })
        })
    })
})