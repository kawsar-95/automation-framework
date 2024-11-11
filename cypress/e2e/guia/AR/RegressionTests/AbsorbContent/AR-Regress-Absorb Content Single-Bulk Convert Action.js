import ARBasePage from "../../../../../../helpers/AR/ARBasePage";
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


    it('Single Select and Convert to Course ',() =>{

        //Verify the Select Mode Convert  {Self Enroll All learners} 
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentFltOperator()).click({timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDDTags()).eq(1).click()
        cy.get(ARAbsorbContentReportPage.getSubmitAddFilterBtn()).contains('Update Filter').click({timeout:5000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentSelectCoursesBtn()).click({timeout:10000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardImg()).eq(3).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentNumbOfItems()).should('be.visible').scrollIntoView().and('have.text','1 item(s) selected')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvertBtn()).should('be.visible').and('have.text','Convert to Course').click({force:true})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvertModal()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvertModalTitle()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentModalMsgNotF()).should('be.visible').and('contain','The following Course(s) will be created and added to the Courses Report. All Courses created are Active.')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCourseList()).should('be.visible')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvSlfEnrl()).should('be.visible')
        ARAbsorbContentReportPage.getAllowConvSelfEnrollmentRadioBtn('All Learners')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCertTogl()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentModalConvertBtn()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardImg()).eq(3).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentSelectCoursesCancelBtn()).scrollIntoView().should('be.visible').and('contain','Cancel').click()

        //Verify Converted course on Course Report 
        ARDashboardPage.getCoursesReport()
        ARAbsorbContentReportPage.AddDateFilterCourseReport('Date Added')
    })

    it('Convert to Course from course card and discovery modal',() =>{

        //Verify the Convert course function from course card
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardConvertBtn()).eq(1).click()
        ARAbsorbContentReportPage.getAbsorbContentConvAutoEnrl('All Learners')
        cy.get(ARDashboardPage.getChooseFileBtn()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDeptSelectBox()).eq(0).click()
        cy.get(AREquivalentCoursesModule.getEqOkBtn()).click({timeout:2000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvEditorSelector()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvEditorListPicker()).eq(1).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvEditorSelector()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentModalConvertBtn()).click()

        //Verify the Convert course function from Discovery Modal {Automatic/specific enrollment}
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCardImg()).eq(0).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDiscConvertBtn()).click()
        ARAbsorbContentReportPage.getAbsorbContentConvAutoEnrl('Specific')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentModalConvertBtn()).should('be.disabled')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentAddRuleBtn()).click()
        cy.get(ARGlobalResourcePage.getRefineRuleBtn()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDeleteBtn()).eq(0).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCertTogl()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentModalConvertBtn()).click()
        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).contains('Close').click()

        //Verify Converted course on Course Report 
        ARDashboardPage.getCoursesReport()
        ARAbsorbContentReportPage.AddDateFilterCourseReport('Date Added')
    })

    it('Select All and Convert Action',() =>{

        //Verify that user can bulk select and convert course{Self Enroll All learner & Automatic enrollment Specific}
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentFltOperator()).click({timeout:3000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDDTags()).eq(1).click()
        cy.get(ARAbsorbContentReportPage.getSubmitAddFilterBtn()).contains('Update Filter').click({timeout:10000}) 
        cy.get(ARAbsorbContentReportPage.getAbsorbContentItemsPPSelector()).select(2,{timeout:2*2000})  
        ARDashboardPage.getLongWait() // Had to use the wait logic here as timeout was giving enough time to return the Api request for both the course cards and Categories requests
        cy.get(ARAbsorbContentReportPage.getAbsorbContentSelectCoursesBtn()).click({timeout:5000}) 
        cy.get(ARAbsorbContentReportPage.getAbsorbContentSelectAllBtn()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvertBtn()).click()
        ARAbsorbContentReportPage.scrollToMoreCourses()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentModalMoreCoursesTxt()).should('be.visible')
        ARAbsorbContentReportPage.getAllowConvSelfEnrollmentRadioBtn('All Learners')
        ARAbsorbContentReportPage.getAbsorbContentConvAutoEnrl('Specific')
        cy.get(ARAbsorbContentReportPage.getAbsorbContentAddRuleBtn()).click()
        ARAbsorbContentReportPage.AddAbsorbContentEnrollmentRule('Username')
        cy.get(ARGlobalResourcePage.getRefineRuleBtn()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentCertTogl()).click()
        cy.get(ARDashboardPage.getChooseFileBtn()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentDeptSelectBox()).eq(0).click()
        cy.get(AREquivalentCoursesModule.getEqOkBtn()).click({timeout:2000})
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvEditorSelector()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvEditorListPicker()).eq(1).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentConvEditorSelector()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentModalConvertBtn()).click()
        cy.get(ARAbsorbContentReportPage.getAbsorbContentSelectCoursesCancelBtn()).click()

    })

})