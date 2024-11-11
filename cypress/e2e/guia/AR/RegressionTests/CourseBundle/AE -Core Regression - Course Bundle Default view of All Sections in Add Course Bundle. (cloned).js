import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage, { bundleCourseDefaults } from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import AROCAddEditPage, { coursePageMessages } from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"

describe('C7333 - AUT-695 - AE Regression - Course Bundle Default view of All Sections in Add Course Bundle. (cloned)', () => {

    after('Delete the new Course as part of clean-up', () => {
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
    })

    it('Verify Course Bundle Default view of All Sections during Add Course Bundle', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        // Course page right action menu
        ARCBAddEditPage.getRightActionMenuCoursePage()

        cy.get(ARCBAddEditPage.getAddCourseBundleMenuActionsByName()).click()
        ARDashboardPage.getVLongWait()

        cy.get(ARCBAddEditPage.getPageTitle()).should('contain', bundleCourseDefaults.AddCourseBundle)

        // General section is displaying
        cy.get(ARCBAddEditPage.getGeneralSectionTitle()).should('have.text', bundleCourseDefaults.General)
        ARCBAddEditPage.generalToggleSwitch('false', ARUserAddEditPage.getIsActiveToggleContainer())
        // General Status text field
        cy.get(ARCBAddEditPage.getGeneralStatusToggleContainer() + " "+ ARCBAddEditPage.getGeneralStatusDes()).should("contain", coursePageMessages.INACTIVE_COURSE_VISIBILITY_WARNING)

        // General Title (Required) is written in Red (or near red)
        cy.get(ARCBAddEditPage.getGeneralTitle()).should('contain', bundleCourseDefaults.TitleRequired)
        cy.get(AROCAddEditPage.getRequiredInRedColor()).should('have.css', 'color', 'rgb(214, 20, 52)')
        // "Course Name" is pre-written in Title field
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).should('have.value', bundleCourseDefaults.CourseName)
        ARDashboardPage.getShortWait()
        // General all fields
        ARCBAddEditPage.getGeneralAllFields()

        ARDashboardPage.getShortWait()
        // Automatic tagging is ON by default
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')
        // General Automatic Tagging text field
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', coursePageMessages.AUTO_GENERATED_TAG_MESSAGE)

        // Courses section
        cy.get(ARCBAddEditPage.getCourseSection()).should('contain', bundleCourseDefaults.Courses)
        cy.get(ARCBAddEditPage.getNoCourseDes()).should('have.text', bundleCourseDefaults.NoCourseAdded)
        cy.get(ARCBAddEditPage.getAddCourseBtn()).should('contain', bundleCourseDefaults.AddCourses)
        cy.get(ARCBAddEditPage.getAddCourseIcon()).should('have.class', 'icon-plus')

        // Open Enrollment Rules and view default
        cy.get(ARCBAddEditPage.getCourseSettingsEnrollmentBtn()).click()
        ARDashboardPage.getShortWait()
        // Enrollment rules icon
        cy.get(ARCBAddEditPage.getEnrollmentRules()).should('contain', bundleCourseDefaults.EnrollmentRules)
        cy.get(ARCBAddEditPage.getEnrollmentRulesCollapseIcon()).should('have.class', 'icon-caret-up')

        // Select Allow Self Enrollment off Radio Button
        cy.get(ARCBAddEditPage.getAllowSelfEnrollmentTitle()).should('contain', bundleCourseDefaults.AllowSelfEnrollment)
        ARCBAddEditPage.getMediumWait()
        ARCourseSettingsEnrollmentRulesModule.getDefaultAllowSelfEnrollmentRadioBtn('Off')
        cy.get(ARCBAddEditPage.getAllowSelfEnrollmentBtn()).contains(bundleCourseDefaults.Specific)
        cy.get(ARCBAddEditPage.getAllowSelfEnrollmentBtn()).contains(bundleCourseDefaults.AllLearners)
        cy.get(ARCBAddEditPage.getAllowSelfEnrollmentDes()).should('contain', bundleCourseDefaults.SelfEnrollmentDes)
        
        // Select Enable Automatic Enrollment off Radio Button
        cy.get(ARCBAddEditPage.getAutomaticEnrollmentTitle()).should('contain', bundleCourseDefaults.EnableAutomaticEnrollment)
        ARCourseSettingsEnrollmentRulesModule.getDefaultEnableAutomaticEnrollmentRadioBtn('Off')
        cy.get(ARCBAddEditPage.getAutomaticEnrollmentBtn()).contains(bundleCourseDefaults.Specific)
        cy.get(ARCBAddEditPage.getAutomaticEnrollmentBtn()).contains(bundleCourseDefaults.AllLearners)
        cy.get(ARCBAddEditPage.getAutomaticEnrollmentDes()).should('contain', bundleCourseDefaults.AutoEnrollmentDes)


        // Open Availability Section and view default
        cy.get(ARCBAddEditPage.getCourseSettingsAvailabilityBtn()).click()
        AROCAddEditPage.getShortWait()
        // Select Access Date 'Date' Option
        cy.get(ARCBAddEditPage.getAccessDateTypeTitle()).should('contain', bundleCourseDefaults.AccessDate)
        cy.get(ARCBAddEditPage.getAccessDateTypeBtn()).contains(bundleCourseDefaults.NoAccessDate).parent().find('input').should('be.checked')
        // Select Expiration 'Time from enrollment' Option
        cy.get(ARCBAddEditPage.getExpiryTypeTitle()).should('contain', bundleCourseDefaults.Expiration)
        cy.get(ARCBAddEditPage.getExpiryTypeBtn()).contains(bundleCourseDefaults.NoExpiration).parent().find('input').should('be.checked')
        cy.get(ARCBAddEditPage.getExpiryTypeBtn()).should('contain', bundleCourseDefaults.TimeFromEnrollment)
        cy.get(ARCBAddEditPage.getExpiryTypeBtn()).should('contain', bundleCourseDefaults.Date)

        // Verify Add prerequisite button text and toggle description
        cy.get(ARCBAddEditPage.getPrerequisite()).within(() => {
            cy.get(ARCBAddEditPage.getPrerequisiteTitle()).contains(bundleCourseDefaults.Prerequisites)
            cy.get(ARCBAddEditPage.getPrerequisiteCmt()).should('have.text', bundleCourseDefaults.PrerequisitesDes)
            cy.get(ARCBAddEditPage.getAddPrerequisiteBtn()).should('contain', bundleCourseDefaults.AddPrerequisite)
            cy.get(AROCAddEditPage.getPlusIcon()).should('exist')
        })

        // Open Catalog Visibility Section and view default
        cy.get(ARCBAddEditPage.getCourseSettingsByCatalogVisibilityBtn()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCBAddEditPage.getCatalogVisibilityVerification()).should('have.text', bundleCourseDefaults.CatalogVisibility)
        cy.get(ARCBAddEditPage.getCourseVisibility()).within(() => {
            cy.get(ARCBAddEditPage.getCategoryTitle()).should('contain', bundleCourseDefaults.Category)
            cy.get(ARCBAddEditPage.getChooseCategoryBtn()).should('contain', bundleCourseDefaults.ChooseCategory)

            cy.get(ARCBAddEditPage.getCategoryThumbnailTitle()).should('contain', bundleCourseDefaults.Thumbnail)
            cy.get(ARCBAddEditPage.getCategoryThumbnail()).should('exist')
            cy.get(ARCBAddEditPage.getCategoryBtn()).should('contain', bundleCourseDefaults.File)
            cy.get(ARCBAddEditPage.getCategoryBtn()).should('contain', bundleCourseDefaults.Url)
            cy.get(ARCBAddEditPage.getFileRadioBtn()).should('be.checked')
            cy.get(ARCBAddEditPage.getCategoryChooseFileBtn()).should('contain', bundleCourseDefaults.ChooseFile)

            cy.get(ARCBAddEditPage.getPostersLabel()).should('contain', bundleCourseDefaults.Posters)
            cy.get(ARCBAddEditPage.getPostersCmmt()).should('contain', bundleCourseDefaults.PostersDes)
            cy.get(ARCBAddEditPage.getAddPosterBtn()).should('contain', bundleCourseDefaults.AddPoster)
            cy.get(ARCBAddEditPage.getAddPosterBtnIcon()).should('exist')

            cy.get(ARCBAddEditPage.getFeaturedCourseLabel()).should('contain', bundleCourseDefaults.FeaturedCourse)
            cy.get(ARCBAddEditPage.getFeaturedCourseDes()).should('contain', bundleCourseDefaults.FeaturedCourseDes)
            cy.get(ARCBAddEditPage.getFeaturedCourseBtn()).should('have.attr', ARCBAddEditPage.getRadioChecked(), 'false')
        })
        cy.get(ARCBAddEditPage.getRecommendedCourseLabel()).should('contain', bundleCourseDefaults.EnableRecommendedCourses)
        cy.get(ARCBAddEditPage.getRecommendedCourseDes()).should('contain', bundleCourseDefaults.EnableRecommendedCoursesDes)
        cy.get(ARCBAddEditPage.getRecommendedCourseBtn()).should('have.attr', ARCBAddEditPage.getRadioChecked(), 'false')

        // Open Course Administrators Section and view default
        cy.get(ARCBAddEditPage.getCourseSettingsByCourseAdministratorsBtn()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCBAddEditPage.getCourseAdministration()).within(() => {
            cy.get(ARCBAddEditPage.getCourseAdministrationTitle()).should('contain', bundleCourseDefaults.CourseAdministrators)
            cy.get(ARCBAddEditPage.getCourseAdministrationCollapse()).should('exist')

            cy.get(ARCBAddEditPage.getCourseVisibilityLabel()).should('contain', bundleCourseDefaults.CourseVisibility)
            cy.get(ARCBAddEditPage.getCourseAdministrationVisibilityDes()).should('contain', bundleCourseDefaults.CourseVisibilityDes)
            cy.get(ARCBAddEditPage.getCourseAdministrationVisibilityRadio()).should('contain', bundleCourseDefaults.AllAdmins)
            cy.get(ARCBAddEditPage.getCourseAdministrationVisibilityRadio()).should('contain', bundleCourseDefaults.Department)
            cy.get(ARCBAddEditPage.getCourseAdministrationVisibilityAllAdminRadioBtn()).should('have.attr', ARCBAddEditPage.getRadioChecked(), 'true')

            cy.get(ARCBAddEditPage.getPrimaryDepartmentEditorLabel()).should('contain', bundleCourseDefaults.PrimaryDepartmentEditor)
            cy.get(ARCBAddEditPage.getSelectDepartment()).should('contain', bundleCourseDefaults.SelectDepartment)
            cy.get(ARCBAddEditPage.getSelectDepartmentDes()).should('contain', bundleCourseDefaults.SelectDepartmentDes)

            cy.get(ARCBAddEditPage.getAdditionalAdminEditorsLabel()).should('contain', bundleCourseDefaults.AdditionalAdminEditors)
            cy.get(ARCBAddEditPage.getAdditionalAdminEditorsDes()).should('contain', bundleCourseDefaults.AdditionalAdminEditorsDes)
            cy.get(ARCBAddEditPage.getAdditionalAdminEditorsField()).should('exist')
        })

        // Open Messages Section and view default
        cy.get(ARCBAddEditPage.getCourseSettingsByMessagesBtn()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCBAddEditPage.getMessage()).within(() => {
            cy.get(ARCBAddEditPage.getMessageLabel()).should('contain', bundleCourseDefaults.Messages)
            cy.get(ARCBAddEditPage.getMessagetrashIcon()).should('exist')
            cy.get(ARCBAddEditPage.getMessageCollapseIcon()).should('exist')
            cy.get(ARCBAddEditPage.getSendEmailNotificationBtn()).should('have.attr', ARCBAddEditPage.getRadioChecked(), 'true')
            cy.get(ARCBAddEditPage.getSendEmailNotificationCheckBox()).should('have.attr', ARCBAddEditPage.getRadioChecked(), 'true')
            cy.get(ARCBAddEditPage.getUseCustomTemplateLabel()).should('contain', bundleCourseDefaults.UseCustomTemplate)
            cy.get(ARCBAddEditPage.getUseCustomTemplateDes()).should('contain', bundleCourseDefaults.UseCustomTemplateDes)
            cy.get(ARCBAddEditPage.getUseCustomTemplateBtn()).should('have.attr', ARCBAddEditPage.getRadioChecked(), 'false')
        })


        // Open Attributes Section and view default
        cy.get(ARCBAddEditPage.getCourseSettingsByAttributesBtn()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCBAddEditPage.getAttributes()).within(() => {
            cy.get(ARCBAddEditPage.getAttributesLabel()).should('contain', bundleCourseDefaults.Attributes)
            cy.get(ARCBAddEditPage.getAttributesTrash()).should('exist')
            cy.get(ARCBAddEditPage.getAttributesCollapse()).should('exist')
            cy.get(ARCBAddEditPage.getAudienceLabel()).should('contain', bundleCourseDefaults.Audience)
            cy.get(ARCBAddEditPage.getAudienceInput()).should('exist')
            cy.get(ARCBAddEditPage.getGoalsLabel()).should('contain', bundleCourseDefaults.Goals)
            cy.get(ARCBAddEditPage.getGoalsInput()).should('exist')
            cy.get(ARCBAddEditPage.getExternalIDLabel()).should('contain', bundleCourseDefaults.ExternalID)
            cy.get(ARCBAddEditPage.getExternalIDInput()).should('exist')
            cy.get(ARCBAddEditPage.getVendorLabel()).should('contain', bundleCourseDefaults.Vendor)
            cy.get(ARCBAddEditPage.getVendorInput()).should('exist')
        })

        // Open More Section
        cy.get(ARCBAddEditPage.getCourseSettingsByMoreBtn()).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCBAddEditPage.getMoreSection()).within(() => {
            cy.get(ARCBAddEditPage.getMoreTitle()).should('contain', bundleCourseDefaults.More)
            cy.get(ARCBAddEditPage.getMoreTrash()).should('exist')
            cy.get(ARCBAddEditPage.getMoreCollapse()).should('exist')
            cy.get(ARCBAddEditPage.getCourseNoteLabel()).should('contain', bundleCourseDefaults.Notes)
            cy.get(ARCBAddEditPage.getCourseNotesTextBox()).should('exist')
        })
        ARDashboardPage.getMediumWait()

        // Right menu button
        ARCBAddEditPage.getRightMenuBtn()

        // Click on view history
        cy.get(ARCBAddEditPage.getViewHistoryBtn()).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARCBAddEditPage.getHistoryTitle()).should('contain', bundleCourseDefaults.CourseBundleHistory)
        cy.get(ARCBAddEditPage.getCloseModal()).click()
        ARDashboardPage.getMediumWait()

        // Click on cancel button
        cy.get(ARCBAddEditPage.getCancelBtn()).click()
        ARDashboardPage.getMediumWait()
        // Modal ok button
        cy.get(ARCBAddEditPage.getModalOkButton()).click()

        // Navigate to courses page
        cy.get(ARCBAddEditPage.getPageTitle()).should('contain', bundleCourseDefaults.Courses)
    })

    it('Publish the course and filter it from the Learner side', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle',cbDetails.courseName)
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.visit('/#/catalog')
        // Search publish course
        LEFilterMenu.SearchForCourseByName(cbDetails.courseName)
       
    })
})