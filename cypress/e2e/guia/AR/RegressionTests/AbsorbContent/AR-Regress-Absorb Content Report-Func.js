import AREquivalentCoursesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/AREquivalentCourses.module";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage";
import ARResourceCategoryPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARResourceCategoryPage";
import ARViewHistoryModal from "../../../../../../helpers/AR/pageObjects/Modals/ARViewHistoryModal";
import ARAbsorbContentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARAbsorbContentReportPage";
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage";
import { users } from "../../../../../../helpers/TestData/users/users";




describe('C12097- Absorb Content Report, Filtering, Course card, Discovery Modal, pagination', () => {
    beforeEach(() => {
        // Login as a sys admin and visit to course page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getAbsorbContentReport({timeout:3000})
    })

    it('Absorb Content Report page Attritubes ', () => {

        //Verify that the following are visible (Page title, Breadcrumb, Filtet button, select course button*, Categories*, Course cards,
        // pagination, contract)
    
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPageTitle()).should('have.text','Absorb Content')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentBreadCrumb()).should('be.visible')
        cy.get(ARGlobalResourcePage.getAddFilterBtn()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCategoryTitle()).should('be.visible').and('contain','Categories')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentSelectCoursesBtn()).should('have.text','Select Courses')
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCourseCard()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsrobContentGridFooter()).should('be.visible')
    
    })

    it('Verify the Function of the Contract Selector',() => {

        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentFltOperator()).click({timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDDTags()).eq(1).click()
        cy.get(ARAbsorbContentReportPage.getSubmitAddFilterBtn()).contains('Update Filter').click({timeout:10000}) 

    })

    it('Verify Category title function', () =>{

        //Verify that Category tiles and function
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCategoryTile()).should('be.visible').first().click({timeout:20000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCategoryTile()).eq(1).click({timeout:5000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentNavToParentCategoryBtn()).should('be.visible').click({timeout:5000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentRemoveAllFiltersBtn()).should('be.visible').click()
    })

    it('Verify the function of pagination',() =>{
  
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentFltOperator()).click({timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDDTags()).eq(1).click()
        cy.get(ARAbsorbContentReportPage.getSubmitAddFilterBtn()).contains('Update Filter').click({timeout:10000}) 
        cy.get(ARAbsorbContentReportPage.getAbsorbContentLastPage()).click({timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentFirstPage()).click({timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPageNum()).eq(1).click()

    })

    it('Verify Add/edit/delete Filter function',() =>{

       // Add Multiple Filter types 
       ARAbsorbContentReportPage.AddAbsorbContentFilterContentType('Content Type')
       ARAbsorbContentReportPage.AddAbsorbContentFilterContentType('Converted to Course')
       ARAbsorbContentReportPage.AddAbsorbContentFilterTags('Languages')
       ARAbsorbContentReportPage.AddAbsorbContentFilterTags('Tags')
       ARAbsorbContentReportPage.AddAbsorbContentFilterCategories('Category')

       //Update Filter 
       ARAbsorbContentReportPage.UpdateAbsorbContentFilter('Course')
       ARAbsorbContentReportPage.UpdateAbsorbContentFilterCC('No')

       //Revert Report back to default remove all filters and columns 
       AREquivalentCoursesModule.RemoveAllCourseEqFilters()  

    })

    it('Verify the Function of the Course card, select courses and Discovery Modal',() =>{

        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardImg()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardTitle()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardConType()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardSubTxt()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardConvertBtn()).should('be.visible').and( 'contain','Convert')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardPreviewBtn()).should('be.visible').and('contain','Preview')

        // Verify the Discovery Modal function 
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardImg()).first().click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDiscModal()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDiscDetails()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardConvertBtn()).should('be.visible').and('contain','Convert')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDiscPreviewBtn()).should('be.visible').and('contain','Preview')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDiscDesc()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDiscTags()).should('be.visible')
        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).should('be.visible').click().and('contain','Close')

        //Verify the Preview function {From course card}
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardPreviewBtn()).contains('Preview').click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreviewPopUp()).should('be.visible',{timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreiewMsg()).should('be.visible').and('contain','Your Lesson is playing in a new window.')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreviewTxt()).should('be.visible').and('contain','If you do not see the Lesson, please ensure you have allowed pop-ups in your browser for this web page.')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreviewClsBtn()).should('be.visible').click({timeout:2000})

        //Verify Preview from Discovery Modal
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardImg()).first().click({timeout:2000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDiscPreviewBtn()).eq(1).click({timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreviewPopUp()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreiewMsg()).should('be.visible').and('contain','Your Lesson is playing in a new window.')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreviewTxt()).should('be.visible').and('contain','If you do not see the Lesson, please ensure you have allowed pop-ups in your browser for this web page.')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentPreviewClsBtn()).should('be.visible').click({timeout:2000})
        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).contains('Close').click()

    })
    
    })