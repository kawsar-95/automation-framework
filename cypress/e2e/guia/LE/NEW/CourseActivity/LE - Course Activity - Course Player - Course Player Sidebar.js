import { users } from '../../../../../../helpers/TestData/users/users'
import { resourcePaths, videos, images} from '../../../../../../helpers/TestData/resources/resources'
import { defaultThemeColors } from '../../../../../../helpers/TestData/Template/templateTheme'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('LE - Course Activity - Course Activity - Course Player - Course Player Sidebar', function(){
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
      });
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Add New OC with Access Date In past and Publish OC', () => {
        cy.createCourse('Online Course', ocDetails.courseName)

        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName, 'File', resourcePaths.resource_video_folder_selectFile, videos.video_small)
        //Add a second chapter with long name and lesson
        cy.get(AROCAddEditPage.getAddChapterBtn()).click()
        AROCAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getChapterNameTxtF()).eq(1).invoke('val', ocDetails.longChapterName).type('a')
        cy.get(AROCAddEditPage.getChapterTitle()).contains(ocDetails.longChapterName).parents(AROCAddEditPage.getChapterContainer()).within(() => {
            cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        })
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.longObjectName, 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')


        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })
})



describe('LE - Course Activity - Course Activity - Object Lesson - Learner Side', function(){
    

    after(function() {
        //Delete all courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'online-courses')
        }
        
        //Cleanup - delete learner
        
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Course Player Sidebar, Lesson Name, Chapter Name, Lesson Count Pill & color status', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        //LECourseDetailsOCModule.getCourseLessonActionBtn(lessonObjects.objectName, 'Start', true)
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).should('be.visible', {timeout: 9000})
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getLessonSidebarChapterTitle()).contains(ocDetails.defaultChapterName)
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('0/1')
        cy.get(LECourseLessonPlayerPage.getLessonSidebarLessonTitle()).eq(0).contains(lessonObjects.objectName)
        //Check whether lesson count pill changes color whether Active or Upcoming
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).invoke('css', 'background-color').should('eq', defaultThemeColors.default_primary_rgb)
        //Note we cannot check visual truncation of long Chapter and Lesson Names as this is handled by the browser
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(1).find(LECourseLessonPlayerPage.getLessonSidebarChapterTitle()).contains(ocDetails.longChapterName)
        cy.get(LECourseLessonPlayerPage.getLessonSidebarLessonTitle()).eq(1).contains(lessonObjects.longObjectName)
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(1).find(LECourseLessonPlayerPage.getCountPill()).contains('0/1')
        //Check whether lesson count pill changes color whether Active or Upcoming
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(1).find(LECourseLessonPlayerPage.getCountPill()).invoke('css', 'background-color').should('eq', defaultThemeColors.default_default_rgb)
        cy.get(LECourseLessonPlayerPage.getXBtn()).click()
        
    })
    
        


        
        

})