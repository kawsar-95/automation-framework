import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage';
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal';
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails';
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails';
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc';
import { users } from '../../../../../../helpers/TestData/users/users';
import ARAddMoreCourseSettingsModule, { courseSettingsButtons } from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module';

const resourceURL = ['http://midnet/ReportMgmt/ViewReport.asp?ReportID=45181', 'http://midnet/TrainingToolbox/PBProducts/', 'http://midnet/TrainingToolbox/PBPolicies/']

describe('C892 -AUT-107 - AR - Online Course - Add a Resource (cloned)', ()=> {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go To courses Report
        arDashboardPage.getCoursesReport()
    })

    it.only('Add an Online Course with multiple Resource', () => {
        //Create a new Course
        cy.createCourse('Online Course')

        //Create Multiple Resource with Url Type Attachment
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn(courseSettingsButtons.Resources)).click()

        for (let i = 0; i < resourceURL.length; i++) {
            cy.get(ARCollaborationAddEditPage.getAddResourcesBtn()).should('contain.text', 'Add Resource').click()

            cy.get(arDashboardPage.getElementByAriaLabelAttribute(ARCollaborationAddEditPage.getResourceByIndex(i + 1, i + 1))).within(() => {
                cy.get(ARCollaborationAddEditPage.getResourceNameTxtF()).clear().clear().type(collaborationDetails.resourceTwo[0])
                cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).clear().type(collaborationDetails.resourceTwo[1])

                cy.get(ARCollaborationAddEditPage.getAttachmentRadioBtn()).contains('Url').click()
                cy.get(ARCollaborationAddEditPage.getUrlTxtF()).clear().type(resourceURL[i])
            })

        }

      
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
      

    })

    it('Delete Resource', () => {
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn(courseSettingsButtons.Resources)).click()
        cy.get(ARCollaborationAddEditPage.getCollapseBtn()).click()

        // Delete a resource
        AROCAddEditPage.getDeleteResourceBtnByNameThenClick(collaborationDetails.temp[1][0])
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()

    })

    it('Delete Online Course', () => {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

})