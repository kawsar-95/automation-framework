// AR - CED - OC - Availability Section.js
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, availabilitySection, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'


describe('LE - Course Activity - Course Availability - Access Date', function(){
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin with system admin and turn off next gen toggle
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    });

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    it('Add New OC with Access Date In past and Publish OC', () => {
        cy.createCourse('Online Course', ocDetails.courseName)
        //Add Basic Object Lesson
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()

        //Select Access Date 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains(/^Date$/).click().click()
        //Select a Date and Time in Past
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(availabilitySection.Date2)
        ARCourseSettingsAvailabilityModule.getVShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTimePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.SelectTime('12', '00', 'PM')

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Add new OC with Access Date in 2 days and Publish OC', () => {  
        cy.createCourse('Online Course', ocDetails.courseName2)
        //Add Basic Object Lesson
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'Url')

        //Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()

        //Select Access 'Date' Option
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateRadioBtn()).contains(/^Date$/).click().click()
        //Select a Date and Time
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateDatePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.getSelectDate(availabilitySection.Date)
        cy.get(ARCourseSettingsAvailabilityModule.getAccessDateTimePickerBtn()).click()
        ARCourseSettingsAvailabilityModule.SelectTime('12', '00', 'PM')
        

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))

        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })
        
})

describe('LE - Course Activity - Course Availability - Access Date', function(){
    
    beforeEach(() => {
        //Login and navigate to course before each test
        cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)
    })

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

    it('Verify for Access Date Option, for 2 day In Past Access Date and Lesson Content can be started', () => {
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getShortWait()
        cy.get(LECatalogPage.getEnrollBtn()).contains('Start').click()
        LECatalogPage.getShortWait()
        cy.get(LECoursesPage.getViewOptionBtn()).click()
        LEDashboardPage.getVShortWait()
        cy.get(LECoursesPage.getDetailViewBtn()).click()
        //Verify Lesson Content Can be started
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(lessonObjects.objectName).parents(LECourseDetailsOCModule.getLessonHeader()).within(() => {
            cy.get(LECourseDetailsOCModule.getLessonBtn()).should('exist')
        })
    })

    it('Verify for Access Date Option, for 2 day in Future Access Date Course cannot be accessed', () => { 
        LEDashboardPage.getTileByNameThenClick('Catalog')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName2)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LECoursesPage.getSearchCourseNotFoundMsg()
    })
})

})