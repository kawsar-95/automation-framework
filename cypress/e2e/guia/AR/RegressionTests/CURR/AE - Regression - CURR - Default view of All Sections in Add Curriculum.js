import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage, { bundleCourseDefaults } from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARCURRAddEditPage, { CurrPageLableMessages } from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import AROCAddEditPage, { coursePageMessages } from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARCourseSettingsMessagesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMessages.module'
import { messages } from '../../../../../../helpers/TestData/Courses/ilc'
import ARCourseSettingsResourcesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsResources.module'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import ARCourseSettingsMoreModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMore.module'





describe('C4952 - AUT-65 -  AE Regression - Curriculum - Default view of All Sections in Add Curriculum.', () => {
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.get(ARCoursesPage.getAddCurriculaBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('contain', 'Add Curriculum')
    })

    it(`Verify the default view of the General Section in the "Add Curriculum" form`, () => {
        // General section is displaying
        cy.get(ARCURRAddEditPage.getGeneralSectionTitle()).should('have.text', bundleCourseDefaults.General)
        ARDashboardPage.AssertToggleMessage(ARCBAddEditPage.getGeneralStatusToggleContainer(), bundleCourseDefaults.Inactive)
        // General Status text field
        ARDashboardPage.AssertToggleDescriptionMessage(ARCBAddEditPage.getGeneralStatusToggleContainer(), coursePageMessages.INACTIVE_COURSE_VISIBILITY_WARNING)

        // General Title (Required) is written in Red (or near red)
        cy.get(ARCURRAddEditPage.getGeneralTitle()).should('contain', CurrPageLableMessages.nameRequired)
        cy.get(AROCAddEditPage.getRequiredInRedColor()).should('have.css', 'color', 'rgb(214, 20, 52)')
        // "Course Name" is pre-written in Title field
        cy.get(ARCURRAddEditPage.getGeneralNameTxtF()).should('have.value', bundleCourseDefaults.CourseName)

        // General all fields
        ARCURRAddEditPage.getGeneralAllFields()
        // Automatic tagging is ON by default
        ARDashboardPage.AssertToggleMessage(ARCBAddEditPage.getAutomaticTaggingToggle(), 'On')
        //General Automatic Tagging text field
        ARDashboardPage.AssertToggleDescriptionMessage(ARCBAddEditPage.getAutomaticTaggingToggle(), coursePageMessages.AUTO_GENERATED_TAG_MESSAGE)

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Courses')).click()
        //Validate Show term & Condition toggle status and description
        ARDashboardPage.AssertToggleMessage(AROCAddEditPage.getElementByDataNameAttribute(ARCoursesPage.getShowTermAndCondition()), 'Off')
        ARDashboardPage.AssertToggleDescriptionMessage(ARCBAddEditPage.getShowTermAndConditionToggle(), coursePageMessages.ACCEPT_TEMRS_N_CONDITION_MESSAGE)

        //Validate pace progress toggle status and description
        ARDashboardPage.AssertToggleMessage(ARCURRAddEditPage.getPaceProgressToggleContainer(), 'Off')


        ARDashboardPage.AssertToggleDescriptionMessage(ARCURRAddEditPage.getPaceProgressToggleDescription(), CurrPageLableMessages.paceProgressToggleDescription)
        cy.get(ARCURRAddEditPage.getCourseSection()).should('contain', bundleCourseDefaults.Courses)

        cy.get(ARCURRAddEditPage.getRequiredInRedColorForGroupName()).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        cy.get(ARCURRAddEditPage.getGroupsRadioButtonsLabels()).children().should(($child) => {
            expect($child).to.contain('Must complete all');
            expect($child).to.contain('Minimum courses');
            expect($child).to.contain('Minimum credits');
        })
        cy.get(ARCURRAddEditPage.getGroupNoCourseDescription()).should("have.text", "No courses have been added.")
        cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.text', bundleCourseDefaults.AddCourses)
        cy.get(ARCURRAddEditPage.getAddGroupBtn()).should("exist")


        //Validate Enrollment Rule  Header 
        cy.get(ARCURRAddEditPage.getCurrSubHeaders()).contains("Enrollment Rules").should("have.text", "Enrollment Rules")

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Validate Expand Collapse Icon
        cy.get(ARCURRAddEditPage.getEnrollmentExpandCollapseIcon()).should("have.attr", 'aria-hidden', 'true')

        //Validate Allow Self Enrollment Off Radio Button
        ARCourseSettingsEnrollmentRulesModule.getDefaultAllowSelfEnrollmentRadioBtn('Off')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentDescription("Self enrollment for this course is off.")

        //Validate Enable Automatic Enrollemnt off radio button
        ARCourseSettingsEnrollmentRulesModule.getDefaultEnableAutomaticEnrollmentRadioBtn('Off')
        ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentDescription("Automatic enrollment for this course is off.")

        //Validate Approval Off Radio Button
        ARCourseSettingsEnrollmentRulesModule.getNoneApprovalRadioBtn('None')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalDescription()).should("have.text", "No approval is required to enroll.")

        //Validate Enable Ecommerce Toggle Button
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer(), "Off")

        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer(), CurrPageLableMessages.enableEcommerceToggleMessage)

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        //Toggle Certificate to ON
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsCompletionModule.getCertificateToggleContainer(), "Off")
        //Validate Certificate toggle Description
        ARCourseSettingsCompletionModule.getToggleByNameAndVerifyToggleStatus("Certificate")

        //Validate Toggle Allow Re-enrollment 
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer(), "Off")
        ARCourseSettingsCompletionModule.getToggleByNameAndVerifyAllowReEnrollment("Allow Re-enrollment")

        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtnTxt()).should("have.text", "Add Competency")

        //Validate no course competency description
        cy.get(ARCourseSettingsCompletionModule.getNoCourseCompetencyDescription() + ' ' + ARCourseSettingsCompletionModule.getElementByDataNameAttribute("no-course-competencies")).should("have.text", "This course grants no competencies.")

        //Validate Add credit button
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).should("have.text", "Add Credit")
        //Validate no credit completion description
        cy.get(ARCourseSettingsCompletionModule.getNoCreditCompletionDescription() + ' ' + ARCourseSettingsCompletionModule.getElementByDataNameAttribute("no-credits")).should("have.text", "This course will award no credits on completion.")

        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).invoke('val').then((value) => {
            cy.log("LeadBoard Points text box value is blank")
        })
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsSymbol()).should("have.text", "#")
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtDescription()).should("have.text", "Override the default point value")

        //validate Add post Enrollment Btn Txt
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentButton()).should("have.text", "Add Post Enrollment")
        cy.get(ARCourseSettingsCompletionModule.getPostEnrollmentsTxtDescription() + ' ' + ARCourseSettingsCompletionModule.getElementByDataNameAttribute("no-post-enrollments")).should("have.text", "This course has no post enrollment triggers.")

        //Open Availability section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARCourseSettingsAvailabilityModule.getDefaultAccessDateRadioBtn("No Access Date")
        //Validate Default no expiration radio button
        ARCourseSettingsAvailabilityModule.getDefaultExpirationeRadioBtn("No Expiration")
        //Validate Default No due Date radio btn
        ARCourseSettingsAvailabilityModule.getDefaultDueDateeRadioBtn("No Due Date")

        //Validate Allow course content download toggle 
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleContainer(), "Off")
        //Validate allow course content download toggle description
        cy.get(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleDescription()).should('contain', CurrPageLableMessages.contentDownloadToggleDescription)

        //Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).should('contain', 'Add Prerequisite')
        ARCourseSettingsAvailabilityModule.getNoPrerequisiteDescription()

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtnTxt()).should('contain', 'Choose Category')

        //Validate No poster description 
        ARCourseSettingsCatalogVisibilityModule.getNoPostersDescription()

        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtnContainer()).should('contain', 'Add Poster')

        //Verify Toggle is OFF By Default for mandatory course
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer(), 'off')
        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer(), CurrPageLableMessages.mandatoryCourseToggleDescription)

        //Verify Toggle is OFF By Default for featured course
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer(), 'off')
        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer(), CurrPageLableMessages.tagToggleForFeaturedCourseMessage)

        //Verify Toggle is OFF By Default for enable for Enable Recommended Courses
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer(), 'off')
        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer(), CurrPageLableMessages.tagToggleDescription)

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()

        //Validate all admin radio button
        ARCourseSettingsCourseAdministratorsModule.getDefaultCourseVisibilityeRadioBtn("All Admins")
        //Validate all admin toggle description
        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityTogggleDescription(), CurrPageLableMessages.allOtherUser)

        //Validate Select dept btn text
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditorBtnTxt()).should('contain', 'Select Department')
        //Validate no dept description
        cy.get(ARCourseSettingsCourseAdministratorsModule.getNoDepartmentDescription()).should('contain', CurrPageLableMessages.noDepartmentDescription)

        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).should('contain', 'Choose')
        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorContainer(), CurrPageLableMessages.departmentChooseDescription)

        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()

        //Assert Send Email Notifications Toggle is ON
        ARDashboardPage.AssertToggleMessage(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer() , 'on')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        
        ARCourseSettingsMessagesModule.getChkBoxStateByLabel(`Send ${messages.chkBoxLabels[0]} email`, messages.chkBoxDefaults[0])
        //Send Enrollment Email - Turn Use Custom Template Toggle ON
        ARCourseSettingsMessagesModule.getCustomTemplateToggleThenClick(`Send ${messages.chkBoxLabels[0]} email`)
        ARCourseSettingsMessagesModule.verifyEmailEnrollmentDescriptionBanner()

        ARCourseSettingsMessagesModule.getChkBoxStateByLabel(`Send ${messages.chkBoxLabels[1]} email`, messages.chkBoxDefaults[1])
        //Send Enrollment Email - Turn Use Custom Template Toggle ON
        ARCourseSettingsMessagesModule.getCustomTemplateToggleThenClick(`Send ${messages.chkBoxLabels[1]} email`)
        ARCourseSettingsMessagesModule.verifyEmailCompletionDescriptionBanner()

        //Open Resources Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Resources')).click()
        //Assert resourse delete button with label
        cy.get(ARCourseSettingsResourcesModule.getDeleteIconWithLabel()).should('exist')

        cy.get(ARCourseSettingsResourcesModule.getCollapseMessageIcon()).should('exist')
        cy.get(ARCourseSettingsResourcesModule.getAddResourceBtn()).should('contain', 'Add Resource')

        //Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()

        cy.get(ARCourseSettingsAttributesModule.getHideAttributesBtn()).should('have.attr', 'aria-disabled', 'false')
        //Collapse attributes
        cy.get(ARCourseSettingsAttributesModule.getCollapseAttributeBtn()).should('have.attr', 'aria-expanded', 'true')

        ARDashboardPage.AssertToggleMessage(ARCourseSettingsAttributesModule.getEnableCourseRatingToggleContainer(), 'off')

        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsAttributesModule.getEnableCourseRatingToggleContainer(), CurrPageLableMessages.coursesAvailableForRating)


        cy.get(ARCourseSettingsAttributesModule.getAttributeOptionLabels()).children().should(($child) => {
            expect($child).to.contain('Audience');
            expect($child).to.contain('Goals');
            expect($child).to.contain('External ID');
            expect($child).to.contain('Vendor');
        })

        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        cy.get(ARCourseSettingsSocialModule.getHideSocialBtn()).should('have.attr', 'aria-disabled', 'false')
        //Collapse attributes
        cy.get(ARCourseSettingsSocialModule.getCollapseSocialBtn()).should('have.attr', 'aria-expanded', 'true')

        cy.get(ARCourseSettingsSocialModule.getAllowCommentsToggle()).should('contain', 'Off')

        ARDashboardPage.AssertToggleDescriptionMessage(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer(), CurrPageLableMessages.allowCommentsToggleDescription)

        cy.get(ARCourseSettingsSocialModule.getCollaborationsDDown()).should('contain', 'Choose')

        //Open More Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()


        cy.get(arAddMoreCourseSettingsModule.getHideMoreBtn()).should('have.attr', 'aria-disabled', 'false')
        //Collapse attributes
        cy.get(ARCourseSettingsMoreModule.getCollapseMoreBtn()).should('have.attr', 'aria-expanded', 'true')
        cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).should('have.attr', 'aria-invalid', 'false')

    })

})