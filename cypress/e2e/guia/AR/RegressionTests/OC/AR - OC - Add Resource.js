import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage';
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal';
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage';
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails';
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails';
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc';
import { users } from '../../../../../../helpers/TestData/users/users';
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage';

const resourceURL = ['http://midnet/ReportMgmt/ViewReport.asp?ReportID=45181', 'http://midnet/TrainingToolbox/PBProducts/', 'http://midnet/TrainingToolbox/PBPolicies/']

describe('C780 GUIA-Story - NASA-2666 - Online Course - Add a Resource (cloned)', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Add an Online Course with multiple Resource', () => {
        cy.createCourse('Online Course')

        //Create Multiple Resource with Url Type Attachment
        cy.get(ARCollaborationAddEditPage.getElementByTitleAttribute('Resources')).eq(0).click()

        for (let i = 0; i < resourceURL.length; i++) {
            cy.get(ARCollaborationAddEditPage.getAddResourcesBtn()).should('contain.text', 'Add Resource').click()
            ARCollaborationAddEditPage.getMediumWait()

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

        cy.get(ARCollaborationAddEditPage.getElementByTitleAttribute('Resources')).eq(0).click()
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