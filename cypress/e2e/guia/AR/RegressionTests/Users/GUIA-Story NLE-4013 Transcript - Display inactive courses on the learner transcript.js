import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateSettingsPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage"
import LETranscriptPage from "../../../../../../helpers/LE/pageObjects/User/LETranscriptPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-795 - C7516 - GUIA-Story NLE-4013 Transcript - Display inactive courses on the learner transcript - Create Courses', () => {
    before('Create a Learner user who will enroll in all the courses for the test', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach('Login as a System Admnin and navigate to the Courses Report Page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Create Active and Inactive Online courses', () => {
        // Create an active Online course
        cy.createCourse('Online Course', ocDetails.courseName)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: null})
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])

        ARDashboardPage.getCoursesReport()
        // Create an inactive Online course
        cy.createCourse('Online Course', ocDetails.courseName2)
        AROCAddEditPage.generalToggleSwitch('false', AROCAddEditPage.getCourseIsActiveToggle())
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: null})
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName2], [userDetails.username])
    })

    it('Create Active and Inactive ILC courses', () => {
        // Create an active ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'instructor-led-courses-new'})
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username])

        ARDashboardPage.getCoursesReport()
        // Create an inactive ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName2, false)
        AROCAddEditPage.generalToggleSwitch('false', AROCAddEditPage.getCourseIsActiveToggle())
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'instructor-led-courses-new'})
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName2], [userDetails.username])
    })

    it('Create Active and Inactive Curriculum courses', () => {
        // Create an active Curriculum course
        cy.createCourse('Curriculum', currDetails.courseName)
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'curricula'})
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])

        ARDashboardPage.getCoursesReport()
        // Create an active Curriculum course
        cy.createCourse('Curriculum', currDetails.courseName2)
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])        
        AROCAddEditPage.generalToggleSwitch('false', AROCAddEditPage.getCourseIsActiveToggle())
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'curricula'})
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName2], [userDetails.username])
    })
})

describe('AUT-795 - C7516 - GUIA-Story NLE-4013 Transcript - Display inactive courses on the learner transcript - Validate Steps', () => {
    after('Delete the Learner user and the courses created for the test', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.deleteUsers([userDetails.username])
        LEManageTemplateSettingsPage.turnOnOffEnableShowingInactiveCoursesInTranscriptBtn('false')
        let i = 0
        for (; i < commonDetails.courseIDs.length; i++) {
            let course = commonDetails.courseIDs[i]
            if (course.type === null) {
                cy.deleteCourse(course.id)
            } else {
                cy.deleteCourse(course.id, course.type)
            }
        }
    })

    it('Enable the "Show Inactive Courses on Transcript" toggle', () => {
        // Enable showing inactive courses on learner transcript
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '#/login')
        LEManageTemplateSettingsPage.turnOnOffEnableShowingInactiveCoursesInTranscriptBtn('true')
    })

    it('Verify Active and Inactive courses in User Transcript', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, '#/login')
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript')
        LEDashboardPage.getVLongWait()

        // Verify that the both the active and inactive online courses are displayed
        cy.get(LETranscriptPage.getCourseNameCellInTranscriptTable(), {timeout: 5000}).contains(ocDetails.courseName)
        cy.get(LETranscriptPage.getCourseNameCellInTranscriptTable()).contains(ocDetails.courseName2)

        // Verify that the both the active and inactive ILC courses are displayed
        cy.get(LETranscriptPage.getCourseNameCellInTranscriptTable(), {timeout: 5000}).contains(ilcDetails.courseName)
        cy.get(LETranscriptPage.getCourseNameCellInTranscriptTable()).contains(ilcDetails.courseName2)

        // Verify that the both the active and inactive Curriculum courses are displayed
        cy.get(LETranscriptPage.getCourseNameCellInTranscriptTable(), {timeout: 5000}).contains(currDetails.courseName)
        cy.get(LETranscriptPage.getCourseNameCellInTranscriptTable()).contains(currDetails.courseName2)
    })
})