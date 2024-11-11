import { users } from "../../../../../../helpers/TestData/users/users"
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import LEManageTemplateCoursesPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { courseUploadSection, ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import ARCourseSettingsCourseUploadsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module"
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule"
import LECourseDetailsModal from "../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal"
import LECourseDetailsILCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"

describe("C7537 - AUT-781  GUIA-Story - NLE-2042 - Scan Course Upload files before available to Learners ", () => {

    before("Create 1 User, 1 OC and 1 ILC", () => {
        // Admin Authentication
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Create Test User
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        // Navigate Course Page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        // Create Online Course
        cy.createCourse('Online Course', ocDetails.courseName, false)

        // Add Online Course Uploads
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click();
        cy.get(ARCourseSettingsCourseUploadsModule.getUploadInstructionsbtn()).click()

        ARDashboardPage.getShortWait()
        cy.get(ARCourseSettingsCourseUploadsModule.getUploadInstructionTxt()).type(courseUploadSection.uploadInstructions)
        ARDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsCourseUploadsModule.getApplyBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARCourseSettingsCourseUploadsModule.getCourseUploadArea()).within(() => {
            cy.get(ARCourseSettingsCourseUploadsModule.getCourseCollapseBtn()).click()
        })
        ARDashboardPage.getShortWait()

        // Public Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({ id: id.request.url.slice(-36), type: null });
        })
        ARDashboardPage.getShortWait()

        // Enroll user to the Courses
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        ARDashboardPage.getShortWait()


    })

    after(function () {

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARDashboardPage.selectTableCellRecord(userDetails.username))
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete'), ARDashboardPage.getShortWait()))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), ARDashboardPage.getLShortWait()))
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(ARDashboardPage.getNoResultMsg()).contains('No results found.').should('exist')
        //Delete Course
        commonDetails.courseIDs.forEach((course) => {
            if (course.type === null) {
                cy.deleteCourse(course.id)
            } else {
                cy.deleteCourse(course.id, course.type)
            }
        });

    })

    it('Verify for an Online Course.', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getLShortWait()
        cy.get(LEDashboardPage.getCourseCrdName()).contains(ocDetails.courseName).click()
        LEDashboardPage.getLongWait()

        cy.get(LECourseDetailsOCModule.getTabBtn()).contains('Upload').click({ force: true })
        LEDashboardPage.getShortWait()

        cy.get(LECoursesPage.getActionBtn()).contains('Upload').click()
        LEDashboardPage.getShortWait()

        cy.get(LEManageTemplateCoursesPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)

        cy.get(LEManageTemplateCoursesPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)

        // Assert Upload Processing
        cy.get(LECourseDetailsModal.getFileScannerStatus()).should('contain', 'Upload processing...')
        cy.get(LECourseDetailsModal.getCourseFileSaveBtn()).should('have.attr', 'disabled')
        cy.get(LECourseDetailsModal.getCourseFileCancleBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LECourseDetailsModal.getCourseFileUploadModal()).should('not.exist')

        cy.get(LECoursesPage.getActionBtn()).contains('Upload').click()
        LEDashboardPage.getShortWait()

        cy.get(LEManageTemplateCoursesPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        LEDashboardPage.getHFJobWait()
        cy.get(LECourseDetailsModal.getFileScannerStatus()).should('contain', 'Upload verified', { timeout: 100000 })
        cy.get(LECourseDetailsModal.getCourseFileSaveBtn()).contains('Save').click()

        cy.get(LECoursesPage.getCourseUploadStatus()).should('contain', 'Complete')
        cy.get(LECoursesPage.getCourseUploadSize()).should('contain', 'File Size')
        cy.get(LECoursesPage.getCourseUploadDate()).should('contain', 'Upload Date')
        cy.get(LECoursesPage.getCourseUploadTitle()).should('exist')


    })



})


describe("C7537 - AUT-781  GUIA-Story - NLE-2042 - Scan Course Upload files before available to Learners ", () => {
    before("prequisite", () => {
        // Admin Authentication
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Create Test User
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        // Navigate Course Page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        // Create Instructor Led Course (ILC)
        cy.createCourse('Instructor Led', ilcDetails.courseName)

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click();
        cy.get(ARCourseSettingsCourseUploadsModule.getUploadInstructionsbtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCourseSettingsCourseUploadsModule.getUploadInstructionTxt()).type(courseUploadSection.uploadInstructions)
        ARDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsCourseUploadsModule.getApplyBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARCourseSettingsCourseUploadsModule.getCourseUploadArea()).within(() => {
            cy.get(ARCourseSettingsCourseUploadsModule.getCourseCollapseBtn()).click()
        })
        ARDashboardPage.getShortWait()

        // Public Online Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({ id: id.request.url.slice(-36), type: 'instructor-led-courses-new' });
        })
        ARDashboardPage.getMediumWait()

        // Enroll user to the Courses
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username])
        ARDashboardPage.getShortWait()
    })


    it('Verify for an ILC', () => {

        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getLShortWait()
        cy.get(LEDashboardPage.getCourseCrdName()).contains(ilcDetails.courseName).click()
        LEDashboardPage.getMediumWait()
        cy.get(LECourseDetailsILCModule.getTabBtn()).contains('Uploads').click({ force: true })
        LEDashboardPage.getMediumWait()

        cy.get(LECoursesPage.getActionBtn()).contains('Upload').click()
        LEDashboardPage.getShortWait()

        cy.get(LEManageTemplateCoursesPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)

        // Assert Upload Processing
        cy.get(LECourseDetailsModal.getFileScannerStatus()).should('contain', 'Upload processing...')
        cy.get(LECourseDetailsModal.getCourseFileSaveBtn()).should('have.attr', 'disabled')
        cy.get(LECourseDetailsModal.getCourseFileCancleBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LECourseDetailsModal.getCourseFileUploadModal()).should('not.exist')

        cy.get(LECoursesPage.getActionBtn()).contains('Upload').click()
        LEDashboardPage.getShortWait()

        cy.get(LEManageTemplateCoursesPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        LEDashboardPage.getHFJobWait()
        cy.get(LECourseDetailsModal.getFileScannerStatus()).should('contain', 'Upload verified', { timeout: 100000 })

        cy.get(LECourseDetailsModal.getCourseFileSaveBtn()).contains('Save').click()

        cy.get(LECoursesPage.getCourseUploadStatus()).should('contain', 'Complete')
        cy.get(LECoursesPage.getCourseUploadSize()).should('contain', 'File Size')
        cy.get(LECoursesPage.getCourseUploadDate()).should('contain', 'Upload Date')

        cy.get(LECoursesPage.getCourseUploadTitle()).should('exist')

    })

    after(function () {

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARDashboardPage.selectTableCellRecord(userDetails.username))
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete'), ARDashboardPage.getShortWait()))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), ARDashboardPage.getLShortWait()))
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(ARDashboardPage.getNoResultMsg()).contains('No results found.').should('exist')
        //Delete Course
        commonDetails.courseIDs.forEach((course) => {
            if (course.type === null) {
                cy.deleteCourse(course.id)
            } else {
                cy.deleteCourse(course.id, course.type)
            }
        });

    })
})