import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARDuplicateCourseModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDuplicateCourseModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import { commonDetails, credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'

describe('AR - CED - CB - Duplicate Course', function(){

    before(function() {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle', cbDetails.courseName)
        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
      
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
       
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Catalog visibility - turn on toggle
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
      
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + arCBAddEditPage.getToggleDisabled()).click()
        //Availability section - add access data
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
      
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains(/^Date$/).click()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date)
        
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
    })
        

    it('Verify Course Can be Duplicated', () => {
        // //Verify course can be duplicated from courses report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        
        cy.get(arCoursesPage.getTableCellName(2)).contains(cbDetails.courseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Duplicate'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).should('be.visible')
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).click()
      

        //Verify duplicate modal
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to duplicate course '${cbDetails.courseName}'?`)
        cy.get(ARDuplicateCourseModal.getOKBtn()).click()

        //Wait for duplication job to finish
        cy.get(ARDuplicateCourseModal.getCourseDuplicationInProgressModal(), {timeout: 60000}).should('be.visible')
    })
})

describe('AR - CED - CB - Verify Duplicated Course', () =>{

    beforeEach(() => {
        //Sign into admin side as sys admin, filter for duplicated course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', `${cbDetails.courseName} - Copy`))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(arCoursesPage.getTableCellName(2)).contains(`${cbDetails.courseName} - Copy`).click()
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        //Edit course
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click()
    })

    after(function() {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'course-bundles')
        }
    })

    it('Verify Duplicated Course and Make Edits', () => {
        cy.viewport(1600,900)
        //Verify course is inactive by default and set to active
        arCBAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())

        //Verify enrollment rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
       
        ARCourseSettingsEnrollmentRulesModule.getVerifyRadioBtn('All Learners')

        //Verify visibilty rules were duplicated
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
       
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + arCBAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify availability access date persisted
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
      
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTxtF()).should('have.value', commonDetails.date)

        //Verify other fields were duplicated (description, language, etc) and edit them
        cy.get(arCBAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(arCBAddEditPage.getGeneralLanguageDDown()).should('contain.text', cbDetails.language)

        //Verify added course was duplicated
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')

        //Add a second course
        cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click()
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])
        //Verify Duplicated course can be published
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Verify Duplicated Course Persisted', () => {
        //Verify duplicated course fields and edits persisted
        arCBAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())
        cy.get(arCBAddEditPage.getDescriptionTxtF()).should('contain.text', commonDetails.appendText)

        //Verify added courses 
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
        cy.get(arCBAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).should('exist')

        //Verify admin has the option to duplicate the course from the edit page
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Duplicate')).should('have.attr', 'aria-disabled', 'false')
    })
})