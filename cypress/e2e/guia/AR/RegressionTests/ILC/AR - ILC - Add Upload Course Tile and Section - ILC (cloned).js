import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import { courseUploadSection } from '../../../../../../helpers/TestData/Courses/oc'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEUploadFileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEUploadFileModal'
import { images, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARILCMarkUserInActivePage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARCourseSettingsCourseUploadsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C939, AR - ILC - Add Upload Course Tile and Section - ILC (cloned)', function(){
    before(() => {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        cy.get(LEDashboardPage.getNavMenu()).click()
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click({force:true})
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Create ILC with Course Upload and Sessions', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        //Add a session and open enrollment section
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
              
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)  
        ARILCAddEditPage.getMediumWait()

        // Verify Course Uploads Tile is added to Add More Course Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Course Uploads')).should('exist')
        // Open Course Uploads
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Course Uploads')).click()
        ARILCAddEditPage.getShortWait()

        // Verify An Admin can add a Course Upload
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("add-course-upload-definition")).click()
        ARILCAddEditPage.getShortWait()

        // Verify An Admin can add Upload Instructions
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("edit-upload-instructions")).click()
        ARILCAddEditPage.getMediumWait()

        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Upload Instructions')).type(courseUploadSection.uploadInstructions)
        ARILCAddEditPage.getVShortWait() //wait for Apply button to be enabled
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('save')).click()
        ARILCAddEditPage.getShortWait()

        // Verify Label field is required
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Label')).should('have.attr', 'aria-required', 'true')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Label')).clear().type(courseUploadSection.uploadLabel)

        // Add Another upload option
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("add-course-upload-definition")).click();
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getElementByPartialAriaLabelAttribute(`${courseUploadSection.uploadLabelDefaultPrefix}  2`))
            .find(ARILCAddEditPage.getElementByAriaLabelAttribute('Label')).clear().type(courseUploadSection.uploadLabelNames[1])

        // Course Uploads are incrementally numbered and displayed in a expandable list
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("indicator")).eq(0).should('have.text', 1);
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("indicator")).eq(1).should('have.text', 2);

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("visibility-toggle")).eq(0).should('have.attr', 'aria-label', 'Collapse');
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("visibility-toggle")).eq(0).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute("visibility-toggle")).eq(0).should('have.attr', 'aria-label', 'Expand');

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        arDashboardPage.getMediumWait()

        //Enroll Leaner in already created course
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username],ilcDetails.sessionName)
        arDashboardPage.getMediumWait()
    })

    it('ILC Sessions Set Mark Attendance Completed', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Sessions'))
        arDashboardPage.getMediumWait()

        arDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        // Select Session
        arDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)
        arDashboardPage.getMediumWait()

        // Navigate to Mark Attendence
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        arDashboardPage.getLongWait()

        cy.get(ARILCMarkUserInActivePage.getOverallGradeStatusToggle()).click()
        arDashboardPage.getShortWait()

        ARILCMarkUserInActivePage.setLearnerPresentAbsentStatus('Present')
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getSaveBtn()).click()
        arDashboardPage.getMediumWait()
    })

    it('Login as Learner and Upload Course', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        arDashboardPage.getMediumWait()

        // / Navigate to Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        arDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName);
        arDashboardPage.getLongWait()

        // View Course
        cy.get(LECatalogPage.getElementByTitleAttribute(ilcDetails.courseName)).should('exist')
        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

         //Go to uploads tab
        LECoursesPage.getCoursesPageTabBtnByName('Uploads')

        // Upload Instructions and Course Upload requirement is displayed correctly on the learner side.
        cy.get(LECourseDetailsOCModule.getUploadInstructions()).should('contain', courseUploadSection.uploadInstructions)

        //Complete both uploads
        for (let i = 0; i < courseUploadSection.uploadLabelNames.length; i++) {
            LECourseDetailsOCModule.getCourseUploadActionBtnThenClick(courseUploadSection.uploadLabelNames[i])
            cy.get(LEUploadFileModal.getUploadLabel()).should('contain', courseUploadSection.uploadLabelNames[i])
            cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.moose_filename)
            cy.intercept('**/legacy-learner-uploads').as(`getUpload${i}`).wait(`@getUpload${i}`)
            arDashboardPage.getMediumWait()

            // cy.intercept('**/uploads/files').as(`getUpload${i}`).wait(`@getUpload${i}`)
            cy.get(LEUploadFileModal.getUploadedFileTxtF()).should('contain', images.moose_filename)
            cy.get(LEUploadFileModal.getUploadNotesTxtF()).type(courseUploadSection.uploadNotes)
            cy.get(LEUploadFileModal.getSaveBtn()).click()
            LEDashboardPage.getLShortWait()
        }

        // Ensure ILC is completed after document has been uploaded
        LEDashboardPage.getMediumWait()
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')
    })

    it('Edit ILC on Course Upload Section', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        // Open Course Uploads
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Course Uploads')).click()
        ARILCAddEditPage.getShortWait()

        // Verify An Admin can delete a Course Upload 
        ARCourseSettingsCourseUploadsModule.geDeleteUploadByNameThenClick(courseUploadSection.uploadLabelNames[1])
        ARILCAddEditPage.getLShortWait()
        
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Verify associated uploads are removed from the learner side', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        arDashboardPage.getMediumWait()

        // Navigate to Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        arDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName);
        arDashboardPage.getLongWait()

        cy.get(LECatalogPage.getElementByTitleAttribute(ilcDetails.courseName)).should('exist')
        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Go to uploads tab
        LECoursesPage.getCoursesPageTabBtnByName('Uploads')
        arDashboardPage.getMediumWait()

        // Verify associated uploads are removed from the learner side
        cy.get(LECourseDetailsOCModule.getLessonName()).find('a').should('not.have.text',  courseUploadSection.uploadLabelNames[1])
    })
})

