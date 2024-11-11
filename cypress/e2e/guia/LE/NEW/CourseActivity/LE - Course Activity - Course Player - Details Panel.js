import { users } from '../../../../../../helpers/TestData/users/users'
import { resourcePaths, videos} from '../../../../../../helpers/TestData/resources/resources'
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

describe('LE - Course Activity - Course Activity - Course Player - Details Panel', function(){
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

    it('Verify Lesson Player Details Panel, Lesson & Course Name, Description & Chapter', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessonObjects.objectName, 'Start', true)
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).should('be.visible', {timeout: 9000})
        //Verify Course Details is selected by default
        cy.get(LECourseLessonPlayerPage.getLessonPlayerHorizontalTabBtn()).should('have.attr', 'aria-current', 'page').contains('Course Details')
        cy.get(LECourseLessonPlayerPage.getCourseDetailsCourseName()).contains(ocDetails.courseName)
        cy.get(LECourseLessonPlayerPage.getCourseDetailsCourseDescription()).contains(ocDetails.description)
        cy.get(LECourseLessonPlayerPage.getLessonPlayerHorizontalTabBtn()).contains('Lesson Details').click({force:true})
        cy.get(LECourseLessonPlayerPage.getLessonDetailsLessonName()).contains(lessonObjects.objectName)
        cy.get(LECourseLessonPlayerPage.getLessonDetailsChapterName()).contains('Chapter 1')
        cy.get(LECourseLessonPlayerPage.getLessonDetailsLessonDescription()).contains(lessonObjects.ocObjectDescription)
        cy.get(LECourseLessonPlayerPage.getXBtn()).click()
    })
    
        


        
        

})