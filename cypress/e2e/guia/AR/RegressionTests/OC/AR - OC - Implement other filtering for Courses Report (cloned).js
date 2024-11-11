import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARTagsAddEditPage from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsAddEditPage";
import  ARTagsPage from "../../../../../../helpers/AR/pageObjects/Tags/ARTagsPage";
import { tags } from "../../../../../../helpers/TestData/Tags/tagsDetails";
import { users } from "../../../../../../helpers/TestData/users/users";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc";

describe("C983 AUT-184, AR - OC - Implement other filtering for Courses Report (cloned)", function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)

        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName("Tags")

        // Search and Delete Tag
        ARTagsPage.AddFilter("Name", "Starts With", tags.tagName)
        ARTagsPage.selectTableCellRecord(tags.tagName, 2)
        ARTagsPage.WaitForElementStateToChange(ARTagsPage.getAddEditMenuActionsByName("Delete"))
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Delete")).click()
        cy.get(ARTagsPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        // Verify Tag is deleted
        cy.get(ARTagsPage.getNoResultMsg()).should("have.text", "No results found.")
    })
    
    it("Admin Create a  Tag", () => {
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        ARDashboardPage.getMenuItemOptionByName("Tags")

        // Create Tag
        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Tags")
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Add Tag")).click()
        cy.get(ARTagsAddEditPage.getElementByAriaLabelAttribute(ARTagsAddEditPage.getNameTxtF())).clear().type(tags.tagName)
        ARTagsAddEditPage.WaitForElementStateToChange(ARTagsAddEditPage.getSaveBtn())
        cy.get(ARTagsAddEditPage.getSaveBtn()).click()
        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Tags")
    })

    it('Add an Online Course with Add and Delete Tag', () => {
        ARDashboardPage.getCoursesReport()

        //Create Online Course
        cy.createCourse('Online Course')

        //Add Tag to Online Course
        cy.get(AROCAddEditPage.getGeneralTagsDDown()).click()
        cy.get(AROCAddEditPage.getGeneralTagsSearchF()).click().type(tags.tagName)
        cy.get(AROCAddEditPage.getGeneralTagsDDownOpt()).should('contain', tags.tagName)
        cy.get(AROCAddEditPage.getGeneralTagsDDownOpt()).contains(tags.tagName).click()
        cy.get(AROCAddEditPage.getGeneralTagsDDownOpt()).contains(tags.tagName).parents(AROCAddEditPage.getGeneralTagsDDownOpt()).should('have.attr', 'aria-selected', 'true')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Verify courses report is filtered by the selected tag', () => {
        ARDashboardPage.getCoursesReport()

        cy.get(AROCAddEditPage.getAddFilterBtn()).click()
        cy.get(AROCAddEditPage.getPropertyName() + AROCAddEditPage.getDDownField()).eq(0).click()
        cy.get(AROCAddEditPage.getPropertyNameDDownSearchTxtF()).type('Tags')
        cy.get(AROCAddEditPage.getPropertyNameDDownOpt()).should('contain', 'Tags')
        cy.get(AROCAddEditPage.getPropertyNameDDownOpt()).contains('Tags').click()


        cy.get(AROCAddEditPage.getOperator() + AROCAddEditPage.getDDownField()).eq(1).click()
        cy.get(arCoursesPage.getTagOperatorSearchF()).click().type(commonDetails.tagName)
        cy.get(AROCAddEditPage.getOperatorDDownOpt()).should('contain', commonDetails.tagName)
        cy.get(AROCAddEditPage.getOperatorDDownOpt()).contains(commonDetails.tagName).click({ force: true })
        
        // Verify Only one tag can be selected at a time
        cy.get(AROCAddEditPage.getOperator() + ' ' + arCoursesPage.getLabel()).eq(1).should('contain', commonDetails.tagName)

        cy.get(AROCAddEditPage.getOperator() + AROCAddEditPage.getDDownField()).eq(1).click()
        cy.get(arCoursesPage.getTagOperatorSearchF()).click().type(tags.tagName)
        cy.get(AROCAddEditPage.getOperatorDDownOpt()).should('contain', tags.tagName)
        cy.get(AROCAddEditPage.getOperatorDDownOpt()).contains(tags.tagName).click({ force: true })

        cy.get(AROCAddEditPage.getOperator() + ' ' + arCoursesPage.getLabel()).eq(1).should('not.contain', commonDetails.tagName)
        cy.get(AROCAddEditPage.getOperator() + ' ' + arCoursesPage.getLabel()).eq(1).should('contain', tags.tagName)

        cy.get(AROCAddEditPage.getSubmitAddFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        cy.get(arCoursesPage.getTableCellName(2), {timeout:10000}).should('contain', ocDetails.courseName)

        // Multiple filters can be selected
        AROCAddEditPage.AddFilter('Name', 'Starts With', ocDetails.courseName)
        cy.get(arCoursesPage.getTableCellName(2), {timeout:10000}).should('contain', ocDetails.courseName)
    })

    it("select a tag in the tag report and then select the courses button", () => {
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        ARDashboardPage.getMenuItemOptionByName("Tags")

        // Create Tag
        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Tags")
        
        // Search Tag
        ARTagsPage.AddFilter("Name", "Starts With", tags.tagName)
        ARTagsPage.selectTableCellRecord(tags.tagName, 2)
        ARTagsPage.WaitForElementStateToChange(ARTagsPage.getCoursesSingleContextBtn())
        cy.get(ARTagsPage.getCoursesSingleContextBtn()).click()

        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Courses")
        cy.get(ARTagsPage.getWaitSpinner()).should('not.exist')

        cy.get(arCoursesPage.getTableCellName(2), {timeout:10000}).should('contain', ocDetails.courseName)
    })

    it("Course Library can be selected as a filter option", () => {
        ARDashboardPage.getCoursesReport()
        
        cy.get(AROCAddEditPage.getAddFilterBtn()).click()
        cy.get(AROCAddEditPage.getPropertyName() + AROCAddEditPage.getDDownField()).eq(0).click()
        cy.get(AROCAddEditPage.getPropertyNameDDownSearchTxtF()).type('Course Library')
        cy.get(AROCAddEditPage.getPropertyNameDDownOpt()).should('contain', 'Course Library')
        cy.get(AROCAddEditPage.getPropertyNameDDownOpt()).contains('Course Library').click()

        cy.get(AROCAddEditPage.getOperator() + AROCAddEditPage.getDDownField()).eq(1).click()
        cy.get(AROCAddEditPage.getOperatorDDownOpt()).should('contain', 'Content Libraries')
        cy.get(AROCAddEditPage.getOperatorDDownOpt()).contains('Content Libraries').click({ force: true })

        cy.get(AROCAddEditPage.getSubmitAddFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})
