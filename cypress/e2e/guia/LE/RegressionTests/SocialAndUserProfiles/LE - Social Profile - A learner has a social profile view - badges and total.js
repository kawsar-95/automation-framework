import ARAssignCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARAssignCompetencyPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCompetencyPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import LESocialProfilePage from "../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('C1807 - AUT-429 - GUIA-Story - Acceptance Test: NLE-1868 - A learner has a social profile view - badges and total', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })


    it('Create a temporary Competency', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        ARDashboardPage.getCompetenciesReport()

        // Verify that 
        cy.get(ARCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        ARCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARCompetencyAddEditPage.getNameErrorMsg()).should('have.text', 'Name is required')

        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        //Click on the Has Badge Image
        cy.get(ARCompetencyAddEditPage.getHasBadgeImageToggleON()).click()


        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFileInput(), { timeout: 15000 }).attachFile(resourcePaths.resource_image_folder + images.moose_filename)

        //Check If Private radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPrivateRadoioBtnSelected()
        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()



        //Verify file upload persisted
        cy.get(ARCompetencyAddEditPage.getBadgeUrlTxtF()).invoke('val').then((val) => {
            expect(val).to.contain(images.moose_filename.slice(0, -4))
        })

        // Save Competency
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
    })
    it('Assign Competency to the newly created user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Users Report Page
        ARDashboardPage.getUsersReport()
        //Verify that Users page is open
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('be.visible').and('exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
        //Select any user
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(4)).contains(userDetails.username).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Click on edit
        cy.get(ARDashboardPage.getElementByTitleAttribute('Edit User'), { timeout: 15000 }).should('have.attr', "aria-disabled", 'false')
        cy.get(ARDashboardPage.getElementByTitleAttribute('Edit User')).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Edit User')

        //Click On Assign Competency
        cy.get(ARDashboardPage.getElementByTitleAttribute('Assign Competencies')).click()

        //Search for competency and cancel
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()

        cy.get(ARAssignCompetencyPage.getChooseCompetencyCancelBtn()).click()
        cy.get(ARDashboardPage.getAccountHeaderLabel(), { timeout: 15000 }).should('exist')
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Assign Competencies')


        //Search for competency and continue
        //Click on Add Competencies
        cy.get(ARAssignCompetencyPage.getAddCompetenciesBtn()).click()

        cy.get(ARAssignCompetencyPage.getSearchCompetencies()).type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Here wait is required as this page is old A5 page and it loads all the 
        //comptencies thats why it takes longer time to load
        ARDashboardPage.getLongWait()
        ARAssignCompetencyPage.getCompetenciesDDownOpt(competencyDetails.competencyName)
        cy.get(ARAssignCompetencyPage.getCompetenciesChoseBtn()).click()


       
        //Click on plus icon to select user
        cy.get(ARAssignCompetencyPage.getUsersDDown()).click()
        cy.get(ARAssignCompetencyPage.getAddUserTextF()).type(userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        ARAssignCompetencyPage.getUsersDDownOpt(userDetails.firstName.substring(0, 5))
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARAssignCompetencyPage.getA5SaveBtn()).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

    })

    it("Verify that the badges section is displayed in a learner's social profile", () => {
        // login in the learner side with the newly created user  
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Click on nav profile button
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clicking on the Social Profile button
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
      


        //Verify that the top banner section has been laid out
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Badges').should('be.visible')

      
        //Sections should be laid out
        cy.get(LESocialProfilePage.getSocialProfileBadgesModuleTitle()).should('be.visible')
       

        //get first badge and assert its image and title
        cy.get(LESocialProfilePage.getBadgeBtn()).first().find('img').should('be.visible')
        cy.get(LESocialProfilePage.getBadgeBtn()).first().find('span').should('be.visible')

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 60000 }).should('not.exist')
        //Asserting Courses Count 

        //Clicking on the first badge
        cy.get(LESocialProfilePage.getBadgeBtn()).first().click()

        cy.get(LESocialProfilePage.getCompetencyDialogueModal()).should('have.attr', 'aria-modal', 'true')
        cy.get(LESocialProfilePage.getCompetencyModalDate()).should('exist')

    })


    it("Clean Up ", () => {
        //Go to competency report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCompetenciesReport()
        //Delete created competency
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        ARDashboardPage.A5AddFilter('Name', 'Contains', competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getA5RemoveAllFilterBtn()).should('be.visible')
        cy.get(ARDashboardPage.getA5TableCellRecord()).contains(competencyDetails.competencyName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).should('exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click({ force: true })

        cy.get(ARDeleteModal.getA5OKBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')



        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

    })

})
