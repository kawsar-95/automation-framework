import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseDetailsCurrModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - Curriculum - Groups', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Create Curriculum, Add and Rename Groups, & Publish Course', () => {
        //Create curriculum
        cy.createCourse('Curriculum')
        //Add course to curriculum group
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])

        //Verify multiple curriculum groups can be added
        let groupNames = [currDetails.defaultGroupName2, currDetails.defaultGroupName3];
        for (let i = 0; i < groupNames.length; i++) {
            cy.get(ARCURRAddEditPage.getAddGroupBtn(), {timeout:1000}).should('be.visible').click()
            cy.get(ARCURRAddEditPage.getGroupTitle(), {timeout:10000}).should('contain', groupNames[i])
            cy.get(ARCURRAddEditPage.getGroupTitle()).contains(groupNames[i]).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
                cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
            })
            ARSelectModal.SearchAndSelectFunction([courses.oc_filter_03_name])
        }

        //Verify curriculum groups can be renamed
        cy.get(ARCURRAddEditPage.getGroupTitle(), {timeout:10000}).should('contain', currDetails.defaultGroupName)
        cy.get(ARCURRAddEditPage.getGroupTitle()).contains(currDetails.defaultGroupName).parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
            cy.get(ARCURRAddEditPage.getGroupNameTxtF()).type(currDetails.curriculumGroupName)
        })

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit Curriculum, Verify Groups Saved in Correct Order, Re-Order Groups, & Publish Course', () => {
        //Edit course
        cy.editCourse(currDetails.courseName)

        //Verify curriculum groups were re-named correctly and saved in the correct order
        cy.get(ARCURRAddEditPage.getGroupTitle()).eq(0).should('contain', currDetails.curriculumGroupName)
        cy.get(ARCURRAddEditPage.getGroupTitle()).eq(1).should('contain', currDetails.defaultGroupName2)
        cy.get(ARCURRAddEditPage.getGroupTitle()).eq(2).should('contain', currDetails.defaultGroupName3)

        //Verify curriculum groups can be re-ordered- using key commands instead of drag and drop (WCAG)
        cy.get(ARCURRAddEditPage.getGroupList()).within(() => {
            //Move first group down one
            cy.get(ARCURRAddEditPage.getGripBtn()).eq(0).focus().type(' ').type('{downarrow}').type(' ')
        })

        //Publish Curriculum
        cy.publishCourse()
    })

    it('Edit Curriculum, Verify Re-Ordered Groups Saved in Correct Order, Delete Group, & Publish Course', () => {
        //Edit course
        cy.editCourse(currDetails.courseName)

        //Verify re-ordered curriculum groups were saved in the correct order
        cy.get(ARCURRAddEditPage.getGroupTitle()).eq(1).should('contain', currDetails.curriculumGroupName)
        cy.get(ARCURRAddEditPage.getGroupTitle()).eq(0).should('contain', currDetails.defaultGroupName2)
        cy.get(ARCURRAddEditPage.getGroupTitle()).eq(2).should('contain', currDetails.defaultGroupName3)

        //Verify a curriculum group can be deleted
        ARCURRAddEditPage.deleteGroupByName(currDetails.defaultGroupName3)

        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), {timeout:10000}).should('not.exist')

        //Publish Curriculum
        cy.publishCourse()
    })

    it('Enroll Learner in Curriculum', () => {
        //Enroll learner in curriculum
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })
})

describe('AR - CED - Curriculum - Groups - Verify Groups in LE', function(){

    beforeEach(() => {
        //Sign into LE, go to curriculum
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
        LEDashboardPage.getMediumWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Groups are Displayed Correctly in LE', () => {
        //Verify groups were renamed and re-ordered correctly
        cy.get(LECourseDetailsCurrModule.getGroupName()).eq(1).should('contain', currDetails.curriculumGroupName)
        cy.get(LECourseDetailsCurrModule.getGroupName()).eq(0).should('contain', currDetails.defaultGroupName2)
        //Verify deleted group does not exist
        cy.get(LECourseDetailsCurrModule.getGroupName()).contains(currDetails.defaultGroupName3).should('not.exist')
    })
})