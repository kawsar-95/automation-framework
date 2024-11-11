import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arOCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddTaskLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddTaskLessonModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails, lessonTask} from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'

describe('LE - Course Activity - Lessons - Task - Admin', function(){

    before(function() {
        //Create a new user then login
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    it('Admin - Create New OC Course and Add Task', () => { 
        cy.createCourse('Online Course')
        
        //Add task
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Task')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).type(lessonTask.ocTaskDescription)
        //Turn on Task is Scored, add Pass Grade & Weight
        cy.get(ARAddTaskLessonModal.getTaskIsScoredToggle()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type('50')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type('12')
        //Expand Messages section, turn on Allow Notification
        cy.get(ARAddTaskLessonModal.getExpandMessagesBtn()).click()
        cy.get(ARAddTaskLessonModal.getAllowNotificationToggle()).click()
        //Verify placeholder text then add instructions
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt()))
            .should('have.attr', 'placeholder', 'Click below to confirm you are ready for the task')
        //Turn on send task notification check box and save task
        cy.get(ARAddTaskLessonModal.getSendTaskNotificationChkBox()).click()
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getModal(),{timeout:10000}).should('not.exist')
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Admin - Enroll User in New OC Course', () => { 
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })
})

describe('LE - Course Activity - Lessons - Task', function(){

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Navigate to OC Course, Start Task Lesson, Verify Task Content', () => { 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        //Navigate to OC course and start it
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getSpecificCourseCardBtnThenClick(ocDetails.courseName)
        cy.get(LECoursesPage.getCourseILCTitle(),{timeout:10000}).should('be.visible').and('contain',`${ocDetails.courseName}`)
         //sometimes takes a moment to load the lessons
        //Start the task lesson and verify content
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessonTask.ocTaskName, 'Start', true)
        cy.get(LECourseLessonPlayerPage.getLessonTitle()).should('contain', lessonTask.ocTaskName)
        cy.get(LECourseLessonPlayerPage.getTaskTitle()).should('contain', lessonTask.ocTaskName)
        cy.get(LECourseLessonPlayerPage.getTaskDescription()).should('contain', lessonTask.ocTaskDescription)
        cy.get(LECourseLessonPlayerPage.getSendInstructionsBtn()).should('be.visible').click()
        cy.get(LECourseLessonPlayerPage.getNotificationMsg()).should('contain', 'Notification has been sent')
        //Close the lesson
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
    })
})
