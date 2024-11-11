import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { comments } from '../../../../../../helpers/TestData/users/social'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'

let userNames = [userDetails.username, userDetails.username2, userDetails.username3];
let learnerComments = [comments.commentFromLearner, comments.commentFromLearner2, comments.commentFromLearner3];

describe('LE - Social Profile - Learner can view their own Social Profile (Comments) - Add Comments', function(){
    
    before(function() {
        //Create 3 new users
        for (let i = 0; i < 3; i++) {
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
        }

        //Create OC course with comments enabled
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getLShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        LEDashboardPage.getLShortWait()
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsToggle()).click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    for (let i = 0; i < userNames.length; i++) {
        it(`Learner ${i+1} - Enroll in Course and Leave a Comment, Verify Comments`, () => {
            cy.apiLoginWithSession(userNames[i], userDetails.validPassword)
            //Enroll in course and select it 
            LEDashboardPage.getTileByNameThenClick('Catalog')
            LEFilterMenu.getSearchAndEnrollInCourseByName(ocDetails.courseName)
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
            LEDashboardPage.getSpecificCourseCardBtnThenClick(ocDetails.courseName)
            LEDashboardPage.getLShortWait()
            LECoursesPage.getCoursesPageTabBtnByName('Comments')
            cy.get(LECoursesPage.getCourseCommentTxtF()).type(learnerComments[i])
            cy.get(LECoursesPage.getCourseCommentPostBtn()).click()
            LEDashboardPage.getShortWait()

            if (i === userNames.length - 1) {
                //Verify all comments are displayed
                for (let j = 0; j < learnerComments.length; j++ ) {
                    cy.get(LECoursesPage.getCommentTxt()).should('contain', learnerComments[j])
                }
            }

            //Get user IDs for deletion later
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userIDs.push(currentURL.slice(-36));
            })
        })
    }
})

describe('LE - Social Profile - Learner can view their own Social Profile (Comments) - Deactivate and Delete Users', function(){

    beforeEach(() => {
        //Login, navigate to user's report before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
    })

    it('Admin - Set Learner 2 as Inactive & Delete Learner 3', () => {
        cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', userDetails.username2))
        cy.get(arDashboardPage.getTableCellName(4)).contains(userDetails.username2).click();
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        LEDashboardPage.getMediumWait()
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getIsActiveToggleContainer()) + ' ' + ARUserAddEditPage.getToggleEnabled()).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arDashboardPage.getSaveBtn()).click()

        //Delete learner 3
        cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', userDetails.username3))
        cy.get(arDashboardPage.getTableCellName(4)).contains(userDetails.username3).click();
        ARDeleteModal.getDeleteItem()
    })
})

describe('LE - Social Profile - Learner can view their own Social Profile (Comments) - Verify Comments & Social Profile', function(){

    beforeEach(() => {
        //Login, navigate to course comments before each test
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getVLongWait()  //wait for comments to update
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getSpecificCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECoursesPage.getCoursesPageTabBtnByName('Comments')
    })

    after(function() {
        //Cleanup - delete Learner 1, 2 and course
        cy.deleteUser(userDetails.userIDs[0]);
        cy.deleteUser(userDetails.userIDs[1]);
        cy.deleteCourse(commonDetails.courseID);
    })

    it('Learner 1 - Verify Correct Comments Exist and Learner 2 and 3 Social Profile Cannot Be Accessed', () => {
        //Verify learner 1 and 2 comments exists
        cy.get(LECoursesPage.getCommentTxt()).should('contain', learnerComments[0])
        cy.get(LECoursesPage.getCommentTxt()).should('contain', learnerComments[1])
        //Verify learner 3 comment does exist
        cy.get(LECoursesPage.getCommentTxt()).should('contain', learnerComments[2])

        //Verify Learner 2 is displayed as inactive
        cy.get(LECoursesPage.getCommentTxt()).contains(learnerComments[1]).parents(LECoursesPage.getCommentContainer())
            .should('contain', '(Inactive)')

        
        
            // TO BE COMPLETED ONCE NLE-3733 IS DONE
        
        //Verify Learner 3 is displayed as inactive and their social profile cannot be accessed


        //todo
    })
})

