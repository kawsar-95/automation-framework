import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARDepartmentProgressReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage"
import ARTemplatesReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEManageTemplatePrivateDashboardPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage"
import LEManageTemplateTiles from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"

describe("C6361 - AR - Regress - Setup - Templates ", function () {
    after("Delete Course and Template ", function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)

        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        LEDashboardPage.getLShortWait()
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2 + parseInt([0]))).contains(departments.Dept_E_name).click()

        //Deleting Template
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getTemplateDeletebutton()).click()
        })
        cy.get(ARDeleteModal.getA5OKBtn()).click()

        //Clear All Filters 
        cy.get(ARTemplatesReportPage.getCLearAllFiltersButton()).click()
        ARDashboardPage.getShortWait()

        //Filterting the Dept 
        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.Dept_E_name)
        //Asserting Template was deleted
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })
    
    beforeEach(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Create OC Course with Catalog Visibility Toggles Turn ON', () => {
        // Navigate to Course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Online Course')

        //Open Catalog Visibility Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARDashboardPage.getShortWait()

        //Select a Category
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()
        ARSelectModal.SearchAndSelectFunction([courses.category_01_name])
        ARDashboardPage.getShortWait()

        //Add a Thumbnail Via URL Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('Url').click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailUrlTxtF()).type(miscData.switching_to_absorb_img_url)

        //Verify Recommended Course Toggles are OFF by Default, Then Turn ON
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Enable Recommended Courses')).should('have.attr', 'aria-checked', 'false')
        //Turn Toggle ON
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Enable Recommended Courses')).siblings('div').click()
        ARDashboardPage.getShortWait()

        //Add Recommended Course Tags
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).filter(':contains("Choose")').first().click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Recommendation Tags')).first().type(commonDetails.tagName)
        ARDashboardPage.getMediumWait()
        ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(commonDetails.tagName)
        ARDashboardPage.getShortWait()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it("Add a Template ", function () {
        //Navigate to Templates
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARTemplatesReportPage.getTemplatesPage()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', 'Templates')
        ARDashboardPage.getMediumWait()
        //Navigating to Add template Page
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
            cy.get(ARTemplatesReportPage.getAddtemplateButton()).click()
        })
        ARDashboardPage.getShortWait()
        //cy.get(ARTemplatesReportPage.getSectionHeader()).should('have.text','Add Template')
        ARTemplatesReportPage.SearchAndSelectFunction([departments.Dept_E_name])
        ARDashboardPage.getShortWait()
        cy.get(ARTemplatesReportPage.getWarningBanner()).should('not.be.false')
        //Click on Add Template 
        cy.get(ARDashboardPage.gettemplateAddbutton()).click({ force: true })
        ARDashboardPage.getMediumWait()
        //Click on Content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplatePrivateDashboardPage.getInheritSettingsModule()).within(function () {
            cy.get(LEManageTemplatePrivateDashboardPage.getToggleBtnToInheritSettingsOfParent()).click({ force: true })
        })

        //Need to find initial number of containers so we know which one to target when adding the tile
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            cy.get(LEManageTemplateTiles.getAddNewContainerBtn()).click()
            cy.get(LEManageTemplateTiles.getContainerByIndex($length + 1)).within(() => {
                cy.get(LEManageTemplateTiles.getContainerTypeDDown()).find('select').select('Ribbon')
                cy.get(LEManageTemplateTiles.getRibbonContainerLabelTxtF()).find('select').select('RecommendationsByLastCompletion')
            })

            //Add Another container
            cy.get(LEManageTemplateTiles.getAddNewContainerBtn()).click()
            cy.get(LEManageTemplateTiles.getContainerByIndex($length + 2)).within(() => {
                cy.get(LEManageTemplateTiles.getContainerTypeDDown()).find('select').select('Ribbon')
                cy.get(LEManageTemplateTiles.getRibbonContainerLabelTxtF()).find('select').select('RecommendationsByAllCompletions')
            })
        })

        //Save changes
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
        LEDashboardPage.getLShortWait()

        cy.get(LEManageTemplatePrivateDashboardPage.getReturnToAdminTemplateBtn()).click()
        LEDashboardPage.getMediumWait()
    })
})