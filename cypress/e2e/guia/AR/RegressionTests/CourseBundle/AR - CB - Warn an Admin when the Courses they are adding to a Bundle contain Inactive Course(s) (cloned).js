import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7334 - AUT-275, AR - CB - Warn an Admin when the Courses they are adding to a Bundle contain Inactive Course(s) (cloned)', () => {
    before(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course')

        // Set Status Toggle Off
        ARCoursesPage.generalToggleSwitch('false',ARILCAddEditPage.getGeneralStatusToggleContainerName())

        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        // Create ILC course
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        // Set Status Toggle Off
        ARCoursesPage.generalToggleSwitch('false',ARILCAddEditPage.getGeneralStatusToggleContainerName())

        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    after('Delete Courses', () => {
        cy.deleteCourse(commonDetails.courseID, 'course-bundles')
        cy.deleteCourse(commonDetails.courseIDs[0])
        cy.deleteCourse(commonDetails.courseIDs[1], 'instructor-led-courses-new')
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Create a Course Bundle', () => {
        cy.createCourse('Course Bundle')
      
        // Add inactive online course and ILC
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName, ilcDetails.courseName, courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')

        // verify warning message
        cy.get(ARCBAddEditPage.getInactiveCourseNotification()).should('contain', `Contains the following inactive courses: ${ocDetails.courseName}, ${ilcDetails.courseName}`)

        // Publish Course
        cy.publishCourse()
    })

    it('Edit Course Bundle', () => {
        cy.editCourse(cbDetails.courseName)
      
        // Remove inactive course
        ARCBAddEditPage.removeCourseByName(ocDetails.courseName)

        // verify course is removed from the warning
        cy.get(ARCBAddEditPage.getInactiveCourseNotification()).should('contain', `Contains the following inactive courses: ${ilcDetails.courseName}`)

        // Remove all inactive courses
        ARCBAddEditPage.removeCourseByName(ilcDetails.courseName)

        // verify warning message removed
        cy.get(ARCBAddEditPage.getInactiveCourseNotification()).should('not.exist')
        
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })
})