import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARDuplicateCourseModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDuplicateCourseModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'

describe('AR - CED - OC - Duplicate Course', function(){

    before(function() {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')
        //Add file upload object to OC
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'File')
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Catalog visibility - turn on toggles
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        AROCAddEditPage.getLShortWait()
        AROCAddEditPage.generalToggleSwitch('true',ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer())
        AROCAddEditPage.generalToggleSwitch('true',ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer())
        //Availability section - add access data
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains(/^Date$/).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date1)
        //Completion - add note and credits
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        AROCAddEditPage.getLShortWait()
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).type(commonDetails.customNotes)
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains('General').click()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).type(credit.credit2)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Verify Course Can be Duplicated', () => {
        //Verify course can be duplicated from courses report
        ARDashboardPage.getCoursesReport()
        
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        arCoursesPage.getMediumWait()
        cy.get(arCoursesPage.getTableCellName(2)).contains(ocDetails.courseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Duplicate'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).click()

        //Verify duplicate modal
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to duplicate course '${ocDetails.courseName}'?`)
        cy.get(ARDuplicateCourseModal.getOKBtn()).click()
        cy.get(arCoursesPage.getToastSuccessMsg(), {timeout: 60000}).should('contain', 'Copy has been successfully duplicated.')
    })
})

describe('AR - CED - OC - Verify Duplicated Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, filter for duplicated course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        cy.editCourse(`${ocDetails.courseName} - Copy`)
        AROCAddEditPage.getMediumWait()
    })

    after(function() {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
    })

    it('Verify Duplicated Course and Make Edits', () => {
        //Verify course is inactive by default and set to active
        AROCAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())

        //Verify enrollment rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')

        //Verify visibilty rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        AROCAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify availability access date persisted
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTxtF()).should('have.value', commonDetails.date1)

        //Verify completion credit rules were duplicated and delete credit
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        AROCAddEditPage.getLShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCertificateNoteText()).eq(0).should('have.value', commonDetails.customNotes).type(commonDetails.appendText)
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).should('contain', `General: ${credit.credit2}`)
            .parents(ARCourseSettingsCompletionModule.getCreditContainer()).within(() => {
                cy.get(ARCourseSettingsCompletionModule.getDeleteCreditBtn()).click()
            })

        //Verify other fields were duplicated (description, language, etc) and edit them
        cy.get(AROCAddEditPage.getDescriptionTxtF()).should('contain.text', ocDetails.description).type(commonDetails.appendText)
        cy.get(AROCAddEditPage.getGeneralLanguageDDown()).should('contain.text', 'English')

        //Verify object lesson was duplicated
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessonObjects.objectName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonObjects.objectName)
        cy.get(ARAddObjectLessonModal.getFileTxtF()).should('have.value', commonDetails.posterImgName)
        cy.get(ARAddObjectLessonModal.getCancelBtn()).click()
        AROCAddEditPage.getVShortWait()

        //Verify Duplicated course can be published
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Verify Duplicated Course Persisted', () => {
        //Verify duplicated course fields and edits persisted
        AROCAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())
        cy.get(AROCAddEditPage.getDescriptionTxtF()).should('contain.text', ocDetails.description + commonDetails.appendText)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCertificateNoteText()).eq(0).should('have.value', commonDetails.customNotes + commonDetails.appendText)
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).should('not.exist')

        //Verify admin has the option to duplicate the course from the edit page
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).should('have.attr', 'aria-disabled', 'false')
    })
})