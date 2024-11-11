import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARTagsAddEditPage from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsAddEditPage"
import ARTagsPage from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { tags } from "../../../../../../helpers/TestData/Tags/tagsDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe("C2070 - NLE 2747 - Tags can be created within Courses", () => {
    const tagName = [tags.tagName, tags.tagName1, tags.tagName2, tags.tagName3, tags.tagName4]
    beforeEach("Login as an admin", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMediumWait()
    })

    after("Delete Course and tags as part of clean-up", () => {
        cy.deleteCourse(commonDetails.courseID)

        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()

        // Search and Delete Tag
        ARDashboardPage.getMenuItemOptionByName("Tags")
        cy.intercept("**/operations").as("getTags").wait("@getTags")

        for (let i = 0; i < tagName.length - 1; i++) {
            ARTagsPage.AddFilter("Name", "Starts With", tagName[i])
            //Tag should be displayed within the "Tag List"
            ARTagsPage.selectTableCellRecordByIndexAndName(tagName[i],2)
            ARTagsPage.WaitForElementStateToChange(ARTagsPage.getAddEditMenuActionsByName("Delete"))
            cy.get(ARTagsPage.getAddEditMenuActionsByName("Delete")).click()
            cy.get(ARTagsPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait("@getTags")
            // Verify Tag is deleted
            cy.get(ARTagsPage.getNoResultMsg()).should("have.text", "No results found.")
        }
    })

    it("Add New tag", () => {
        // Click the Courses menu item
        ARDashboardPage.getMenuItemOptionByName("Tags")
        cy.intercept("**/operations").as("getTags").wait("@getTags")

        // Create Tag
        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Tags")
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Add Tag")).click()
        cy.get(ARTagsAddEditPage.getElementByAriaLabelAttribute(ARTagsAddEditPage.getNameTxtF())).clear().type(tagName[0])
        ARTagsAddEditPage.WaitForElementStateToChange(ARTagsAddEditPage.getSaveBtn())
        cy.get(ARTagsAddEditPage.getSaveBtn()).click()
        ARTagsAddEditPage.getShortWait()
    })

    it('Verify that an admin can add new tag during creation of a Online Course', () => {
        // Click the Courses menu item
        ARDashboardPage.getMenuItemOptionByName("Courses")
        ARDashboardPage.getMediumWait()
        cy.createCourse('Online Course')
        ARDashboardPage.getShortWait()
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')

        // Add tag
        ARTagsAddEditPage.navigateToTag()
        ARTagsAddEditPage.getShortWait()
        ARTagsAddEditPage.getChooseAndClick()
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getTagInput()).click().type(tagName[0])
        ARTagsAddEditPage.getMediumWait()
        ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(tagName[0])

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })


    it('Verify that Admin can create tags while editing an Online Courses', () => {
        // Again Click the Courses menu item
        ARDashboardPage.getMenuItemOptionByName("Courses")

        ARDashboardPage.getMediumWait()

        ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName)
        ARDashboardPage.getShortWait()
        // Select filtered course
        cy.get(ARDashboardPage.getTableCellRecord(ocDetails.courseName)).click()
        ARDashboardPage.getLongWait()
        // Click on Edit Course
        cy.get(AREnrollUsersPage.getAddEditMenuActionsByName('Edit')).click({ force: true })
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')

        // Add tag
        ARTagsAddEditPage.navigateToTag()
        ARTagsAddEditPage.getShortWait()
        ARTagsAddEditPage.getChooseAndClick()
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getTagInput()).click().type(miscData.auto_tag1)
        ARTagsAddEditPage.getMediumWait()
        ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(miscData.auto_tag1)
        cy.get(ARTagsAddEditPage.getTagInput()).click().clear().type(tagName[1])
        ARTagsAddEditPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataName("create-tag")).click()
        ARTagsAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getTagValue()).within(() => {
            cy.get(ARDashboardPage.getElementByDataName("label")).should('contain', tagName[1])
        })
        ARTagsAddEditPage.getMediumWait()
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getMediumWait()
    })


    it('An admin can create tags while creating or editing an Instructor Led Course', () => {
        // Click the Courses menu item
        ARDashboardPage.getMenuItemOptionByName("Courses")
        ARDashboardPage.getMediumWait()

        // Click Instructor led
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel(`Add Instructor Led`)).should('have.text', `Add Instructor Led`).click()
        ARDashboardPage.getVLongWait()

        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')

        // Add tag
        ARTagsAddEditPage.navigateToTag()
        ARTagsAddEditPage.getShortWait()
        ARTagsAddEditPage.getChooseAndClick()
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getTagInput()).click().clear().type(tagName[2])
        ARTagsAddEditPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataName("create-tag")).click()
        ARTagsAddEditPage.getMediumWait()
        cy.get(AROCAddEditPage.getTagValue()).within(() => {
            cy.get(ARDashboardPage.getElementByDataName("label")).should('contain', tagName[2])
        })
    })

    it('An Admin can create tags while creating or editing a Course Bundle', () => {
        // Click the Courses menu item
        ARDashboardPage.getMenuItemOptionByName("Courses")
        ARDashboardPage.getMediumWait()
        // Click course bundle
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel(`Add Course Bundle`)).should('have.text', `Add Course Bundle`).click()
        ARDashboardPage.getVLongWait()

        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')

        // Add tag
        ARTagsAddEditPage.navigateToTag()
        ARTagsAddEditPage.getShortWait()
        ARTagsAddEditPage.getChooseAndClick()
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getTagInput()).click().clear().type(tagName[3])
        ARTagsAddEditPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataName("create-tag")).click()
        ARTagsAddEditPage.getMediumWait()
        cy.get(AROCAddEditPage.getTagValue()).within(() => {
            cy.get(ARDashboardPage.getElementByDataName("label")).should('contain', tagName[3])
        })
    })

    it('An Admin can create tags while creating or editing a Curricula', () => {
        // Click the Courses menu item
        ARDashboardPage.getMenuItemOptionByName("Courses")
        ARDashboardPage.getMediumWait()

        // Click add curriculum
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel(`Add Curriculum`)).should('have.text', `Add Curriculum`).click()
        ARDashboardPage.getVLongWait()

        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')

        // Add tag
        ARTagsAddEditPage.navigateToTag()
        ARTagsAddEditPage.getShortWait()
        ARTagsAddEditPage.getChooseAndClick()
        ARTagsAddEditPage.getShortWait()
        cy.get(ARTagsAddEditPage.getTagInput()).click().clear().type(tagName[4])
        ARTagsAddEditPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataName("create-tag")).click()
        ARTagsAddEditPage.getMediumWait()
        cy.get(AROCAddEditPage.getTagValue()).within(() => {
            cy.get(ARDashboardPage.getElementByDataName("label")).should('contain', tagName[4])
        })
    })

    it('Verify that the newly added tag is displayed within the "Tag List"', () => {
        // Search and Delete Tag
        ARDashboardPage.getMenuItemOptionByName("Tags")
        ARDashboardPage.getMediumWait()
        ARTagsPage.AddFilter("Name", "Starts With", tagName[0])
        ARDashboardPage.getMediumWait()
        // Tag should be displayed within the "Tag List"
        cy.get(ARTagsPage.getTableCellRecord()).filter(`:contains(${tagName[0]})`).first().should('exist')
    })
})