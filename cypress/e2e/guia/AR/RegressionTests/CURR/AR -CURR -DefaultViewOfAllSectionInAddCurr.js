import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import {  arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARCourseSettingsMessagesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMessages.module'
import { messages } from '../../../../../../helpers/TestData/Courses/ilc'
import ARCourseSettingsResourcesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsResources.module'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import ARCourseSettingsMoreModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMore.module'


describe('AR - CED - Curriculum - Availability Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    it('Create Curriculum, Verify Availability Section Buttons, Fields, Toggles, Courses Prerequisites, & Publish Course', () => {
        //Create curriculum
        cy.createCourse('Curriculum')
        arSelectModal.SearchAndSelectFunction(arrayOfCourses.twoElementsArray)
        //Validate Course Header section
        cy.get(ARCURRAddEditPage.getCurrSubHeaders()).contains("Courses").should("have.text","Courses")
        //Validate Show term & Condition toggle status and description
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(arCoursesPage.getShowTermAndCondition()) + ' ' + arCoursesPage.getDisableToggleStatus())
        .should('have.text','Off')
        cy.get(arCBAddEditPage.getShowTermAndConditionToggle()+ ' ' +ARCURRAddEditPage.getStatusFieldText()).should('have.text',"User must accept terms & conditions to gain access to the course.")
        //Validate pace progress toggle status and description
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCURRAddEditPage.getPaceProgressToggleContainer())+ ' '+arCoursesPage.getDisableToggleStatus())
        .should('have.text','Off')
        cy.get(ARCURRAddEditPage.getPaceProgressToggleDescription()+ ' '+ARCURRAddEditPage.getStatusFieldText()).should('have.text',"Forces completion of each group before starting the next one")

        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCURRAddEditPage.getGroupTitleTxtF())).should('have.value',"Group 1")
        cy.get(ARCURRAddEditPage.getRequiredInRedColorForGroupName()).should('have.css','background-color', 'rgba(0, 0, 0, 0)')
        cy.get(ARCURRAddEditPage.getGroupsRadioButtonsLabels()).children().should(($child)=>{
        expect($child).to.contain('Must complete all');
        expect($child).to.contain('Minimum courses');
        expect($child).to.contain('Minimum credits');
        })
        cy.get(ARCURRAddEditPage.getGroupNoCourseDescription()).should("have.text","No courses have been added.")
        cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should("be.visible")
        cy.get(ARCURRAddEditPage.getAddGroupBtn()).should("be.visible")
        //Validate Enrollment Rule  Header 
        cy.get(ARCURRAddEditPage.getCurrSubHeaders()).contains("Enrollment Rules").should("have.text","Enrollment Rules")

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Validate Expand Collapse Icon
        cy.get(ARCURRAddEditPage.getEnrollmentExpandCollapseIcon()).should("have.attr",'aria-hidden','true')

        //Validate Allow Self Enrollment Off Radio Button
        ARCourseSettingsEnrollmentRulesModule.getDefaultAllowSelfEnrollmentRadioBtn('Off')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentDescription("Self enrollment for this course is off.")

        //Validate Enable Automatic Enrollemnt off radio button
        ARCourseSettingsEnrollmentRulesModule.getDefaultEnableAutomaticEnrollmentRadioBtn('Off')
        ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentDescription("Automatic enrollment for this course is off.")

        //Validate Approval Off Radio Button
        ARCourseSettingsEnrollmentRulesModule.getNoneApprovalRadioBtn('None')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalDescription()).should("have.text","No approval is required to enroll.")

        //Validate Enable Ecommerce Toggle Button
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer())+ ' '+ARCURRAddEditPage.getToggleDisabled())
        .should("have.text","Off")
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer())+ ' '+ARCourseSettingsEnrollmentRulesModule.getEcommerceToggleDescription())
        .should("have.text","Turning this option 'on' will make this course available for purchase through the shopping cart.")

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

         //Toggle Certificate to ON
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getCertificateToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled())
        .should("have.text","Off")
        //Validate Certificate toggle Description
        ARCourseSettingsCompletionModule.getToggleByNameAndVerifyToggleStatus("Certificate")
        
        //Validate Toggle Allow Re-enrollment 
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled())
        .should("have.text","Off")
        ARCourseSettingsCompletionModule.getToggleByNameAndVerifyAllowReEnrollment("Allow Re-enrollment")
        
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtnTxt()).should("have.text","Add Competency")
     
        //Validate no course competency description
        cy.get(ARCourseSettingsCompletionModule.getNoCourseCompetencyDescription()+ ' '+ARCourseSettingsCompletionModule.getElementByDataNameAttribute("no-course-competencies")).should("have.text","This course grants no competencies.")

        //Validate Add credit button
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).should("have.text","Add Credit")
        //Validate no credit completion description
        cy.get(ARCourseSettingsCompletionModule.getNoCreditCompletionDescription()+ ' '+ARCourseSettingsCompletionModule.getElementByDataNameAttribute("no-credits")).should("have.text","This course will award no credits on completion.")
        
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtF()).invoke('val').then((value)=>{
            cy.log("LeadBoard Points text box value is blank")
        })
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsSymbol()).should("have.text","#")
        cy.get(ARCourseSettingsCompletionModule.getLeaderboardPointsTxtDescription()).should("have.text","Override the default point value")

        //validate Add post Enrollment Btn Txt
        cy.get(ARCourseSettingsCompletionModule.getAddPostEnrollmentButton()).should("have.text","Add Post Enrollment")
        cy.get(ARCourseSettingsCompletionModule.getPostEnrollmentsTxtDescription()+ ' '+ARCourseSettingsCompletionModule.getElementByDataNameAttribute("no-post-enrollments")).should("have.text","This course has no post enrollment triggers.")
        
        //Open Availability section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARCourseSettingsAvailabilityModule.getDefaultAccessDateRadioBtn("No Access Date")
        //Validate Default no expiration radio button
        ARCourseSettingsAvailabilityModule.getDefaultExpirationeRadioBtn("No Expiration")
        //Validate Default No due Date radio btn
        ARCourseSettingsAvailabilityModule.getDefaultDueDateeRadioBtn("No Due Date")

        //Validate Allow course content download toggle 
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleDisabled())
        .should("have.text","Off")
        //Validate allow course content download toggle description
        cy.get(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleDescription()).should('contain', 'Allows users to download and complete this course while offline.')

        //Add Prerequisite
        cy.get(ARCourseSettingsAvailabilityModule.getAddPrerequisiteBtn()).should('contain','Add Prerequisite')
        ARCourseSettingsAvailabilityModule.getNoPrerequisiteDescription()

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtnTxt()).should('contain','Choose Category')

        //Validate No poster description 
        ARCourseSettingsCatalogVisibilityModule.getNoPostersDescription()

        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtnContainer()).should('contain','Add Poster')

        //Verify Toggle is OFF By Default for mandatory course
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
        .should('have.attr', 'aria-checked', 'false')
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' +ARCourseSettingsCompletionModule.getDescription())
        .should('contain',"Turning this option 'on' will prioritize the course within the learner's my courses view.")
        
        //Verify Toggle is OFF By Default for featured course
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
        .should('have.attr', 'aria-checked', 'false')
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' '+ARCourseSettingsCompletionModule.getDescription())
        .should('contain',"Turning this option 'on' will make this course available within the featured area on the dashboard.")

        //Verify Toggle is OFF By Default for enable for Enable Recommended Courses
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
        .should('have.attr', 'aria-checked', 'false')
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer()) + ' '+ARCourseSettingsCompletionModule.getDescription())
        .should('contain',"Turning this option 'on' will make course recommendations available that match the following tags for this course.")
        
        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
        
        //Validate all admin radio button
        ARCourseSettingsCourseAdministratorsModule.getDefaultCourseVisibilityeRadioBtn("All Admins")
        //Validate all admin toggle description
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityTogggleDescription()+ ' '+ ARCourseSettingsCompletionModule.getDescription()).should('contain','This course will be visible to all other administrator users')
        
        //Validate Select dept btn text
        cy.get(ARCourseSettingsCourseAdministratorsModule.getPrimaryDepartmentEditorBtnTxt()).should('contain','Select Department')
        //Validate no dept description
        cy.get(ARCourseSettingsCourseAdministratorsModule.getNoDepartmentDescription()).should('contain','Administrators who manage this department can edit this course if they have course visibility. If no department is selected, this applies to all Administrators.')

        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).should('contain','Choose')
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorContainer()+ ' '+ARCourseSettingsCompletionModule.getDescription()).should('contain','These administrators can edit this course if they have course visibility.')

        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()

        //Assert Send Email Notifications Toggle is ON
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
        cy.get(ARCourseSettingsResourcesModule.getAddResourceBtn()).should('contain','Add Resource')

         //Open Attribute Settings
         cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
         
         cy.get(ARCourseSettingsAttributesModule.getHideAttributesBtn()).should('have.attr','aria-disabled','false')
         //Collapse attributes
        cy.get(ARCourseSettingsAttributesModule.getCollapseAttributeBtn()).should('have.attr','aria-expanded','true')

        cy.get(ARCourseSettingsAttributesModule.getEnableCourseRatingToggleContainer()+ ' '+ARCourseSettingsAttributesModule.getToggleDisabled())
        .should('contain','Off')
        cy.get(ARCourseSettingsAttributesModule.getEnableCourseRatingToggleContainer()+ ' '+ARCourseSettingsCompletionModule.getDescription())
        .should('contain',"Turning this option 'on' will make this course available for rating.")
        
        cy.get(ARCourseSettingsAttributesModule.getAttributeOptionLabels()).children().should(($child)=>{
            expect($child).to.contain('Audience');
            expect($child).to.contain('Goals');
            expect($child).to.contain('External ID');
            expect($child).to.contain('Vendor');
            })
        
            //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        cy.get(ARCourseSettingsSocialModule.getHideSocialBtn()).should('have.attr','aria-disabled','false')
         //Collapse attributes
        cy.get(ARCourseSettingsSocialModule.getCollapseSocialBtn()).should('have.attr','aria-expanded','true')

        cy.get(ARCourseSettingsSocialModule.getAllowCommentsToggle()).should('contain','Off')

        cy.get(ARCourseSettingsSocialModule.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' '+ARCourseSettingsCompletionModule.getDescription())
        .should('contain',"Enable learner feedback for the entire course.")

        cy.get(ARCourseSettingsSocialModule.getCollaborationsDDown()).should('contain','Choose')

        //Open More Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()

        
        cy.get(arAddMoreCourseSettingsModule.getHideMoreBtn()).should('have.attr','aria-disabled','false')
        //Collapse attributes
       cy.get(ARCourseSettingsMoreModule.getCollapseMoreBtn()).should('have.attr','aria-expanded','true')
       cy.get(ARCourseSettingsMoreModule.getNotesTxtF()).should('have.attr','aria-invalid','false')
       
    })  
      
})