import AROCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARAddObjectLessonModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal";
import ARSelectLearningObjectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails";
import { lessonAssessment, ocDetails } from "../../../../../../../helpers/TestData/Courses/oc";
import { users } from "../../../../../../../helpers/TestData/users/users";

describe('C770 AUT-202, AR - OC - Assessment - Allow Failure & Randomize Question Order (cloned)', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Online Courses with Learning Assesement', () =>{
        cy.createCourse('Online Course')

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        // Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        
        // Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)

        // Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        
        // turning on Allow Failure toggle
        cy.get(ARAddObjectLessonModal.getAddassessmentModal()).within(()=>{
            ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getAllowFailureToggleContainer())
        })

        // Turn on Randomize Question Order toggle
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeQuestionOrderToggleContainer())

        // Turn on Randomize Answer Order toggle
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeAnswerOrderToggleContainer())

        // Turn on Show Answers toggle
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getShowCorrectAnswerToUserToggleContainer())

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
    })

    it('Edit Online Courses', () =>{
        cy.editCourse(ocDetails.courseName)

        // Verify lesson object and edit lesson object
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessonAssessment.ocAssessmentName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonAssessment.ocAssessmentName)

        // Expand options dropdown under Assessment
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        
        // turning on Allow Failure toggle
        cy.get(ARAddObjectLessonModal.getAddassessmentModal()).within(()=>{
            ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getAllowFailureToggleContainer())
        })

        // Select "Allow Retake After" and enter number of days
        ARAddObjectLessonModal.getSelectFailureTypeRadioButtonsByName ('Allow Retake After:')
        cy.get(ARAddObjectLessonModal.getAllowRetakeAfterTextF()).type(5)

        // Turn on Randomize Question Order toggle
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeQuestionOrderToggleContainer())

        // Turn on Randomize Answer Order toggle
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getRandomizeAnswerOrderToggleContainer())

        // Turn on Show Answers toggle
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getShowCorrectAnswerToUserToggleContainer())

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
    })
    
    it('Edit Online Courses', () =>{
        cy.editCourse(ocDetails.courseName)

        // Verify lesson object and edit lesson object
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessonAssessment.ocAssessmentName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonAssessment.ocAssessmentName)

        // Expand options dropdown under Assessment
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        
        // turning off Allow Failure toggle
        cy.get(ARAddObjectLessonModal.getAddassessmentModal()).within(()=>{
            ARDashboardPage.generalToggleSwitch('false' , ARAddObjectLessonModal.getAllowFailureToggleContainer())
        })

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
    })
})