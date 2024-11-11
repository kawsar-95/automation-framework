import users from '../../../../../../fixtures/users.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddTaskLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddTaskLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ocDetails, lessonTask } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'



describe('C881 -AR - Regress - CED - OC - Lesson - Add Multiple Chapter and Delete', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })



    it('Add Multiple Chapter with lesson', () => {
        //Create Course
        cy.createCourse('Online Course')

        // Click on add learning Object
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Task')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Add Task
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).clear().type(lessonTask.ocTaskDescription)
        //Save Task
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        arOCAddEditPage.getLShortWait()


        //Verify multiple chapter can be added
        let chatperNames = ["Chapter 2"];
        for (let i = 0; i < chatperNames.length; i++) {
            cy.get(arOCAddEditPage.getAddChapterBtn()).click()
            arOCAddEditPage.getShortWait()

            cy.get(arOCAddEditPage.getChapterTitle()).contains(chatperNames[i]).parents(arOCAddEditPage.getChapterContainer()).within(() => {

                cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            })

            ARSelectLearningObjectModal.getObjectTypeByName('Task')
            cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

            cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName)
            cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).clear().type(lessonTask.ocTaskDescription)
            //Save Task
            cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
            arOCAddEditPage.getLShortWait()
        }

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })


    it('Verify chapter and lesson can be deleted, Delete Chapter 1 and Lesson', () => {
        //Edit Course
        cy.editCourse(ocDetails.courseName)

        //Verify chapters were added in correct order
        let chatperNames = [ocDetails.defaultChapterName, ocDetails.defaultChapterName2];
        for (let i = 0; i < chatperNames.length; i++) {
            cy.get(arOCAddEditPage.getChapterTitle()).eq(i).should('contain', chatperNames[i])
        }

        //Delete task lesson from chapter 1
        cy.get(arOCAddEditPage.getChapterTitle()).contains(ocDetails.defaultChapterName).parents(arOCAddEditPage.getChapterContainer()).within(() => {
            arOCAddEditPage.getDeleteBtnByLessonNameThenClick(lessonTask.ocTaskName)
        })
        cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        arOCAddEditPage.getShortWait()

        //Delete Chapter 1
        cy.get(arOCAddEditPage.getChapterTitle()).contains(ocDetails.defaultChapterName).parents(arOCAddEditPage.getChapterContainer()).within(() => {
            cy.get(arOCAddEditPage.getDeleteChapterBtn()).click()
        })
        cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        arOCAddEditPage.getShortWait()


        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    it('Add Another Chapter', () => {
        //Edit course to add another chapter
        cy.editCourse(ocDetails.courseName)

        //Add another chapter
        let chatperNames = [ocDetails.defaultChapterName3];
        for (let i = 0; i < chatperNames.length; i++) {
            cy.get(arOCAddEditPage.getAddChapterBtn()).click()
            arOCAddEditPage.getShortWait()

            cy.get(arOCAddEditPage.getChapterNameTxtF()).eq(1).clear().type(chatperNames[i])

            cy.get(arOCAddEditPage.getChapterTitle()).contains(chatperNames[i]).parents(arOCAddEditPage.getChapterContainer()).within(() => {

                cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
            })

            ARSelectLearningObjectModal.getObjectTypeByName('Task')
            cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

            cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName)
            cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).clear().type(lessonTask.ocTaskDescription)
            //Save Task
            cy.get(ARAddTaskLessonModal.getSaveBtn()).first().click()
            arOCAddEditPage.getLShortWait()
        }

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })


})
