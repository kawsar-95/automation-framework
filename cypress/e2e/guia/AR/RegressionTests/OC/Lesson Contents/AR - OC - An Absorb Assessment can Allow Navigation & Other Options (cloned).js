import AROCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARAddObjectLessonModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal";
import ARAddSurveyLessonModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARAddSurveyLessonModal";
import ARSelectLearningObjectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails";
import { lessonAssessment } from "../../../../../../../helpers/TestData/Courses/oc";
import { users } from "../../../../../../../helpers/TestData/users/users";

describe('C772 AUT-204, AR - OC - An Absorb Assessment can Allow Navigation & Other Options (cloned)', function () {
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
        
        // 3. enable the Show feedback toggle
        // The Show feedback toggle is off by default
        ARDashboardPage.generalToggleSwitch('false' , ARAddObjectLessonModal.getShowFeedbackToggleContainer())
        // The helper text appears correctly
        ARDashboardPage.AssertToggleDescriptionMessage(ARAddObjectLessonModal.getShowFeedbackToggleContainer(), ARAddObjectLessonModal.getShowFeedbackToggleMsg())
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getShowFeedbackToggleContainer())



        // 4. enable the Time Assessment toggle
        // The Time Assessment toggle is off by default
        ARDashboardPage.generalToggleSwitch('false' , ARAddObjectLessonModal.getIsExamTimedToggleContainer())
        // The helper text appears correctly
        ARDashboardPage.AssertToggleDescriptionMessage(ARAddObjectLessonModal.getIsExamTimedToggleContainer(), ARAddObjectLessonModal.getIsExamTimedToggleMsg())
        ARDashboardPage.generalToggleSwitch('true' , ARAddObjectLessonModal.getIsExamTimedToggleContainer())

        // 5. set the Maximum Time allowed field
        // The default value for the Maximum Time allowed field is 60
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).should('have.value', 60)
        // The field icon is Min(s)
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowedSymbol()).should('have.text', 'Min(s)')
        // Decimal numbers are either rounded up or down to the nearest whole number
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).clear().type(30.433).blur()
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).should('have.value', 30)
        // Zero is allowed
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).clear().type(0).blur()
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).should('have.value', 0)
        // negative numbers are not allowed
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).clear().type(-55).blur()
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowedErrorMsg()).should('contain', 'Field must be greater than or equal to 0.')
        // the field is not allowed to be blank
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).clear().blur()
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowedErrorMsg()).should('contain', 'Field is required.')
        // Characters are not allowed
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).clear().type('sdjfkldsfj').blur()
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowedErrorMsg()).should('contain', 'Field is required.')
        // Type valid value
        cy.get(ARAddObjectLessonModal.getMaximumTimeAllowed()).clear().type(30)

        // 6. enable the Single Page Layout toggle
        // The Single Page Layout toggle is off by default
        ARDashboardPage.generalToggleSwitch('false' , ARAddSurveyLessonModal.getSinglePageLayoutToggleContainer())
        // Single Page Layout toggle is off the Show Navigation toggle appears
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARAddSurveyLessonModal.getShowNavigationToggleContainer())).should('exist')
        // The helper text appears correctly
        ARDashboardPage.AssertToggleDescriptionMessage(ARAddSurveyLessonModal.getSinglePageLayoutToggleContainer(), ARAddObjectLessonModal.getSinglePageLayoutToggleMsg())
        ARDashboardPage.generalToggleSwitch('true' , ARAddSurveyLessonModal.getSinglePageLayoutToggleContainer())
        // When the Single Page Layout toggle is on the Show Navigation toggle is hidden
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARAddSurveyLessonModal.getShowNavigationToggleContainer())).should('not.exist')
        ARDashboardPage.generalToggleSwitch('false' , ARAddSurveyLessonModal.getSinglePageLayoutToggleContainer())

        // 7. enable the Show Navigation toggle
        // The Show Navigation toggle is off by default
        ARDashboardPage.generalToggleSwitch('false' , ARAddSurveyLessonModal.getShowNavigationToggleContainer())
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARAddSurveyLessonModal.getAllowNavigationToggleContainer())).should('not.exist')
        // The helper text appears correctly
        ARDashboardPage.AssertToggleDescriptionMessage(ARAddSurveyLessonModal.getShowNavigationToggleContainer(), ARAddObjectLessonModal.getShowNavigationToggleMsg())
        ARDashboardPage.generalToggleSwitch('true' , ARAddSurveyLessonModal.getShowNavigationToggleContainer())
        // When the Show Navigation toggle is on, the Allow Navigation toggle appears
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARAddSurveyLessonModal.getAllowNavigationToggleContainer())).should('exist')

        // 8. enable the Allow Navigation toggle
        // The Allow Navigation toggle is off by default
        ARDashboardPage.generalToggleSwitch('false' , ARAddSurveyLessonModal.getAllowNavigationToggleContainer())
        // The helper text appears correctly
        ARDashboardPage.AssertToggleDescriptionMessage(ARAddSurveyLessonModal.getAllowNavigationToggleContainer(), ARAddObjectLessonModal.getAllowNavigationToggleMsg())
        ARDashboardPage.generalToggleSwitch('true' , ARAddSurveyLessonModal.getAllowNavigationToggleContainer())

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