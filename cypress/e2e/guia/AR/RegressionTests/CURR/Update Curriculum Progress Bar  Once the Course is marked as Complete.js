import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { lessonObjects, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'

describe('C6336 - Update Curriculum Progress Bar Once the Course is marked as Complete', () => {

    before('Enable NextGen Learner Experience', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOnNextgenToggle()
    })

    after('Delete courses and user', () => {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")        
        //ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2]) this line is commentted out due to environmental issues.
        LECatalogPage.turnOffNextgenToggle()
    })

    it('Create first online course', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create Online course
        cy.createCourse('Online Course', ocDetails.courseName)
        
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })

    it('Create second online course', ()=> {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create Online course
        cy.createCourse('Online Course', ocDetails.courseName2)
        
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
    })
    //those it blocks are commentted out due to environmental issues.
    // it('Create Curr course', ()=> {
    //     cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    //     cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    //     ARDashboardPage.getCoursesReport()

    //     cy.createCourse('Curriculum', currDetails.courseName)
        
    //     ARSelectModal.SearchAndSelectFunction([ocDetails.courseName,ocDetails.courseName2])

    //     cy.publishCourseAndReturnId().then((id) => {
    //         commonDetails.courseID = id.request.url.slice(-36)
    //     })

    //     AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])

    //     ARDashboardPage.getUsersReport()
    //     ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    //     //Impersonate as Learner
    //     cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     LEDashboardPage.getTileByNameThenClick('My Courses')
    //     LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)
    //     cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')

    //     cy.get(LEDashboardPage.getCoursePlayerCourse()).contains(ocDetails.courseName).click()

    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    //     cy.get(LEDashboardPage.getCoursePlayerActionBtn()).should('have.attr','aria-disabled','false').click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     cy.get(LEDashboardPage.getToastNotificationMsg()).contains('You have been successfully enrolled.').should('be.visible')
         
    //     //cy.get(LEDashboardPage.getLeaderboardPoint()).contains('10 Leaderboard Points').should('be.visible')  //this line commented out due to environmental issues.
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    //     cy.get(LEDashboardPage.getCrossBtn()).should('be.visible')
    //     cy.get(LEDashboardPage.getCrossBtn()).click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     cy.get(LEDashboardPage.getCoursePlayerActionBtn()).contains('View').should('be.visible')

    //     cy.get(LEDashboardPage.getCrossBtn()).click()

    //     cy.get(LEDashboardPage.getCoursePlayerCompletedCourseNum()).should('contain','1/2 Courses')

    //     cy.get(LEDashboardPage.getCoursePlayerCompletedPercent()).should('contain','50%')
    // })

    // it('Create third online course', ()=> {
    //     cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    //     ARDashboardPage.getCoursesReport()
    //     // Create Online course 
    //     cy.createCourse('Online Course', ocDetails.courseName3)
        
    //     // Open Completion Section
    //     cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

    //     cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
    //     ARSelectLearningObjectModal.getObjectTypeByName('Object')
    //     cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
    //     ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)

    //     cy.publishCourseAndReturnId().then((id) => {
    //         commonDetails.courseIDs.push(id.request.url.slice(-36))
    //     })
    // })

    // it('Update Curr course ', ()=> {
    //     cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
    //     cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    //     ARDashboardPage.getCoursesReport()
    //     // Edit Curr course
    //     cy.editCourse(currDetails.courseName)
        
    //     cy.get(LEDashboardPage.getRightIcon(), { timeout: 10000 }).click()
    //     cy.get(LEDashboardPage.getAddCurrGrp()).should('be.visible')
    //     cy.get(LEDashboardPage.getAddCurrGrp(), { timeout: 10000 }).click()

    //     cy.get(LEDashboardPage.getPaceProgressBtn()).click()
    //     cy.get(LEDashboardPage.getPaceProgressInput()).should('have.attr','aria-checked','true')

    //     cy.get(LEDashboardPage.getAddCourse(), { timeout: 30000 }).eq(1).should('be.visible').should('have.attr','aria-disabled','false').click({force: true})
        
    //     ARSelectModal.SearchAndSelectFunction([ocDetails.courseName3])
        
    //     cy.publishCourseAndReturnId().then((id) => {
    //         commonDetails.courseID = id.request.url.slice(-36)
    //     })

    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    //     cy.get(LEDashboardPage.getFilteredCrossBtn(), { timeout: 10000 }).should('be.visible')
    //     cy.get(LEDashboardPage.getFilteredCrossBtn(), { timeout: 10000 }).click()
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username2])

    //     ARDashboardPage.getUsersReport()
    //     ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    //     //Impersonate as Learner
    //     cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     LEDashboardPage.getTileByNameThenClick('My Courses')
    //     LEDashboardPage.getCourseCardBtnThenClick(currDetails.courseName)

    //     cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')

    //     cy.get(LEDashboardPage.getCoursePlayerCourse()).contains(ocDetails.courseName).click()

    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    //     cy.get(LEDashboardPage.getCoursePlayerActionBtn()).should('have.attr','aria-disabled','false').click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     cy.get(LEDashboardPage.getToastNotificationMsg()).contains('You have been successfully enrolled.').should('be.visible')

    //     //cy.get(LEDashboardPage.getLeaderboardPoint()).contains('10 Leaderboard Points').should('be.visible')
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    //     cy.get(LEDashboardPage.getCrossBtn()).click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     // cy.get(LEDashboardPage.getCoursePlayerActionBtn()).contains('View').should('be.visible')

    //     cy.get(LEDashboardPage.getCrossBtn()).click()

    //     cy.get(LEDashboardPage.getCourseEnrollBtn(ocDetails.courseName3)).should('have.attr','aria-disabled', 'true')
        
    //     cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')

    //     cy.get(LEDashboardPage.getCoursePlayerCourse()).contains(ocDetails.courseName2).click()

    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    //     cy.get(LEDashboardPage.getCoursePlayerActionBtn()).should('have.attr','aria-disabled','false').click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     cy.get(LEDashboardPage.getToastNotificationMsg()).contains('You have been successfully enrolled.').should('be.visible')

    //     //cy.get(LEDashboardPage.getLeaderboardPoint()).contains('10 Leaderboard Points').should('be.visible')
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
    //     cy.get(LEDashboardPage.getCrossBtn()).click()
    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     // cy.get(LEDashboardPage.getCoursePlayerActionBtn()).contains('View').should('be.visible')

    //     cy.get(LEDashboardPage.getCrossBtn()).click()

    //     LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
    //     cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')

    //     cy.get(LEDashboardPage.getCoursePlayerCompletedPercent()).should('contain','67%')

    //     cy.get(LEDashboardPage.getCourseEnrollBtn(ocDetails.courseName3)).should('have.attr','aria-disabled', 'false')
    // })

})