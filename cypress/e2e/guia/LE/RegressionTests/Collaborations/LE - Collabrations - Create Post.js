import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails} from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import { lessonVideo, ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { lessons, resourcePaths, videos } from '../../../../../../helpers/TestData/resources/resources'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'

const infuse = 'https://guiaar.qa.myabsorb.com/#/course-player/17898952-ebf1-451a-b5bb-75db8f493917'

describe('T98582 GUIA-Story - NLE-3708 - Course Player - Collaborations Activity / Create Post', function(){

    before(function () {
         
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin as an admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOnNextgenToggle()
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Collaborations
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
        
    })
    
    after(function () {
        //Signin as an admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOffNextgenToggle()
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID)
        //Delete user via API
        cy.deleteUser(userDetails.userID)
    })


    it('Verify Collaboration is created', () => {
        ARDashboardPage.getCollborationsReport()
        //Create new collaboration
        cy.wrap(ARCollaborationAddEditPage.WaitForElementStateToChange(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Add Collaboration'), 1000))
        cy.get(ARCollaborationAddEditPage.getAddEditMenuActionsByName('Add Collaboration')).click()
    
        //Set collaboration to ACTIVE
        cy.get(ARCollaborationAddEditPage.getStatusToggleContainer() + ' ' + ARCollaborationAddEditPage.getToggleDisabled()).click()
        //Fill in required fields
        cy.get(ARCollaborationAddEditPage.getNameTxtF()).type(collaborationDetails.collaborationName)
        ARCollaborationAddEditPage.WaitForElementStateToChange(ARCollaborationAddEditPage.getSaveBtn())

    })

    it('Create Online Courses with Learning Assesement with Questionnire and Video Lesson with Proctor login enabled', () =>{
        //Sign into admin side as sys admin, navigate to Courses
         cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
         ARDashboardPage.getCoursesReport()
         cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
         cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
         ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Video File Object Lesson Desktop Iframe
         cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
         ARSelectLearningObjectModal.getObjectTypeByName('SCORM 1.2')
        //Clicking on Next Button
         cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
         cy.get(ARUploadFileModal.getChooseFileBtn(),{timeout:10000}).should('be.visible')
        //Uploading Zip the file in the Upload modal
         cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
         cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.turtles_scorm12_filename)
         cy.get(ARUploadFileModal.getScormAddFileContinueBtn()).click()
         cy.get(ARDashboardPage.getWaitSpinner(),{timeout:20000}).should('not.exist')
         cy.get(ARUploadFileModal.getScormApplyBtn(),{timeout:10000}).should('be.visible')
         cy.get(ARUploadFileModal.getScormApplyBtn()).click()
        //Add Video Lesson Object to the course
         cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
         ARSelectLearningObjectModal.getObjectTypeByName('Video')
         cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
         ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '2', 'true', '640', '480', 'URL', null, null, 'File', resourcePaths.resource_video_folder_selectFile, videos.subtitles_video_mp4, 'false', 'true')
         //Add learning object Assessment  
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social'),{timeout:10000}).should('be.visible')    
        //Open Social Settings
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click().click()  
        //Verify Multiple Collaborations can be Added to Each Course Type
        cy.get(ARCourseSettingsSocialModule.getCollaborationsDDown()).click()
            for (let j = 0; j < collaborationDetails.collabNames.length; j++) {
                cy.get(ARCourseSettingsSocialModule.getCollaborationsSearchTxtF()).clear().type(collaborationDetails.collabNames[j])
                ARCourseSettingsSocialModule.getCollaborationsOpt(collaborationDetails.collabNames[j])
                AROCAddEditPage.getShortWait()
            }
            cy.get(ARCourseSettingsSocialModule.getCollaborationsDDown()).click()//Hide DDown
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        //Enroll User
         arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName,courses.oc_lesson_act_ssta_name], [userDetails.username])  
    })
}) 
//This descripbe block commentted out due to environmental issues.
// describe('T98582 GUIA-Story - NLE-3708 - Course Player - Collaborations Activity / Create Post', function(){
   
//     beforeEach(function () {
//         //Login as a learner 
//         cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        
//     })

