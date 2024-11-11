import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCourseUploadsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadInstructionsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import { ocDetails, courseUploadSection } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEUploadFileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEUploadFileModal'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import {  attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import arCourseUploadReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseUploadReportPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'


describe('AR - Reports - Course Uploads Section - Create Course and filter data in Course Upload Report', function(){

    var i=0;
    let SearchData = [`${courseUploadSection.uploadLabel}`,`GUIA-CED`,`Sys_Admin_01`,`GUI_Auto`,`GUIAutoSA01`]; //test specific array
    let SearchDetails = [`Type`,`Course`, `Last Name`,`First Name`,`Username`];

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
      });

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Create OC Course, Verify Course Uploads Section Fields, Publish Course', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        cy.createCourse('Online Course',ocDetails.courseName)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Select Allow Enrollment All learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Course Uploads Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Course Uploads')).click()
        AROCAddEditPage.getShortWait()

        //Add a Course Upload and Edit Upload Instructions
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()).click()
        AROCAddEditPage.getShortWait()

        //Verify Upload Instructions Field Allows HTML, Save Changes
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARUploadInstructionsModal.getUploadFileInstructionsTxt()))
            .clear().type(`${courseUploadSection.uploadInstructions} ${commonDetails.textWithHtmlTag}`).click()
        AROCAddEditPage.getVShortWait() //Wait for Apply Btn to become enabled
        cy.get(ARUploadInstructionsModal.getApplyBtn()).click()

        //Enter Valid Label Name
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCourseUploadsModule.getLabelTxt()))
            .clear().type(courseUploadSection.uploadLabel)
        //Set Approval Type to Course Editor
        cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn()).contains('Course Editor').click()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })


    it('Upload the data in OC course by the learner side ', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
         cy.get(LECourseDetailsOCModule.getCourseContentUploadM()).eq(0).click()
        cy.get(LEUploadFileModal.getUploadContentBtn()).click()
        cy.get(LEUploadFileModal.getUploadFile()).click({force:true})
        cy.get(LEUploadFileModal.getUploadFile()).attachFile(miscData.resource_image_folder_path + attachments.fileNames2[1])
        
       
   })
   it("Filter the course upload data in Course Upload Report",()=>{

    cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Uploads'))
    cy.intercept('/api/rest/v2/admin/reports/course-uploads').as('getCoursesUploads').wait('@getCoursesUploads')
    
    for(i=0;i< SearchData.length;i++)
    {
        if(i<=SearchDetails.length){
            ARCourseSettingsCourseUploadsModule.AddFilter(SearchDetails[i], 'Contains',SearchData[i])
            ARCourseSettingsCourseUploadsModule.getMediumWait()
            cy.get(ARCourseSettingsCourseUploadsModule.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.wait('@getCoursesUploads')
            cy.get(ARCourseSettingsCourseUploadsModule.getRemoveAllBtn()).should('be.visible').click()
        }
      }
      ARCourseSettingsCourseUploadsModule.AddFilter(SearchDetails[1], 'Contains',SearchData[1])
      ARCourseSettingsCourseUploadsModule.getMediumWait()
      cy.get(ARCourseSettingsCourseUploadsModule.getA5TableCellRecordByColumn(2+parseInt([1]))).contains(SearchData[1]).click()
      //Validate action menu btn levels
      arCourseUploadReportPage.getRightActionMenuLabel() 
      //Deselect selected value check box
      ARCoursesPage.getContextMenuByName('Deselect').click()
        cy.get(arDashboardPage.getGridTable()).within(() => {
            cy.get(ARCoursesPage.getCheckedInput()).should('have.length', 0)
        })

        cy.get(arDashboardPage.getGridTable()).eq(0).click()
      
   })
})