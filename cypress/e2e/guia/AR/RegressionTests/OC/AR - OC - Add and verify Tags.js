/// <reference types="cypress" />
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import { default as ARTagsAddEditPage } from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsAddEditPage";
import { default as ARTagsPage } from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsPage";
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu";
import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import { tags } from "../../../../../../helpers/TestData/Tags/tagsDetails";
import { users } from "../../../../../../helpers/TestData/users/users";
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";

describe("C6386 AR - OC - Add And Verify - Tags", function () {
    const tagName = tags.tagName;

    this.beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
    });

    it("admin to create Tag", () => {
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        ARDashboardPage.getMenuItemOptionByName("Tags");
        cy.intercept("**/operations").as("getTags").wait("@getTags");

        // Create Tag
        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Tags");
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Add Tag")).click();
        cy.get(ARTagsAddEditPage.getElementByAriaLabelAttribute(ARTagsAddEditPage.getNameTxtF())).clear().type(tagName);
        ARTagsAddEditPage.WaitForElementStateToChange(ARTagsAddEditPage.getSaveBtn())
        cy.get(ARTagsAddEditPage.getSaveBtn()).click();
        ARTagsAddEditPage.getShortWait();
    });

    it("Edit Course With Tag", () => {
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click();
        // Again Click the Courses menu item
        ARDashboardPage.getMenuItemOptionByName("Courses");
        ARCoursesPage.getEditCourseByName(courses.oc_filter_01_name)

        ARTagsAddEditPage.navigateToTag();
        ARTagsAddEditPage.getShortWait();
        ARTagsAddEditPage.getChooseAndClick();
        ARTagsAddEditPage.getShortWait();
        cy.get(ARTagsAddEditPage.getTagInput()).click().type(tagName)
        ARTagsAddEditPage.getLongWait();
        cy.get(ARTagsAddEditPage.getSearchOptions()).contains(tagName).click()

        // Publish Course
        cy.publishCourse({ timeout: 5000 });
        ARTagsAddEditPage.getVLongWait();
    });

    it("Check Tag Displayed", () => {
        // Connect to the learner side and submit a poll
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click();
        ARTagsAddEditPage.getMediumWait(); // This wait is needed for Navigation to Learner side in Firefox
        cy.get(ARTagsAddEditPage.getLearnerExperienceBtn()).contains("Learner Experience").click();
        ARTagsAddEditPage.getShortWait()


        //Go to Course Details
        LEDashboardPage.getRibbonLableUsingAreaLableByName('Catalog').click()
        ARTagsAddEditPage.getShortWait()
        cy.get(LEFilterMenu. getShowFiltersBtn()).click()
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getElementByNameAttribute("filter_picker")).select("Tags")
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getElementByDataNameAttribute("field")).click()
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getElementByDataNameAttribute("input")).click().type(tagName)
        ARTagsAddEditPage.getShortWait()
        ARTagsAddEditPage.getSearchedTag().click()
        ARTagsAddEditPage.getShortWait()
    });

    after(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
        ARDashboardPage.getMediumWait()
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()

        // Search and Delete Tag
        ARDashboardPage.getMenuItemOptionByName("Tags");
        cy.intercept("**/operations").as("getTags").wait("@getTags");

        ARTagsPage.AddFilter("Name", "Starts With", tagName);
        ARTagsPage.selectTableCellRecordByIndexAndName(tagName,2);
        ARTagsPage.WaitForElementStateToChange(ARTagsPage.getAddEditMenuActionsByName("Delete"));
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Delete")).click();
        cy.get(ARTagsPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait("@getTags");
        // Verify Tag is deleted
        cy.get(ARTagsPage.getNoResultMsg()).should("have.text", "No results found.");
    });
});
