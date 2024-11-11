import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAvailabilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AROCAddEditPage, { coursePageMessages } from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe("C4945 - Default view of All Sections in add Online course form", () => {

    

    beforeEach('Login as an Admin user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it("Verify Add New Online Course page has default view of options", () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        //clicking on courses
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        // Click On Add Online Course Btn
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Online Course')).click()
        ARDashboardPage.getVLongWait()

        // General section is displaying
        cy.get(ARCBAddEditPage.getCouseGeneralHeader() + ' ' + ARCBAddEditPage.getHeaderLabel()).should('have.text', 'General')
        //  General Status is Inactive
        cy.get(ARCBAddEditPage.getGeneralStatusToggleContainer() + ARCBAddEditPage.getToggleDisabled()).should('have.text', "Inactive")
        // General Status text field
        cy.get(ARCBAddEditPage.getGeneralStatusToggleContainer() + AROCAddEditPage.getGeneralStatusText()).should("have.text", coursePageMessages.INACTIVE_COURSE_VISIBILITY_WARNING)

        // General Title (Required) is written in Red
        cy.get(AROCAddEditPage.getTitleRequired()).should('contain', 'Title (Required)')
        cy.get(AROCAddEditPage.getRequiredInRedColor()).should('have.css', 'color', 'rgb(214, 20, 52)')
        // "Course Name" is pre-written in Title field
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).should('have.value', 'Course Name')
        ARDashboardPage.getShortWait()

        // All fields in general section : Status, Title (Required), Description, Language, Tags, Automatic Tagging
        cy.get(AROCAddEditPage.getGeneralLabels()).children().should(($child) => {
            expect($child).to.contain('Status')
            expect($child).to.contain('Title (Required)')
            expect($child).to.contain('Description')
            expect($child).to.contain('Language')
            expect($child).to.contain('Tags')
            expect($child).to.contain('Automatic Tagging')
        })

        ARDashboardPage.getShortWait()
        // Automatic tagging is ON by default
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')
        // General Automatic Tagging text field
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', coursePageMessages.AUTO_GENERATED_TAG_MESSAGE)

        // Syllabus section is displaying
        cy.get(ARCBAddEditPage.getCouseSyllabusHeader() + ' ' + ARCBAddEditPage.getHeaderLabel()).should('have.text', 'Syllabus')
        // "All lessons, in any order" radio button displaying selected by default
        cy.get(AROCAddEditPage.getSyllabusRadioButtonLabel()).contains('All lessons, in any order').parent().find('input').should('be.checked')

        // verify Show term & Condition toggle status and description
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCoursesPage.getShowTermAndCondition()) + ' ' + ARCoursesPage.getDisableToggleStatus()).should('have.text', 'Off')
        cy.get(ARCBAddEditPage.getShowTermAndConditionToggle() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', coursePageMessages.ACCEPT_TEMRS_N_CONDITION_MESSAGE)

        // verify Mobile Device Alert toggle status and description
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCoursesPage.getMobileDeviceAlert()) + ' ' + ARCoursesPage.getDisableToggleStatus()).should('have.text', 'Off')
        cy.get(ARCBAddEditPage.getShowTermAndConditionToggle() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', coursePageMessages.ACCEPT_TEMRS_N_CONDITION_MESSAGE)

        // verify Proctor toggle status and description
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCoursesPage.getProctor()) + ' ' + ARCoursesPage.getDisableToggleStatus()).should('have.text', 'Off')
        cy.get(ARCBAddEditPage.getProctorToggle() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', coursePageMessages.PROCTOR_TOGGLE_STATUS_MESSAGE)

        // verify Outline chapter Name
        cy.get(AROCAddEditPage.getChapterNameRequired()).should('contain', 'Chapter Name (Required)')
        cy.get(AROCAddEditPage.getRequiredInRedColorForChapter()).should('have.css', 'color', 'rgb(214, 20, 52)')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCoursesPage.getChapterName()) + ' ' + ARCoursesPage.getChapterNameStatus()).should('have.value', 'Chapter 1')
        cy.get(ARCBAddEditPage.getChapterName() + ' ' + ARCBAddEditPage.getChapterNameToggleText()).should('have.text', "No learning objects have been added.")

        // Add learning object check
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).within(() => {
            cy.get(AROCAddEditPage.getActionBtnByLabel()).should('have.text', "Add Learning Object")
            cy.get(AROCAddEditPage.getPlusIcon()).should('exist')
        })

        // Add chapter check
        cy.get(AROCAddEditPage.getAddChapterBtn()).should('exist')

        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        // Select Allow Self Enrollment off Radio Button
        ARCourseSettingsEnrollmentRulesModule.getDefaultAllowSelfEnrollmentRadioBtn('Off')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentToggleInfo()

        // Select Enable Automatic Enrollment off Radio Button
        ARCourseSettingsEnrollmentRulesModule.getDefaultEnableAutomaticEnrollmentRadioBtn('Off')
        ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentToggleInfo()

        // Select Approval none Radio Button   
        ARCourseSettingsEnrollmentRulesModule.getNoneApprovalRadioBtn('None')
        ARCourseSettingsEnrollmentRulesModule.getApprovalToggleInfo()

        // Verify Enable E-Commerce toggle and get toggle info
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCoursesPage.getEnableECommerceLabel()) + ' ' + ARCoursesPage.getDisableToggleStatus())
            .should('have.text', 'Off')
        cy.get(AROCAddEditPage.getEcommerceDescriptionField() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', "Turning this option 'on' will make this course available for purchase through the shopping cart.")


        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        // Toggle Certificate Button
        ARCourseSettingsCompletionModule.getToggleByNameAndVerify('Certificate')
        // Certificate Toggle text data verification
        ARCourseSettingsCompletionModule.getToggleByNameAndVerifyToggleStatus('Certificate')

        // Toggle Allow Re-enrollment Button
        ARCourseSettingsCompletionModule.getToggleByNameAndVerify('Allow Re-enrollment')
        // Certificate Toggle text data verification
        ARCourseSettingsCompletionModule.getToggleByNameAndVerifyAllowReEnrollment('Allow Re-enrollment')

        // Choose Competency For Completion and verify toggle
        cy.get(ARCBAddEditPage.getCompetenciesToggleText() + ARCBAddEditPage.getCompetenciesToggleText() + ' ' + ARCBAddEditPage.getCompetenciesToggledescriiption()).should('have.text', "This course grants no competencies.")
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).within(() => {
            cy.get(AROCAddEditPage.getActionBtnByLabel()).should('have.text', 'Add Competency')
            cy.get(AROCAddEditPage.getPlusIcon()).should('exist')
        })


        // Choose Credit for completion and verify toggle 
        cy.get(ARCBAddEditPage.getCreditToggle() + ' ' + ARCBAddEditPage.getCreditToggleText()).should('have.text', "This course will award no credits on completion.")
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtnClass()).within(() => {
            cy.get(AROCAddEditPage.getActionBtnByLabel()).should('have.text', 'Add Credit')
            cy.get(AROCAddEditPage.getPlusIcon()).should('exist')
        })


        // Allow failure toggle button and text verification
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCoursesPage.getAllowFailureToggleBtn()) + ' ' + ARCoursesPage.getDisableToggleStatus())
            .should('have.text', 'Off')
        cy.get(ARCBAddEditPage.getAllowFailureText() + ' ' + ARCBAddEditPage.getAllowFailureToggleText()).should('have.text', coursePageMessages.FAILURE_TOGGLE_WARNNG_MESSAGE)

        // LeaderBoardPoint toggle validation
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).should('have.value', '')
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsSymbol()).should("exist")
        cy.get(ARCBAddEditPage.getLeaderboardPointToggleTxt() + ' ' + ARCBAddEditPage.getLeaderboardPointsToggleText()).should('have.text', "Override the default point value")

        // Choose Credit for completion and verify toggle 
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentButton()).within(() => {
            cy.get(AROCAddEditPage.getActionBtnByLabel()).should('have.text', 'Add Post Enrollment')
            cy.get(AROCAddEditPage.getPlusIcon()).should('exist')
        })
        cy.get(ARCBAddEditPage.getPostEnrollmentToggle() + ' ' + ARCBAddEditPage.getPostEnrollmentToggleText()).should('have.text', "This course has no post enrollment triggers.")

        // Open Availability Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()

        // Select Access Date 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains('No Access Date').parent().find('input').should('be.checked')

        // Select Expiration 'Time from enrollment' Option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('No Expiration').parent().find('input').should('be.checked')

        // Select Due Date 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateRadioBtn()).contains('No Due Date').parent().find('input').should('be.checked')

        // Validate Allow course content download toggle 
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleDisabled())
            .should("have.text", "Off")
        // Assert Allow course Content Download 
        cy.get(ARCourseSettingsAvailabilityModule.getAllowCourseContentToggleDescription()).should('have.text', 'Allows users to download and complete this course while offline.')

        // Assert Allow Enrollment Description When Toggle is OFF
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        cy.get(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleDescription())
            .should('contain', 'Learners will not be able to enroll in this course until all prerequisites are met.')

        // Verify Add prerequisite button text and toggle description
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).within(() => {
            cy.get(AROCAddEditPage.getActionBtnByLabel()).should('have.text', 'Add Prerequisite')
            cy.get(AROCAddEditPage.getPlusIcon()).should('exist')
        })
        cy.get(ARCourseSettingsAvailabilityModule.getNoPrerequisitesContainerDescription()).should('have.text', 'This course has no prerequisites.')

        // Open Catalog Visibility Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCBAddEditPage.getCatalogVisibilityVerification()).should('have.text', 'Catalog Visibility')
    })
})