import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage";
import ARCURRAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage";
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal";
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import LECourseDetailsCurrModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule";
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu";
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr";
import { lessonObjects, ocDetails } from "../../../../../../helpers/TestData/Courses/oc";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";



let CourseCount;

describe("C837 - AUT-269 - GUIA-Story - NASA-1245: Must Complete All / Required to Complete (cloned) ", () => {
    //prerecuiste 
    //Create a OC with a single Object Lesson (image or PDF)
    before("Prequisite", () => {

        // Create a user for enrollment
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arDashboardPage.getCoursesReport()


        //Create course with basic object lesson
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add object to OC
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName)

        // Store the course id for later use
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        // Create Curriculum course
        cy.createCourse('Curriculum', currDetails.courseName)

        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName])
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })

    it("Asserting User must complete 1 Course in the learner side ", () => {
        CourseCount = 1;
        cy.apiLoginWithSession(userDetails.username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getLEWaitSpinner(), { timeout: 150000 }).should('not.exist')
        LEDashboardPage.getTileByNameThenClick('Catalog')
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        LECatalogPage.getCourseCardBtnThenClick(currDetails.courseName)
        cy.get(LEDashboardPage.getLEWaitSpinner(), {
            timeout: 10000,
        }).should("not.exist")
        cy.get(LECourseDetailsCurrModule.getMustCompleteNotice()).should('have.text', `You must complete ${CourseCount} of the following course(s).`)

    })

    it(`Adding Two more Online Course Courses to ${currDetails.courseName}`, () => {

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arDashboardPage.getCoursesReport()

        cy.editCourse(currDetails.courseName)

        //Add Two more courses
        // Add courses to the new group
        cy.get(ARCURRAddEditPage.getGroupList())
            .contains(currDetails.defaultGroupName)
            .parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
                //Clicking on Add course button
                cy.get(ARCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
            })
        //Selecting Two more courses    
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name, courses.oc_filter_03_name])


        //Verify Duplicated course can be published
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs[1] = id.request.url.slice(-36)
        })

    })

    it("Asserting Must Complete Courses Count increase to 3", () => {
        CourseCount = 3;
        cy.apiLoginWithSession(userDetails.username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getLEWaitSpinner(), { timeout: 150000 }).should('not.exist')
        LEDashboardPage.getTileByNameThenClick('Catalog')
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        LECatalogPage.getCourseCardBtnThenClick(currDetails.courseName)
        cy.get(LEDashboardPage.getLEWaitSpinner(), {
            timeout: 10000,
        }).should("not.exist")
        cy.get(LECourseDetailsCurrModule.getMustCompleteNotice()).should('have.text', `You must complete ${CourseCount} of the following course(s).`)
    })

    it(`Asserting Required course input should be less than or equal to ${CourseCount} in ${currDetails.courseName}`, () => {

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        arDashboardPage.getCoursesReport()

        cy.editCourse(currDetails.courseName)

      
        // Add courses to the new group
        cy.get(ARCURRAddEditPage.getGroupList())
            .contains(currDetails.defaultGroupName)
            .parents(ARCURRAddEditPage.getGroupContainer()).within(() => {
                // Select "Minimum courses" option 
                cy.get(ARCURRAddEditPage.getRadioBtnDataNameField()).contains('Minimum courses').click({ force: true })
                cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).clear()
                cy.get(ARCURRAddEditPage.getErrorAsDataNameField()).should('have.text','Field is required.')
                cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).type(4)
                cy.get(ARCURRAddEditPage.getErrorAsDataNameField()).should('have.text',`Field must be less than or equal to ${CourseCount}.`)
            })
       

    })



    after(function () {
        //Delete Course
        //Online course delete
        cy.deleteCourse(commonDetails.courseIDs[0])
        //Curriculum course delete
        cy.deleteCourse(commonDetails.courseIDs[1] , 'curricula')
        // Delete User
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
    

})