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

describe('T284798 - AUT380 -  GUIA-Story NLE-4038 - Course Player - Implement all view modes in course player ', function () {
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
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])        
    })

    it('Create Online another Course with a single lesson to verfiy no sidebar will display, for step 6', () =>{ 
       //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', ocDetails.courseName2)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
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
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName2], [userDetails.username])        
    })    

    it('Verfiy that the new course player tooltips is available',()=>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        //Combined view displays the sidebar and details pane 
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Combined')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewCombinedBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getSidebarMenuContainer()).should('exist')
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('exist')
        //Sidebar view displays the sidebar and the details pane is minimized
        //Tabs in the sidebar view are clickable, when clicked details pane expands
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Sidebar')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewSidebarBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('not.exist')
        LECourseLessonPlayerPage.getTabMenuItemsByName('Lesson Details')
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('exist')
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        LECourseLessonPlayerPage.getTabMenuItemsByName('Overview')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).should('exist').click()
        //Details view displays the details pane
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Details')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewDetailsBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('exist')
        //Compact view displays the minimized details pane 
        //Tabs in the compact view are clickable, when clicked details pane expands 
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist')
        LECourseLessonPlayerPage.getSelectViewMenuItemsByName('Compact')
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewCompactBtn()).should('exist')
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('not.exist')
        //Once learner changes view, course player will remember learner’s view setting upon next launch
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LECourseLessonPlayerPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getChooseViewBtn()).should('exist').click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getViewCompactBtn()).should('exist')
        LECourseLessonPlayerPage.getVShortWait()
    })

    it('Verfiy that no sidebar will display with a single lesson course',()=>{
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName2).click()
        //Start 1st Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).click()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        //Verfiy no sidebar will display
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getSidebarMenuContainer()).should('not.exist')
        //Detele the user
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getModalCloseBtn()).click()
        LECourseLessonPlayerPage.getVShortWait()
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEDashboardPage.getVShortWait()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
})    