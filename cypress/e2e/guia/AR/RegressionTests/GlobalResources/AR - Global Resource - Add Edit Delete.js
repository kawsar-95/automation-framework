import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { resourceDetails } from '../../../../../../helpers/TestData/GlobalResources/globalResources'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arGlobalResourcePage  from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'



describe('C6646-C6603-C6650-AR - Global Resource - Add Edit Delete', function () {

  beforeEach(function () {
      // Sign in with System Admin account
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      arDashboardPage.getGlobalResourcesReport()
  })

  it('Verify Admin Can Create a New Global Resource',
  
    {
      retries: {
        runMode: 0,
        openMode: 0,
      },
    },

    () => {
    // Create Global Resource
    arDashboardPage.reportItemAction('Add Global Resource')
    arDashboardPage.getMediumWait()

    //Select a category
    cy.get(arGlobalResourcePage.getCategory()).click()
    arGlobalResourcePage.searchCategoriesAndSelect(["GUIA"]);      

    //Verify resource name cannot be empty
    cy.get(arGlobalResourcePage.getNameField()).type("name");
    cy.get(arGlobalResourcePage.getNameField()).clear();
    cy.get(arGlobalResourcePage.getGRNameFieldErrorMsg()).should('contain', 'Field is required.');

    //Enter valid resource name
    cy.get(arGlobalResourcePage.getNameField()).type(resourceDetails.resourceName)

    // Add a file upload
    // TODO This will need to be updated to use the new AE File Manager
    // cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
    // cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
    // cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.moose_filename)
    // cy.get(ARUploadFileModal.getA5SaveBtn()).click()

    //Enter description
    cy.get(arGlobalResourcePage.getDescriptionField()).type(resourceDetails.description)

    //Add tag
    cy.get(arGlobalResourcePage.getTagsDropDown()).click();
    cy.get(arGlobalResourcePage.getTagsOptions()).first().click();
    
    //Add an availability rule
    cy.get(arGlobalResourcePage.getAddAvailabilityRuleBtn()).click();
    // Add an avialabilit rules
    ARGlobalResourcePage.getAddRule(cy.get(ARGlobalResourcePage.getFirstRulesContainer()),'First Name','Contains',users.learner01.learner_01_fname)
    // A5GlobalResourceAddEditPage.getAddRule('First Name', 'Contains', users.learner01.learner_01_fname)

    //Save Global Resource
    cy.get(arGlobalResourcePage.getSaveBtn()).click();
    arDashboardPage.getMediumWait()
  })

  it('Verify Fields Persisted, Edit an Existing Global Resource', () => {
    //Filter for global resource and edit

    arGlobalResourcePage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
    // A5GlobalResourceAddEditPage.A5AddFilter('Name', 'Contains', resourceDetails.resourceName)
    arDashboardPage.getMediumWait()
    cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName).click()
    // cy.wrap(arDashboardPage.A5WaitForElementStateToChange(arDashboardPage.getARAddEditMenuActionsByIndex(1), 1000))
    arGlobalResourcePage.getARAddEditMenuActionsByNameThenClick('Edit Global Resource')
    arDashboardPage.getShortWait()

    //Verify category persisted and edit it
    cy.get(arGlobalResourcePage.getCategory()).click()
    arGlobalResourcePage.searchCategoriesAndSelect(["GUIA-CED"]);  
    //cy.get(A5GlobalResourceAddEditPage.getCategoryF()).should('contain', categories.guiaCategoryName)
    //cy.get(A5GlobalResourceAddEditPage.getCategoryDDown()).click()
    //cy.get(A5GlobalResourceAddEditPage.getCategoryDDownOpt()).contains(categories.rootCategoryName).click()

    //Verify name persisted and edit it
    cy.get(arGlobalResourcePage.getNameField()).should('have.value', resourceDetails.resourceName).type(commonDetails.appendText)

    //Verify file upload persisted
      // TODO This will need to be updated to use the new AE File Manager
    //cy.get(A5GlobalResourceAddEditPage.getFileTxtF()).invoke('val').then((val) => {
        // expect(val).to.contain(images.moose_filename.slice(0, -4))
    // })

    //Remove file upload and add URL attachment
    // cy.get(A5GlobalResourceAddEditPage.getFileTxtF()).clear().type(miscData.switching_to_absorb_img_url)

    //Verify description persisted and edit it
    cy.get(arGlobalResourcePage.getDescriptionField()).should('have.value', resourceDetails.description).type(commonDetails.appendText)

    //Verify tags persisted and delete it
    cy.get(arGlobalResourcePage.getdeleteexistingtag()).click()
    cy.get(arGlobalResourcePage.getTagsDropDown()).click();
    cy.get(arGlobalResourcePage.getTagsOptions()).eq(1).click()
    arDashboardPage.getMediumWait()
    cy.get(arGlobalResourcePage.getTagsDropDown()).click();

    cy.get(arGlobalResourcePage.getRulesBanner()).find(arGlobalResourcePage.getRuleTextF()).should('have.value', users.learner01.learner_01_fname)

    //Verify availability rule persisted and delete it
    cy.get(arGlobalResourcePage.getDeleteExistingAvailabilityRule()).click()
    //A5GlobalResourceAddEditPage.getDeleteRuleByIndex(1)

    //Save Global Resource
    cy.get(arGlobalResourcePage.getSaveBtn()).click()
    arDashboardPage.getShortWait()
  })

  it('Delete an Existing Global Resource', () => {
    ARGlobalResourcePage.AddFilter('Name', 'Contains', resourceDetails.resourceName + commonDetails.appendText)
    arDashboardPage.getShortWait()
    cy.get(arDashboardPage.getTableCellName(2)).contains(resourceDetails.resourceName + commonDetails.appendText).click()

    arGlobalResourcePage.getARDeleteMenuActionsByNameThenClick('Delete Global Resource')

    //Verify delete action 
    cy.get(ARDeleteModal.getARDeleteBtn()).click()
    arDashboardPage.getShortWait()
  })
})