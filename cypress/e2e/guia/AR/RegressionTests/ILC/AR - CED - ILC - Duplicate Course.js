import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARDuplicateCourseModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDuplicateCourseModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('AR - CED - ILC - Duplicate Course', function(){
    before(function() {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        
        cy.createCourse('Instructor Led')
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Catalog visibility - turn on toggles
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getLShortWait()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        //Availability section - turn on toggles
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getProhibitLearnerToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        //Completion - add note and credit
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getLShortWait()

        // Enable Certificate Toggle
        cy.get(ARCourseSettingsCompletionModule.getCertificateToggleCheckbox()).siblings('div').click()
        ARILCAddEditPage.getLShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).type(commonDetails.customNotes)

        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains('General').click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).type(credit.credit2)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, filter for duplicated course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arCoursesPage.getCoursesReport()
    })

    after(function() {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
    })

    it('Verify Course Can be Duplicated', () => {
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ilcDetails.courseName))
        ARILCAddEditPage.getMediumWait()

        cy.get(arCoursesPage.getTableCellName(2)).contains(ilcDetails.courseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Duplicate'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).click()

        //Verify duplicate modal
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to duplicate course '${ilcDetails.courseName}'?`)
        cy.get(ARDuplicateCourseModal.getOKBtn()).click()
        //Wait for duplication job to finish
        cy.get(arCoursesPage.getToastSuccessMsg(), {timeout: 60000}).should('contain', 'Copy has been successfully duplicated.')
    })

    it('Verify Duplicated Course and Make Edits, Add Session', () => {
        cy.editCourse(`${ilcDetails.courseName} - Copy`)
        ARILCAddEditPage.getMediumWait()

        //Verify course is inactive by default and set to active
        ARILCAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())

        //Verify enrollment rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')

        //Verify visibilty rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify availability toggles persisted
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getAllowEnrollmentToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsAvailabilityModule.getProhibitLearnerToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify completion credit rules were duplicated and delete credit
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).should('have.value', commonDetails.customNotes).type(commonDetails.appendText)
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).should('contain', `General: ${credit.credit2}`)
            .parents(ARCourseSettingsCompletionModule.getCreditContainer()).within(() => {
                cy.get(ARCourseSettingsCompletionModule.getDeleteCreditBtn()).click()
            })

        //Verify other fields were duplicated (description, language, etc) and edit them
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).should('contain.text', ilcDetails.description).type(commonDetails.appendText)
        cy.get(ARILCAddEditPage.getGeneralLanguageDDown()).should('contain.text', 'English')

        //Verify ILC Session was not duplicated
        cy.get(ARILCAddEditPage.getNoSessionsAddedTxt()).should('contain', 'No sessions have been added.')

        //Verify ILC session can be added to duplicated course
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_2)
        //Set Session Date 3 days into the future
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(3))
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Verify Duplicated course can be published
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Verify Duplicated Course Persisted', () => {
        cy.editCourse(`${ilcDetails.courseName} - Copy`)
        ARILCAddEditPage.getMediumWait()

        //Verify duplicated course fields and edits persisted
        ARILCAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).should('contain.text', ilcDetails.description + commonDetails.appendText)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).should('have.value', commonDetails.customNotes + commonDetails.appendText)
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).should('not.exist')

        //Verify new ILC Session persisted
        cy.get(ARILCAddEditPage.getVerifySessionExists()).should('contain', sessions.sessionName_2)

        //Verify admin has the option to duplicate the course from the edit page
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).should('have.attr', 'aria-disabled', 'false')
    })
})