import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage'
import arCompetencyAddEditPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage'
import arAssignCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARAssignCompetencyPage'
import { competencyDetails } from '../../../../../../helpers/TestData/Competency/competencyDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import ARExternalTrainingPage from '../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage'

describe('AR -File Upload-Change File Visibility- Competency', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses')) , {timeout:15000}).click()
        arDashboardPage.getMenuItemOptionByName('Competencies')
        cy.get(arCompetencyPage.getWaitSpinner()).should('not.exist')
    })

    it('Verify Admin Can Create a New Competency and Change File Visibility', () => {
        // Verify that 
        cy.get(arCompetencyPage.getA5PageHeaderTitle() , {timeout:15000}).should('contain', "Competencies")
        cy.get(arCompetencyPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(arCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(arCompetencyAddEditPage.getNameErrorMsg() , {timeout:15000}).should('have.text', 'Name is required')

        // Create Competency
        cy.get(arCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(arCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(arCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        cy.get(arCompetencyAddEditPage.getHasBadgeImageToggleON()).click()


        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFileInput() , {timeout:15000} ).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        
        //Check If Private radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPrivateRadoioBtnSelected()
        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getClickAvailabilityPublicBtn()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
       
       
        
        //Save Competency
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        // Search Competency
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex(2))

        // Assign Competency to a User
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Assign to User')
        cy.get(arAssignCompetencyPage.getUsersDDown()).click()
        cy.get(arAssignCompetencyPage.getUsersDDown() , {timeout:15000}).type(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)
        arAssignCompetencyPage.getUsersDDownOpt(users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname)
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Assign')

    })

    it('Verify Admin can edit Competency and Change File Visibility', () => {

        // Search Competency
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex(2))
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Edit')
      


        //Verify name persisted
        cy.get(A5GlobalResourceAddEditPage.getNameTxtF()).should('have.value', competencyDetails.competencyName)

        //Verify file upload persisted
        cy.get(arCompetencyAddEditPage.getBadgeUrlTxtF()).invoke('val').then((val) => {
            expect(val).to.contain(images.moose_filename.slice(0, -4))
        })
        //Open Uploaded File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        cy.intercept('POST' , '/Admin/UploadFile/Upload').as('fileUpload')
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
       

        //Verify file upload persisted in Upload File pop upgetBadgeUrlTxtF
        cy.get(arCompetencyAddEditPage.getBadgeUrlTxtF()).invoke('val').then((val) => {
            expect(val).to.contain(images.moose_filename.slice(0, -4))
        })
        //Verify if Previously selected Permission level Persist
        A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()

        cy.get(A5GlobalResourceAddEditPage.getFileUpdateInformationText()).should('exist')

        //Update File
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.happy_qas_filename)

        //Change Visibiliy to Private
        A5GlobalResourceAddEditPage.getAvailabilityPrivateBtn()

        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
     
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
       
       
        //Save Competency
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
      

    })

    it('Verify User can see Created Data at Learner Side', () => {

        // Login LE
        cy.viewport(1600, 900)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavSearch()).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Profile')
        cy.get(arCompetencyAddEditPage.getViewSocialProfile(),{timeout:15000}).should('be.visible')
        cy.get(arCompetencyAddEditPage.getViewSocialProfile()).click()
        cy.get(arCompetencyAddEditPage.getViewAddedCompetency() , {timeout:15000}).contains(competencyDetails.competencyName).should('be.visible')
        cy.get(arCompetencyAddEditPage.getViewAddedCompetency()).contains(competencyDetails.competencyName).click({ force: true })
        arCompetencyAddEditPage.getShortWait()
        cy.get(arCompetencyAddEditPage.getCompetencyCardView()).contains(competencyDetails.competencyName).should('exist')
    })

    it("Delete the created competency card", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Competencies')
      
        // Search and delete Competency
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex(4))
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete')
       cy.get(ARExternalTrainingPage.getConfirmModalOkButton()).click()
        // Verify Competency is deleted
        cy.get(arCompetencyPage.getA5NoResultMsg()).should('be.visible').and('have.text', "Sorry, no results found.");
    })

})