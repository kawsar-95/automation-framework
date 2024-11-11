import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import { resourcePaths, images, videos} from '../../../../../../helpers/TestData/resources/resources'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import {  lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import { lessonAssessment } from '../../../../../../helpers/TestData/Courses/oc'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'

const description = 

describe('T151420 - AUT377 -  GUIA-Story NLE-4041 : Course Player - Implement expand / collapse of course details ', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
    })
    
    after(function () {
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID)
    })
    
    it('Create Online Course with Video Lesson and Assesment', () =>{ 
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        arDashboardPage.getMediumWait()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        arDashboardPage.getShortWait()
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).click()        
        arDashboardPage.getMediumWait()
        //Add Video Lesson Object to the course
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '2', 'true', '640', '480', 'URL', null, null, 'File', resourcePaths.resource_video_folder_selectFile, videos.subtitles_video_mp4, 'false', 'true')
        //Add learning object Assessment  
        LEDashboardPage.getShortWait()      
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        //Edit course and add a long description
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        cy.editCourse(ocDetails.courseName)
        cy.get(AROCAddEditPage.getDescriptionTxtF()).type(ocDetails.longDescription)
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
           commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        LEDashboardPage.getShortWait()        
    })

    it('Verfiy that the new course player expand/collapse course details feature works as expected',()=>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        //Verify that double up/down chevron buttons work as expected
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsBtn()).should('exist').click()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getCourseDetailsModalContainer()).should('have.attr','class').should('include','expanded')
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsBtn()).should('exist').click()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsUpBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getCourseDetailsModalContainer()).should('have.attr','class').should('not.include','expanded')
        //Vefiy that Collapse Details Button works as expected
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsBtn()).should('exist').click()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getCourseDetailsModalContainer()).should('have.attr','class').should('include','expanded')
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).should('exist').click()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsUpBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getCourseDetailsModalContainer()).should('have.attr','class').should('not.include','expanded')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        //Detele the user
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEDashboardPage.getVShortWait()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

})    