//     after(function () {
//         //Signin as an admin and navigate to feature flags
//         cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
//         cy.get(ARDashboardPage.getCurrentUserLabel(),{timeout:10000}).should('contain',"GUI_Auto Sys_Admin_01")
//         cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
//         cy.get(ARDashboardPage.getWaitSpinner(),{timeout:10000}).should('not.exist')
//         //Select Account Menu 
//         cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
//         //Select Portal Setting option from account menu
//         cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
//         //Validate portal setting page header
//         cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
//         cy.get(ARDashboardPage.getUsersTab()).click()
//         //Turn on next gen toggle button
//         AREditClientUserPage.getTurnOffNextgenToggle() 
//         cy.get(AREditClientUserPage.getSaveBtn()).click()
//         //Navigate to dashboard page
//         cy.url().should('contain','admin/dashboard')
//         //Delete the course 
//         cy.deleteCourse(commonDetails.courseID)
//         //Delete user via API
//         cy.deleteUser(userDetails.userID)
//     })

//     it('', ()=> {
//         LEDashboardPage.getTileByNameThenClick('Collaborations')
//         //Create Post from All Collaborations Activity Page
//         cy.get(LECollaborationPage.getCreatePostBtn()).click()
//         cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(`0 - ${collaborationDetails.postSummary}`)

//     })

//     it('',()=>{

//         cy.get(LEDashboardPage.getNavMenu()).click()
//         LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
//         cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        
//        
//         LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
//         LEDashboardPage.getSpecificCourseCardBtnThenClick(ocDetails.courseName)
//         cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
//         cy.get(LEDashboardPage.getAssessmentStart()).click()
//         for (let i = 0; i < collaborationDetails.collabNames.length; i++) {
//             ARDashboardPage.getShortWait()
//             cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Collaborations').should('exist').and('be.visible').click()
//             cy.get(ARCollaborationAddEditPage.getViewAllRelatedCollaborationsBtn(),{timeout:10000}).should('be.visible')

//             cy.get(ARCollaborationAddEditPage.getViewAllRelatedCollaborationsBtn()).click()
//             cy.get(ARCollaborationAddEditPage.getViewCollabrationBtn(),{timeout:10000}).should('be.visible')
//             cy.get(ARCollaborationAddEditPage.getViewCollabrationBtn()).eq(i).invoke('text').then((text) => {
//                 expect(text).to.be.equal(collaborationDetails.collabNames[i])
//             })
            
//             cy.get(ARCollaborationAddEditPage.getViewCollabrationBtn()).eq(i).click()
//             cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
//             cy.get(LECourseLessonPlayerPage.confirmPopup()).click()
        
//             cy.get(ARCollaborationAddEditPage.getCollabPageHeader()).should('contain',`${collaborationDetails.collabNames[i]}`)
//             cy.get(LECollaborationPage.getCreatePostBtn()).should('be.visible')
//             cy.go('back')
//             cy.go('back')
//             cy.get(LECatalogPage.getCourseDetailExpandUpArrow(),{timeout:10000}).should('be.visible')
//             cy.get(LECatalogPage.getCourseDetailExpandUpArrow()).click()
//         }

//         //Verify there is No Activity in the Right Pane
//         cy.get(LECoursesPage.getNoActivityTitle()).should('contain', 'Start the Conversation')

//         //Verify the Create Post Button
//         cy.get(LECoursesPage.getCreatePostBtn()).click()
//         cy.get(LECreateCollaborationPostModal.getModalTitle()).should('contain', 'Create Post')
//         cy.get(LECreateCollaborationPostModal.getModalCloseBtn()).click()     
     
//         ARDashboardPage.getShortWait()
//         cy.visit(infuse)
        
//         cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('exist').and('contain','Lesson Incomplete')
//         cy.get(LECourseLessonPlayerPage.confirmPopup()).click()
//         //The Collaborations tab will not be available (nor is there an X in the top right to close the course player)
//         cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Collaborations').should('not.exist')
//         //The Discovery modal is the full mobile device width, and the resources show stacked (like it did for the desktop view)
//         cy.viewport('iphone-x')
//         LEDashboardPage.getShortWait()
//         cy.get(LECatalogPage.getCourseDetailExpandUpArrow()).click()
//         cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Collaborations').should('not.exist')
//         cy.viewport(1280, 720)

//        })
       
//     })
