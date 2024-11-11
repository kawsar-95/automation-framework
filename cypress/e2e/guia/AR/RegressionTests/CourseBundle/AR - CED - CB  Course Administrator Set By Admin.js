import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { cbDetails } from '../../../../../../helpers/TestData/Courses/cb'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'


describe('C841,C953 AR - CED - CB  Course Administrator Set By Admin', function () {

    it('Create Course Bundle Only with Department Editor, No Primary or Additional Editor is Added', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Course Bundle', cbDetails.courseName)
       
        //Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
      
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
       

        

        //Open Course Administrators Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Administrators')).click()
       

        //Select Department Course Visibilty Radio Button
        cy.get(ARCourseSettingsCourseAdministratorsModule.getCourseVisibilityRadioBtn()).contains('Department').click()
      
        //Add Visibility Rule
        cy.get(ARCourseSettingsCourseAdministratorsModule.getDepartmentVisibilityAddRuleBtn()).click()

        //Verify Error message
        cy.get(ARCourseSettingsCourseAdministratorsModule.getElementByDataNameAttribute('courseVisibleToDepartments')).within(() => {
            cy.get(ARCourseSettingsCourseAdministratorsModule.getElementByDataNameAttribute('error'), { timeout: 6000 }).should('have.text', 'Each Rule Must Have A Selected Department')
        })

        // Verify Publish button is disabled
        cy.get(ARCoursesPage.getPublishBtn(), { timeout: 6000 }).should('have.attr', 'aria-disabled', 'true')

        //'Select Department' button is displayed
        cy.get(ARCoursesPage.getElementByDataNameAttribute('department-availability-rule')).find('button').should('have.text', 'Select Department')

        //Delete button is displayed
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Rule Filters')).find('button').should('exist')

        // drop-drown with 'Single Department' and 'Include All Sub-Departments' as options is displayed
        cy.get(ARCoursesPage.getElementByTitleAttribute('Single Department')).should('exist')
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Operator')).eq(1).find('li').eq(1).should('have.text', 'Include All Sub-Departments')


        // Click  'Select Department' button
        cy.get(ARCourseSettingsCourseAdministratorsModule.getVisibilityRuleSelectDepartmentBtn()).click()

        // Verify 'Select Department' modal pops out
        cy.get(ARCoursesPage.getElementByDataNameAttribute('dialog-title')).should('have.text', 'Select Department')

        //Select DepartmentC
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(departments.Dept_C_name);
        cy.get(ARSelectModal.getFirstSelectOpt()).click();
       
        cy.get(ARSelectModal.getChooseBtn()).contains('Choose').click();
        

        //Publish Course Bundle
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Edit CourseBundle, Authorized  Department Editor Can View/Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentC Admin is Allowed to view/edit the course
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()

        //Authorize department admin can edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARCoursesPage.getTableCellName(2)).contains(cbDetails.courseName).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Auuthorized admin can edit/view the course, edit button is enabled
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')
    })

    it('Edit Course Bundle, Unauthorized  Department Editor Can not View/Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentE Admin is not allowed to view/edit the course
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()

        //Unauthorized admin can not edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARCoursesPage.getNoResultMsg()).should('have.text', "No results found.");

    })

    it('Edit Course Bundle, Add Primary Editor, no Additional Editor is Added', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.editCourse(cbDetails.courseName)

        // Select a Department for Primary Department Editor
        cy.get(ARCourseSettingsCourseAdministratorsModule.getSelectPrimaryDepartmentEditorBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_C_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")

        //Publish Course Bundle After Editing
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Edit CourseBundle, Authorized Primary Department Editor Can View/Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentC Admin is Allowed to view/edit the course
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()

        //Authorize department admin can edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        ARCoursesPage.selectTableCellRecord(cbDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Auuthorized admin can edit/view the course, edit button is enabled
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('be.visible')
    })

    it('Edit Course Bundle, Unauthorized Primary Department Editor Can not View/Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentE Admin is not allowed to view/edit the course
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()
        //Unauthorized admin can not edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARCoursesPage.getNoResultMsg()).should('have.text', "No results found.");

    })

    it('Edit Course Bundle, Add Additional Editor', () => {
        //Sign into admin side as sys admin, create a course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        //Edit Course Bundle
        cy.editCourse(cbDetails.courseName)

        // Add Additional Admin Editor
        ARDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).scrollIntoView()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsDDown()).click()
        ARDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsSearchTxtF())
            .type(users.depAdminDEPTC.admin_dep_fname + ' ' + users.depAdminDEPTC.admin_dep_lname)

          cy.get(ARCourseSettingsCourseAdministratorsModule.getAdditionalAdminEditorsOpt())
            .contains(users.depAdminDEPTC.admin_dep_fname + ' ' + users.depAdminDEPTC.admin_dep_lname).click()
      
        //Publish Course Bundle After Editing
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit CourseBundle, Authorized Additional Department Editor Can View/Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentC Admin is Allowed to view/edit the course
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()

        //Authorize department admin can edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARCoursesPage.getTableCellName(2)).contains(cbDetails.courseName).click()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))

        //Asserting Auuthorized admin can edit/view the course, edit button is enabled
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).should('be.visible')
    })

    it('Edit Course Bundle, Unauthorized Additional Department Editor Can not View/Edit The Course', () => {
        //Sign into admin side as department admin, navigate to Courses
        //DepartmentE Admin is not allowed to view/edit the course
        cy.apiLoginWithSession(users.depAdminDEPTE.admin_dep_username, users.depAdminDEPTE.admin_dep_password, '/admin')
        ARDashboardPage.getCoursesReport()

        //Unauthorized admin can not edit the course
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', cbDetails.courseName))
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARCoursesPage.getNoResultMsg()).should('have.text', "No results found.");

    })

    after(function () {
        //Delete Course Bundle
        let set = new Set(commonDetails.courseIDs);
        const array = Array.from(set)
        for (let i = 0; i < array.length; i++) {
            cy.deleteCourse(array[i],'course-bundles')
        }
    })
})