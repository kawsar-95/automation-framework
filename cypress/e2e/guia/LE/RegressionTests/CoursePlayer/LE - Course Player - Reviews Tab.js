import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import {ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEUploadFileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEUploadFileModal'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'


describe('C2975 AUT-393, LE - Course Player - Reviews Tab', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        // Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOnNextgenToggle()
    })

    after(() => {
        // Delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click({force: true})  
        LEDashboardPage.getMediumWait()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force: true})
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })

        // Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()

        // Delete Created Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Online Course, enable Allow Comments and Course Rating Also enroll the Learner', () =>{ 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course')

        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()

        // Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click().click()
        ARDashboardPage.generalToggleSwitch('true', ARCourseSettingsAttributesModule.getCourseRatingsEnabledContainer())

        // Open Social Section where allow comments toggle belongs
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        ARDashboardPage.generalToggleSwitch('true', ARCourseSettingsSocialModule.getAllowCommentsToggleContainer())

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')

        // Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username]) 
    })

    it('Log in as the learner and launch this course', () =>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()

        //Start Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 15000}).should('not.exist', {timeout: 10000})
        cy.get(LECourseDetailsOCModule.getStartBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // // Check the Overview tab
        cy.get(LECourseDetailsOCModule.getSingleStarRating()).should('contain', 0)
        cy.get(LECourseDetailsOCModule.getRateCourseBtn()).should('contain', 'Rate This Course').click()

        // Rate the course, select from 1 to 5 stars
        cy.get(LECourseDetailsOCModule.getRatingStarBtn()).eq(3).click()
        cy.get(LECourseDetailsOCModule.getRatingLabel()).should('contain', 'Your rating')

        // Add a comment
        cy.get(LECourseDetailsOCModule.getCommentTextArea()).type(currDetails.postComment)
        cy.get(LEDashboardPage.getFileInput()).first().attachFile(`${commonDetails.filePath}${commonDetails.posterImgName}`)
        cy.get(LEUploadFileModal.getUploadedFileMsg()).should('contain', 'Upload verified')
        cy.get(ARDashboardPage.getSubmitBtn()).contains('Post Comment').scrollIntoView().should('not.have.attr', 'disabled')
        cy.get(ARDashboardPage.getSubmitBtn()).contains('Post Comment').click({force:true})
        cy.get(LECourseLessonPlayerPage.getButtonLoader(), {timeout: 15000}).should('not.exist')

        // Review a comment in the Reviews tab
        cy.get(LECourseDetailsOCModule.getCommentContainer()).should('contain', currDetails.postComment)

        // Click on Reply to add a reply, then click on Cancel to close this text box
        cy.get(LECourseDetailsOCModule.getReplyBtn()).first().click()
        cy.get(LECourseDetailsOCModule.getReplyTextArea()).type(currDetails.commentReply_1)
        cy.get(LECourseDetailsOCModule.getCancelBtn()).scrollIntoView().click({force:true})

        // Add a reply to an existing comment
        cy.get(LECourseDetailsOCModule.getReplyBtn()).first().click()
        cy.get(LECourseDetailsOCModule.getReplyTextArea()).type(currDetails.commentReply_1)
        cy.get(LECourseDetailsOCModule.getReplyUploadFile()).attachFile(`${commonDetails.filePath}${commonDetails.thumbnailImgName}`)
        cy.get(LEUploadFileModal.getUploadedFileMsg()).should('contain', 'Upload verified')

        cy.get(ARDashboardPage.getSubmitBtn()).contains('Reply').scrollIntoView().should('not.have.attr', 'disabled')
        cy.get(ARDashboardPage.getSubmitBtn()).contains('Reply').click({force:true})
        cy.get(LECourseLessonPlayerPage.getButtonLoader(), {timeout: 15000}).should('not.exist')

        // Minimize/Maximize this section via the arrow
        cy.get(LECourseDetailsOCModule.getCommentContainer()).should('contain', currDetails.commentReply_1)
        cy.get(LECourseDetailsOCModule.getHideRepliesBtn()).should('be.visible').click()
        cy.get(LECourseDetailsOCModule.getCommentContainer()).should('not.contain', currDetails.commentReply_1)
        cy.get(LECourseDetailsOCModule.getShowRepliesBtn()).should('be.visible').click()
        cy.get(LECourseDetailsOCModule.getCommentContainer()).should('contain', currDetails.commentReply_1)

        // Click on the attachment link and Attachments will open into a new tab 
        cy.get(LECourseDetailsOCModule.getAttachmentLink()).first().should('have.attr', 'target', '_blank')
        cy.get(LECourseDetailsOCModule.getRepliesContainer() + " " + LECourseDetailsOCModule.getAttachmentLink()).should('have.attr', 'target', '_blank')

        // Edit the Comment
        cy.get(LECourseDetailsOCModule.getCommentOptionsBtn()).first().click()
        cy.get(LECourseDetailsOCModule.getEditCommentBtn()).click()
        cy.get(LECourseDetailsOCModule.getReplyTextArea()).type(commonDetails.appendText)
        cy.get(ARDashboardPage.getSubmitBtn()).contains('Save').scrollIntoView().should('not.have.attr', 'disabled')
        cy.get(ARDashboardPage.getSubmitBtn()).contains('Save').click({force:true})
        cy.get(LECourseLessonPlayerPage.getButtonLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LECourseDetailsOCModule.getCommentContainer()).should('contain', `${currDetails.postComment}${commonDetails.appendText}`)

        // Delete the Reply
        cy.get(LECourseDetailsOCModule.getRepliesContainer() + " " + LECourseDetailsOCModule.getCommentOptionsBtn()).first().click()
        cy.get(LECourseDetailsOCModule.getDeleteCommentBtn()).click()
        cy.get(LECourseDetailsOCModule.getCommentContainer()).should('not.contain', currDetails.commentReply_1)

        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
    })

    it('Log in as Unenrolled learner', () =>{
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEDashboardPage.getShortWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()

        //Start Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 15000}).should('not.exist')
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getToastNotificationMsg()).should("contain","You have been successfully enrolled.")
        cy.get(LECourseLessonPlayerPage.getButtonLoader(), {timeout: 15000}).should('not.exist')

        // Check the Overview tab
        cy.get(LECourseDetailsOCModule.getSingleStarRating()).should('contain', 4)
        cy.get(LECourseLessonPlayerPage.getTabBtn()).contains('Reviews').click({force:true})

        // Rate the course, select from 1 to 5 stars
        cy.get(LECourseDetailsOCModule.getRatingStarBtn()).eq(2).click()
        cy.get(LECourseDetailsOCModule.getRatingLabel()).should('contain', 'Your rating')

        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // re-launch the course player
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Check the Overview tab
        cy.get(LECourseDetailsOCModule.getSingleStarRating()).should('contain', 3.5)
        cy.get(LECourseLessonPlayerPage.getTabBtn()).contains('Reviews').click({force:true})

        // Add new comment
        cy.get(LECourseDetailsOCModule.getCommentTextArea()).first().type(currDetails.postComment2)
        cy.get(ARDashboardPage.getSubmitBtn()).contains('Post Comment').scrollIntoView().should('not.have.attr', 'disabled')
        cy.get(ARDashboardPage.getSubmitBtn()).contains('Post Comment').click({force:true})

        // Review a comment in the Reviews tab
        cy.get(LECourseDetailsOCModule.getCommentContainer()).should('contain', currDetails.postComment2)

        // verify that you're automatically following this post
        LECourseDetailsOCModule.followPost(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        // Learners can choose to follow another contributor's comments
        LECourseDetailsOCModule.followPost(`${defaultTestData.USER_LEARNER_FNAME} ${defaultTestData.USER_LEARNER_LNAME}`, 'Follow')

        // Learner can unfollow both their comments and other contributors’ comments
        LECourseDetailsOCModule.unfollowPost(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        LECourseDetailsOCModule.unfollowPost(`${defaultTestData.USER_LEARNER_FNAME} ${defaultTestData.USER_LEARNER_LNAME}`)

        // ‘Helpful?’ is no longer displayed if learner clicks the thumbs up
        LECourseDetailsOCModule.markAsHelpful(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)
        LECourseDetailsOCModule.markAsHelpful(`${defaultTestData.USER_LEARNER_FNAME} ${defaultTestData.USER_LEARNER_LNAME}`)
        LECourseDetailsOCModule.removeMarkAsHelpful(`${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        //Avatar and contributor’s name are clickable
        cy.get(LECourseDetailsOCModule.getCommentAuthor()).contains(`${defaultTestData.USER_LEARNER_FNAME} ${defaultTestData.USER_LEARNER_LNAME}`).click()

        // display social profile flyout        
        cy.get(LECourseDetailsOCModule.getSocialProfileFlyoverContainer()).should('be.visible')
        cy.get(LECourseDetailsOCModule.getCommentAuthor()).contains(`${defaultTestData.USER_LEARNER_FNAME} ${defaultTestData.USER_LEARNER_LNAME}`).click()

        //Avatar are clickable
        cy.get(LECourseDetailsOCModule.getSocialProfileFlyoverContainer()).should('not.exist')
        cy.get(LECourseDetailsOCModule.getAuthorAvatar()).first().click()
        cy.get(LECourseDetailsOCModule.getSocialProfileFlyoverContainer()).should('be.visible')

        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
    })
})

