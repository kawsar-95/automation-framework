import ARReportsPage from "../../../../../../helpers/AR/pageObjects/ARReportsPage";
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsAvailabilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { users } from "../../../../../../helpers/TestData/users/users";
ARAddMoreCourseSettingsModule

describe('C7330 - AE Regression - Course Bundle- Availability - Access Date (cloned)', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

    })

    after(() => {
        //Delete Course Bundle
        cy.deleteCourse(commonDetails.courseIDs, 'course-bundles')
    })

    it('Add/Edit course bundle and access date then publish', () => {
      
        // Go to users page
        ARDashboardPage.getCoursesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Course Bundle')).should('have.attr','aria-disabled','false').click()
        cy.createCourse('Course Bundle', cbDetails.courseName)
        // Add course to course bundle
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        //Availability section - add access data
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).dblclick()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioButton()).eq(0).click() 
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(commonDetails.date)
        ARDashboardPage.getShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })
    
    })