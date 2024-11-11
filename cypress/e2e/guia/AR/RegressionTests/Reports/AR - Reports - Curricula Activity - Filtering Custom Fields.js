import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C1514 - Filtering Custom Fields', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    it('Filtering Custom Fields', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Curricula Activity'))
        ARDashboardPage.getMediumWait()
        ARCurriculaActivityReportPage.ChooseAddFilter(courses.curr_filter_01_name)
        ARDashboardPage.getMediumWait()
        // Custom fields are available for Curricula Activity report
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        // Custom Boolean field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA Boolean Custom Field').click({ force: true })
        // Custom Number field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA Number Custom Field').click({ force: true })
        // Custom Decimal field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA Decimal Custom Field').click({ force: true })
        // Custom List field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA List Custom Field').click({ force: true })
        // Custom Text field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA Text Custom Field').click({ force: true })
        // Custom Date field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA Date Custom Field').click({ force: true })
        // Custom Date Time field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA Date Time Custom Field').click({ force: true })
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })
        
        // Filter/Sort Custom Boolean field
        ARDashboardPage.AddFilter('GUIA Boolean Custom Field', 'Yes')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'Yes')
        })
        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        ARDashboardPage.AddFilter('GUIA Boolean Custom Field', 'Not Set')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'Not Set')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Number field Equals
        ARDashboardPage.AddFilter('GUIA Number Custom Field','Equals','1000')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', '1000')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Number field Greater Than
        ARDashboardPage.AddFilter('GUIA Number Custom Field','Greater Than','900')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', '900')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Number field Less Than
        ARDashboardPage.AddFilter('GUIA Number Custom Field','Less Than','1100')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', '1100')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        
        // Filter Custom Decimal field Equals
        ARDashboardPage.AddFilter('GUIA Decimal Custom Field','Equals','-1.5')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', '-1.5')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Number field Greater Than
        ARDashboardPage.AddFilter('GUIA Number Custom Field','Greater Than','-3')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', '-3')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Number field Less Than
        ARDashboardPage.AddFilter('GUIA Number Custom Field','Less Than','0')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', '0')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom List field Item 1
        ARDashboardPage.AddFilter('GUIA List Custom Field','List Item 1')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'List Item 1')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom List field List Item 2
        ARDashboardPage.AddFilter('GUIA List Custom Field','List Item 2')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'List Item 2')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()

        // Filter Custom Text field Contains
        ARDashboardPage.AddFilter('GUIA Text Custom Field','Contains','a')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'a')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Text field Does Not Contain
        ARDashboardPage.AddFilter('GUIA Text Custom Field','Does Not Contain','a')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'a')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Text field Does Not Equal
        ARDashboardPage.AddFilter('GUIA Text Custom Field','Does Not Equal','a')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'a')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Text field Ends With
        ARDashboardPage.AddFilter('GUIA Text Custom Field','Ends With','a')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'a')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Text field Equals
        ARDashboardPage.AddFilter('GUIA Text Custom Field','Equals','a')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'a')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        // Filter Custom Text field Starts With
        ARDashboardPage.AddFilter('GUIA Text Custom Field','Starts With','a')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('filter-edit')).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'a')
        })
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
        
        //Create/Load a Saved Layout
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Report Layouts')).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('create-full')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Nickname')).type(miscData.layout_name_1)
        cy.get(ARDashboardPage.getElementByDataNameAttribute('save')).click()
        
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Generate Report File')).click()
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatDDown()).click()
        //Select Excel
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatOption()).eq(0).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('generate-report-button')).click()

        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Report Generation Requested.')
        LEDashboardPage.waitForLoader(ARDashboardPage.getWaitSpinner())
        cy.get(ARCourseActivityReportPage.getDownloadReportBtn()).click()

        //Delete created layout
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Selected Report Layout')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete Layout')).click()
    })
})