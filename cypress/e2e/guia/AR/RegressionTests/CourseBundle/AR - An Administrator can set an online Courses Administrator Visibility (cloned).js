import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arCBAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import { departments } from '../../../../../../helpers/TestData/Department/departments'

describe('C783, AR - An Administrator can set an online Courses Administrator Visibility (cloned)', function(){
    beforeEach(function() {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
    })

    after(function() {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'course-bundles')
        }
    })

    it('Verify Course Can be Duplicated', () => {
        cy.createCourse('Course Bundle')
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:1500}).should('exist')
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
       

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
    
        //Select Department Course Visibilty Radio Button
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click().click()
     
        //Add Visibility Rule
        cy.get(ARCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()

        // verify Error message
        cy.get(ARCourseSettingsCourseAdministratorsModule.getElementByDataNameAttribute('courseVisibleToDepartments')).within(()=> {
            cy.get(ARCourseSettingsCourseAdministratorsModule.getElementByDataNameAttribute('error'),{timeout:6000}).should('have.text', 'Each Rule Must Have A Selected Department')
        })
    
        // Verify Publish button is disabled
        cy.get(arCoursesPage.getPublishBtn(), {timeout:6000}).should('have.attr', 'aria-disabled', 'true')
 
        //  'Select Department' button is displayed
        cy.get(arCoursesPage.getElementByDataNameAttribute('department-availability-rule')).find('button').should('have.text', 'Select Department')

        // delete button is displayed
        cy.get(arCoursesPage.getElementByAriaLabelAttribute('Rule Filters')).find('button').should('exist')

        // Click  'Select Department' button
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).click()

        // Verify 'Select Department' modal pops out
        cy.get(arCoursesPage.getElementByDataNameAttribute('dialog-title')).should('have.text', 'Select Department')

        // Select a Department For Department Visibility
        ARSelectModal.SelectFunction(departments.dept_top_name)

        // drop-drown with 'Single Department' and 'Include All Sub-Departments' as options is displayed
        cy.get(arCoursesPage.getElementByTitleAttribute('Single Department')).should('exist')
        cy.get(arCoursesPage.getElementByAriaLabelAttribute('Operator')).eq(1).find('li').eq(1).should('have.text', 'Include All Sub-Departments')
        
        // Can have multiple rules
        // Add Another Visibility Rule
        cy.get(ARCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()

        // verify Error message
        cy.get(ARCourseSettingsCourseAdministratorsModule.getElementByDataNameAttribute('courseVisibleToDepartments')).within(()=> {
            cy.get(ARCourseSettingsCourseAdministratorsModule.getElementByDataNameAttribute('error'),{timeout:6000}).should('have.text', 'Each Rule Must Have A Selected Department')
        })

        // Verify Publish button is disabled
        cy.get(arCoursesPage.getPublishBtn(), {timeout:6000}).should('have.attr', 'aria-disabled', 'true')

        //Select a Department For Department Visibility
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).eq(1).click()
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(departments.Dept_C_name);
        cy.get(ARSelectModal.getFirstSelectOpt()).click();
     
        cy.get(ARSelectModal.getChooseBtn()).contains('Choose').click();
       

        // Edit Rule
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).eq(1).click()
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(departments.Dept_F_name);
        cy.get(ARSelectModal.getFirstSelectOpt()).click();
      
        cy.get(ARSelectModal.getChooseBtn()).contains('Choose').click();
      
        // Removed Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute('Rule Filters')).eq(1).find('button').eq(1).click()

        // Select a Department for Primary Department Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getSelectPrimaryDepartmentEditorBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.sub_dept_B_name])
        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist')

        // Add Additional Admin Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)
    

        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt())
            .contains(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname).click()
       

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        cy.get(arDashboardPage.getWaitSpinner(), {timeout:15000}).should('not.exist') 
    })
})