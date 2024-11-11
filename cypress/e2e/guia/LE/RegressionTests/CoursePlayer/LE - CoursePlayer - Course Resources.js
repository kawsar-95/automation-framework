import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'

const resourceURL = ['http://midnet/ReportMgmt/ViewReport.asp?ReportID=45181', 'http://midnet/TrainingToolbox/PBProducts/']
const infuse = 'https://guiaar.qa.myabsorb.com/#/course-player/3d889801-3ddf-441d-ba77-6fc3d11d9041'

describe('AUT-394 T98585 GUIA-Story - NLE-3385 - Course Player - Course Resources ', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin as an admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
    })
    
    
    
    it('Add an Online Course with multiple Resource', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course', ocDetails.courseName)
         //Set enrollment rule - Allow self enrollment for all learners
         cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
         LEDashboardPage.getShortWait()
         ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Create Multiple Resource with Url Type Attachment
        cy.get(ARCollaborationAddEditPage.getElementByTitleAttribute('Resources')).eq(0).click()

        for (let i = 0; i < resourceURL.length; i++) {
            cy.get(ARCollaborationAddEditPage.getAddResourcesBtn()).should('contain.text', 'Add Resource').click()
            ARCollaborationAddEditPage.getMediumWait()

            cy.get(arDashboardPage.getElementByAriaLabelAttribute(ARCollaborationAddEditPage.getResourceByIndex(i +1, i + 1))).within(() => {
                cy.get(ARCollaborationAddEditPage.getResourceNameTxtF()).clear().type(collaborationDetails.temp[i][0])
                cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).clear().type(collaborationDetails.temp[i][1])

                cy.get(ARCollaborationAddEditPage.getAttachmentRadioBtn()).contains('Url').click()
                cy.get(ARCollaborationAddEditPage.getUrlTxtF()).clear().type(resourceURL[i])
            })

        }

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])        
    })
})
describe('T284798 - AUT380 -  GUIA-Story NLE-4038 - Course Player - Implement all view modes in course player ', function () {

    before(function () {
 //Login as a learner 
 cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
 LEDashboardPage.getLongWait()
    })
    after(function () {
        //Signin as an admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        //Delete the course 
         cy.deleteCourse(commonDetails.courseID)
         //Delete user via API
         cy.deleteUser(userDetails.userID)
    })
     it('Verify Course Player learner can start the course', () => {
        
        //Search for OC
       cy.get(LEDashboardPage.getNavMenu()).click()
       LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
       cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
       LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
       LEDashboardPage.getMediumWait()
       cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName).should('be.visible')
       LEDashboardPage.getMediumWait()
       //Start course
       cy.get(LEDashboardPage.getCoursestartbutton()).click({ force: true })
       LEDashboardPage.getMediumWait()
       // Assert that there are only one course expand icon (double up), and click it to expand course details
       cy.get(LECatalogPage.getCoursePalyerDetails()).within(() => {
        cy.get(LECatalogPage.getCourseDetailExpandUpArrow()).should('have.length', 1) 
        cy.get(LECatalogPage.getCourseDetailExpandUpArrow()).click()
        cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Resources').should('exist').and('be.visible').click()
        cy.get(LECatalogPage.getCourseDetailsContent()).should('exist').and('be.visible')
       })
        for (let i = 0; i < resourceURL.length; i++) {
            cy.get(LECatalogPage.getResourcesAttachments()).eq(i).invoke('text').then((text) => {
                expect(text).to.be.equal(collaborationDetails.temp[i][0])
            })
            cy.get(LECatalogPage.getResourceDescrptionArrow()).eq(i).click()
            cy.get(LECatalogPage.getResourceDescriptionContent()).eq(i).should('exist').and('be.visible')
            cy.get(LECatalogPage.getResourceDescriptionContent()).eq(i).invoke('text').then((text) => {
                expect(text).to.be.equal(collaborationDetails.temp[i][1])
            })
 
        }
        cy.visit(infuse)
        LECatalogPage.getLongWait()
        //The Resource tab will not be available (nor is there an X in the top right to close the course player)
        cy.get(LECatalogPage.getCourseDetailExpandUpArrow()).click()
        cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Resources').should('not.exist')
        LECatalogPage.getLongWait()
        //The Discovery modal is the full mobile device width, and the resources show stacked (like it did for the desktop view)
        cy.viewport('iphone-x')
        LEDashboardPage.getShortWait()
        cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Resources').should('not.exist')
        cy.viewport(1280, 720)
       

        })
      
    })
    