import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARDuplicateCourseModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDuplicateCourseModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('AR - CED - CURR - Duplicate Course', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, filter for duplicated course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
    })

    after(function() {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'curricula')
        }
    })

    it('Create Curriculum Course', function() {
        cy.createCourse('Curriculum')
        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Catalog visibility - turn on toggles
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCURRAddEditPage.getLShortWait()
        ARCURRAddEditPage.generalToggleSwitch('true',ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer())
        ARCURRAddEditPage.generalToggleSwitch('true',ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer())
        //Availability section - add access data
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARCURRAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains(/^Date$/).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date1)
        //Completion - add note and credits
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getLShortWait()
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).type(commonDetails.customNotes)
        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        
        //Select the Credit dropdown box to be able to type in the box
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        
        //Type the credit type in the box and select the matching credit type in the list
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeSelections()).get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains('General').click()
        
        cy.get(ARCURRAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getCreditAmountTxt())).type(credit.credit2)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Verify Course Can be Duplicated', () => {
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', currDetails.courseName))
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:10*1000}).should('not.exist')

        cy.get(arCoursesPage.getTableCellName(2)).contains(currDetails.courseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Duplicate'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).click()

        //Verify duplicate modal
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to duplicate course '${currDetails.courseName}'?`)
        cy.get(ARDuplicateCourseModal.getOKBtn()).click()

        //Wait for duplication job to finish
        cy.get(ARDuplicateCourseModal.getCourseDuplicationInProgressModal(), {timeout: 60000}).should('be.visible')
    })

    it('Verify Duplicated Course and Make Edits', () => {
        cy.editCourse(`${currDetails.courseName} - Copy`)

        //Verify course is inactive by default and set to active
        ARCURRAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())
        
        //Verify enrollment rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        arCoursesPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // commenting out due to QA Main performance issue
        //ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('All Learners') 
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')

        //Verify visibilty rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCURRAddEditPage.getShortWait()
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify availability access date persisted
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARCURRAddEditPage.getShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTxtF()).should('have.value', commonDetails.date1)

        //Verify completion credit rules were duplicated and delete credit
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).should('have.value', commonDetails.customNotes).type(commonDetails.appendText)
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).should('contain', `General: ${credit.credit2}`)
            .parents(ARCourseSettingsCompletionModule.getCreditContainer()).within(() => {
                cy.get(ARCourseSettingsCompletionModule.getDeleteCreditBtn()).click()
            })

        //Verify other fields were duplicated (description, language, etc) and edit them
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(ARCURRAddEditPage.getGeneralLanguageDDown()).should('contain.text', currDetails.language)

        //Verify added courses were duplicated
        cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')

        //Add a second course
        cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])
        ARSelectModal.getLShortWait()

        //Verify Duplicated course can be published
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Verify Duplicated Course Persisted', () => {
        cy.editCourse(`${currDetails.courseName} - Copy`)

        //Verify duplicated course fields and edits persisted
        ARCURRAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())
        cy.get(ARCURRAddEditPage.getDescriptionTxtF()).should('contain.text',commonDetails.appendText)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getShortWait()
        cy.get(ARCourseSettingsCompletionModule.getCustomNotesTxtF()).should('have.value', commonDetails.customNotes + commonDetails.appendText)
        cy.get(ARCourseSettingsCompletionModule.getCreditContainerLabel()).should('not.exist')

        //Verify added courses 
        cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
        cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).should('exist')

        //Verify admin has the option to duplicate the course from the edit page
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).should('have.attr', 'aria-disabled', 'false')
    })
})