import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import LECourseDetailsCurrModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule'

describe('AR - Enrollments - Enrollment Update in Curriculum', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        
        //Sign into admin side, create a Curriculum with one course, enroll user in course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.createCourse('Curriculum')
        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        //Enroll user
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })

    after(function() {
        //Cleanup
        cy.deleteCourse(commonDetails.courseID, 'curricula');
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Learner Can See Available Course, Add Second Course and Second Group with Course', () => {
        //Login as learner and go directly to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, `/#/curricula/${commonDetails.courseID}`)
        //Go directly to course
        //cy.visit(`/#/curricula/${commonDetails.courseID}`)
        //Verify Available course
        cy.get(LECourseDetailsCurrModule.getCourseName(), {timeout: 60000}).contains(courses.oc_filter_01_name).should('exist')
        cy.get(LECourseDetailsCurrModule.getCourseCount()).should('contain', '1 Course(s)')
    })

    it('Add Second Course and Second Group With Course, Verify Learner Can See Updated Available Courses and Groups', () => {
        //Sign in as Sys admin and edit course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.editCourse(currDetails.courseName)

        //Add a second course to group 1
        cy.get(ARCURRAddEditPage.getAddCoursesBtn()).first().should('have.attr', 'aria-disabled', 'false').click()
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name])
        ARSelectModal.getLShortWait()
        
        //Add a second group with 1 course
        cy.get(ARCURRAddEditPage.getAddCurriculumGroupBtn()).click()
        ARCURRAddEditPage.getShortWait()
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName2).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
        })
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_03_name])
        ARSelectModal.getLShortWait()

        //Publish course
        cy.publishCourse()

        //Login as learner and go directly to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, `/#/curricula/${commonDetails.courseID}`)
        //Go directly to course
        //cy.visit(`/#/curricula/${commonDetails.courseID}`)

        //Verify all available courses and groups
        cy.get(LECourseDetailsCurrModule.getGroupName(), {timeout: 60000}).contains(currDetails.defaultGroupName).parents(LECourseDetailsCurrModule.getCurrGroupContainer())
            .within(() => {
                cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
                cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_02_name).should('exist')
                cy.get(LECourseDetailsCurrModule.getCourseCount()).should('contain', '2 Course(s)')
            })

        cy.get(LECourseDetailsCurrModule.getGroupName() , {timeout: 60000}).last().scrollIntoView().contains(currDetails.defaultGroupName2).parents(LECourseDetailsCurrModule.getCurrGroupContainer())
            .within(() => {
                cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_03_name).should('exist')
               
            })
    })

    it('Remove Second Course and Second Group, Verify Learner Cannot See Removed Courses and Group', () => {
        //Sign in as Sys admin and edit course 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        
        cy.editCourse(currDetails.courseName)

        //Delete second course from Group 1
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getCourseName()).contains(courses.oc_filter_02_name).parents(ARCURRAddEditPage.getCourseContainer())
                .within(() => {
                    cy.get(ARCURRAddEditPage.getTrashBtn()).last().click()
                })
        })
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARCURRAddEditPage.getShortWait()

        //Delete Group 2
        //cy.get(ARCURRAddEditPage.getGroupDeleteBtn(2)).click()
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName2).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
           cy.get(ARCURRAddEditPage.getGroupDeleteBtnUsingWithin()).click()
        })
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARCURRAddEditPage.getShortWait()

        //Publish course
        cy.publishCourse()

        //Login as learner and go directly to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, `/#/curricula/${commonDetails.courseID}`)
        //Go directly to course
        //cy.visit(`/#/curricula/${commonDetails.courseID}`)

        //Verify Deleted courses and group are no longer available
        cy.get(LECourseDetailsCurrModule.getGroupName(), {timeout: 60000}).contains(currDetails.defaultGroupName).parents(LECourseDetailsCurrModule.getCurrGroupContainer())
            .within(() => {
                cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_01_name).should('exist')
                cy.get(LECourseDetailsCurrModule.getCourseName()).contains(courses.oc_filter_02_name).should('not.exist')
                cy.get(LECourseDetailsCurrModule.getCourseCount()).should('contain', '1 Course(s)')
            })
        cy.get(LECourseDetailsCurrModule.getGroupName()).contains(currDetails.defaultGroupName2).should('not.exist')
    })
})