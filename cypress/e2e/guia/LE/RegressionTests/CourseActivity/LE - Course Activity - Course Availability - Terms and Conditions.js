import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseDetailsCurrModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LETermsAndConditionsModal from '../../../../../../helpers/LE/pageObjects/Modals/LETermsAndConditions.modal'
import LECourseDetailsILCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { ocDetails, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LESelectILCSessionModal from '../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'

let courseTypes = ['online-courses', 'curricula', 'instructor-led-courses-new'];

describe('LE - Course Activity - Course Availability - Terms and Conditions - Admin Side', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport() 
    })

    it('Admin - Create New OC Course and Enable Terms & Conditions', () => { 
        cy.createCourse('Online Course')

        //Enable terms & conditions and add message
        cy.get(arOCAddEditPage.getSyllabusShowTermsAndConditionToggle() + arOCAddEditPage.getToggleDisabled()).click()
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type(commonDetails.termsAndConditions)
        
        //Add learning object
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARAddObjectLessonModal.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).type(lessonObjects.objectName)
        cy.get(ARAddObjectLessonModal.getSourceRadioBtn()).contains('Url').click()
        cy.get(ARAddObjectLessonModal.getURLTxtF()).type(miscData.remote_vide0_url)
        LEDashboardPage.getVShortWait()
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        LEDashboardPage.getShortWait()
        
        //Set enrollment rules 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getVShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Admin - Create New Curriculum Course and Enable Terms & Conditions', () => { 
        cy.createCourse('Curriculum')
        cy.get(ARSelectModal.getCancelBtn()).click()

        //Enable terms & conditions and add message
        cy.get(arOCAddEditPage.getSyllabusShowTermsAndConditionToggle() + arOCAddEditPage.getToggleDisabled()).click()
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type(commonDetails.termsAndConditions)

        //Set enrollment rules 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getVShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Admin - Create New ILC Course and Enable Terms & Conditions', () => { 
        cy.createCourse('Instructor Led', ilcDetails.courseName)

        //Enable terms & conditions and add message
        cy.get(arOCAddEditPage.getSyllabusShowTermsAndConditionToggle() + arOCAddEditPage.getToggleDisabled()).click()
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type(commonDetails.termsAndConditions)

        //Add ILC session
        ARILCAddEditPage.getAddSession()
        //Set self enrollment = All Learners
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        LEDashboardPage.getShortWait()

        //Set enrollment rules 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getVShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })
})

describe('LE - Course Activity - Course Availability - Terms and Conditions', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Signin with system admin and turn off next gen toggle
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    beforeEach(() => {
        //Sign in, navigate to catalog
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('Catalog')
    })

    after(function() {
        //Delete all courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], courseTypes[i])
        }
        //Cleanup - Delete user
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Enroll in OC Course, Accept Terms & Conditions, and Verify Course Content', () => { 
        LEFilterMenu.getSearchAndEnrollInCourseByName(ocDetails.courseName)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getSpecificCourseCardBtnThenClick(ocDetails.courseName)
        //Verify terms and conditions banner
        cy.get(LECoursesPage.getTermsAndConditionsBanner()).should('contain', 'You must agree to the Terms & Conditions before you can access the course.')
        cy.get(LECoursesPage.getTermsAndConditionsContinueBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LETermsAndConditionsModal.getTermsAndConditions()).should('contain', commonDetails.termsAndConditions)
        cy.get(LETermsAndConditionsModal.getAgreeBtn()).click()
        //Verify learner can now access course content
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessonObjects.objectName, 'Start')
    })

    it('Enroll in CURR Course, Accept Terms & Conditions, and Verify Course Content', () => { 
        LEFilterMenu.getSearchAndEnrollInCourseByName(currDetails.courseName)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getSpecificCourseCardBtnThenClick(currDetails.courseName)
        //Verify terms and conditions banner
        cy.get(LECoursesPage.getTermsAndConditionsBanner()).should('contain', 'You must agree to the Terms & Conditions before you can access the course.')
        cy.get(LECoursesPage.getTermsAndConditionsContinueBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LETermsAndConditionsModal.getTermsAndConditions()).should('contain', commonDetails.termsAndConditions)
        cy.get(LETermsAndConditionsModal.getAgreeBtn()).click()
        //Verify learner can now access course content
        LEDashboardPage.getShortWait()
        LECourseDetailsCurrModule.getGroupByName('Group 1')
    })

    it('Enroll in ILC Course, Accept Terms & Conditions, and Verify Course Content', () => { 
        LEFilterMenu.getSearchAndEnrollInCourseByName(ilcDetails.courseName)
        cy.get(LESelectILCSessionModal.getILCSessionModalContainer()).within(()=>{
        cy.get(LESelectILCSessionModal.getAddILCCartBtn()).click()
        LESelectILCSessionModal.getMediumWait()
        })
        cy.get(LECourseDetailsModal.getModalCloseBtn()).click()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEDashboardPage.getSpecificCourseCardBtnThenClick(ilcDetails.courseName)
        LECatalogPage.getShortWait()
        //Verify terms and conditions banner
        cy.get(LECoursesPage.getTermsAndConditionsBanner()).should('contain', 'You must agree to the Terms & Conditions before you can access the course.')
        cy.get(LECoursesPage.getTermsAndConditionsContinueBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LETermsAndConditionsModal.getTermsAndConditions()).should('contain', commonDetails.termsAndConditions)
        cy.get(LETermsAndConditionsModal.getAgreeBtn()).click()
        //Verify learner can now access course content
        LEDashboardPage.getShortWait()
        LECourseDetailsILCModule.getEnrollInSessionByName(ilcDetails.sessionName)
    })
})
