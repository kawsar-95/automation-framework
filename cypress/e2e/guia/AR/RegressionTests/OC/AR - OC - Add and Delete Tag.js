import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import { default as ARTagsAddEditPage } from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsAddEditPage";
import { default as ARTagsPage } from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsPage";
import { tags } from "../../../../../../helpers/TestData/Tags/tagsDetails";
import { users } from "../../../../../../helpers/TestData/users/users";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";

describe("C765 AR - OC - Add And Delete - Tag", function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

    })

    //First Admin Create a Tag For an Online Course
    it("Admin Create a  Tag", () => {
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        ARDashboardPage.getMenuItemOptionByName("Tags");
        cy.intercept("**/operations").as("getTags").wait("@getTags");

        // Create Tag
        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Tags");
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Add Tag")).click();
        cy.get(ARTagsAddEditPage.getElementByAriaLabelAttribute(ARTagsAddEditPage.getNameTxtF())).clear().type(tags.tagName);
        ARTagsAddEditPage.WaitForElementStateToChange(ARTagsAddEditPage.getSaveBtn())
        cy.get(ARTagsAddEditPage.getSaveBtn()).click();
        ARTagsAddEditPage.getShortWait();
    })


    it('Add an Online Course with Add and Delete Tag', () => {
        //click on Course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        //Create Online Course
        cy.createCourse('Online Course')

        //Add Tag to Online Course
        ARTagsAddEditPage.navigateToTag();
        ARTagsAddEditPage.getShortWait();
        ARTagsAddEditPage.getChooseAndClick();
        ARTagsAddEditPage.getShortWait();
        cy.get(ARTagsAddEditPage.getTagInput()).click().type(tags.tagName)
        ARTagsAddEditPage.getLongWait();
        ARTagsAddEditPage.getTagSearchOptionsDDownOpt().contains(tags.tagName).click();

        ARTagsAddEditPage.getShortWait();

        //Click outside
        cy.get('body').click({ force: true });
        ARTagsAddEditPage.getShortWait();

        //Delete Tage from Course
        cy.get(ARTagsAddEditPage.getAddedTagContainer()).scrollIntoView().should('be.visible')
        cy.get(ARTagsAddEditPage.getAddedTagContainer()).within(() => {
            cy.get(ARDashboardPage.getElementByDataName("label")).should('contain', tags.tagName).parent().find("button").click()
        })


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)

        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
        ARDashboardPage.getMediumWait()
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()

        // Search and Delete Tag
        ARDashboardPage.getMenuItemOptionByName("Tags");
        cy.intercept("**/operations").as("getTags").wait("@getTags");

        ARTagsPage.AddFilter("Name", "Starts With", tags.tagName);
        ARTagsPage.selectTableCellRecord(tags.tagName);
        ARTagsPage.WaitForElementStateToChange(ARTagsPage.getAddEditMenuActionsByName("Delete"));
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Delete")).click();
        cy.get(ARTagsPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait("@getTags");
        // Verify Tag is deleted
        cy.get(ARTagsPage.getNoResultMsg()).should("have.text", "No results found.");
    });
});
