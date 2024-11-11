import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import { ocDetails, ocViewHistoryDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { commonDetails} from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import AREquivalentCoursesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/AREquivalentCourses.module"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARViewHistoryModal from "../../../../../../helpers/AR/pageObjects/Modals/ARViewHistoryModal"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import ARBasePage from "../../../../../../helpers/AR/ARBasePage"



describe('C9178,C9181 - AR -  Course Equivalency - Regression - Add Course Equivalent NOTE: Portal Toggle "Enable Course Equivalency should be enabled for Test client', function() {
    beforeEach(() => {
        // Login as a sys admin and visit to course page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getCoursesReport()
    })
    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID)
  })

         it('Create course with no equivalencies', () => {
           // Create a course for all learners with lang "English"
           cy.createCourse('Online Course', ocDetails.courseName)
           cy.get(ARAddMoreCourseSettingsModule.getCourseLangDDown()).first().click()
           // Set enrollment rule - Allow self enrollment for all learners
           cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

           // Store the course id for later use
         cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
         })


         })

         it('Verify Add/Remove Equivalent Course function on the Add online course form ' , () => { 
         // Click On Add Online Course Btn
         cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Online Course')).click({timeout:3000})
         ARCBAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())
         cy.get(AROCAddEditPage.getGeneralTitleTxtF()).should('have.value', 'Course Name').clear().type(ocDetails.courseName+commonDetails.CourseEquivalent, {timeout:5000})

         // All fields in general section : Status, Title (Required), Description, Language, Tags, Automatic Tagging, Equivalent Courses
         cy.get(AROCAddEditPage.getGeneralLabels()).children().should(($child) => {
            expect($child).to.contain('Status')
            expect($child).to.contain('Title (Required)')
            expect($child).to.contain('Description')
            expect($child).to.contain('Language')
            expect($child).to.contain('Tags')
            expect($child).to.contain('Automatic Tagging')
            expect($child).to.contain('Equivalent Courses')
         })
         AREquivalentCoursesModule.scrollToEquivalentCourse()
         cy.get(AREquivalentCoursesModule.getEquivalentCourseName()).should('have.text','Equivalent Courses')
         cy.get(AREquivalentCoursesModule.getEquivalentCourseDesc()).should('have.text','This course will be defined as equivalent to all selected courses')
         cy.get(AREquivalentCoursesModule.getEquivalentCourseBtn()).should('have.text','Manage Equivalent Courses',{timeout:3000}).click()

         //Verify Select Course Modal(Search, Loadmore, Number of items per page, Number of selected items,select course)
         cy.get(AREquivalentCoursesModule.getEquivalentCourseCount()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEquivalentItem()).contains('0 item(s) selected').should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqNumberTxt()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqLoadMoreBtn()).should('have.text','Load More', {timeout:5000}).click()
         cy.get(AREquivalentCoursesModule.getEqCourseStatus()).first().should('have.text','(Inactive)',{timeout:5000})
         cy.get(AREquivalentCoursesModule.getEqSearch()).type('EQU',{timeout:5000})
         cy.get(AREquivalentCoursesModule.getEqSearch()).clear()
         cy.get(ARCBAddEditPage.getCancelBtn()).first().click()
         cy.get(AREquivalentCoursesModule.getEquivalentCourseBtn()).should('be.visible', {timeout:5000}).click()
         cy.get(AREquivalentCoursesModule.getEqSearch()).type((ocDetails.courseName))
         cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist',{timeout:10*10000})
         cy.get(AREquivalentCoursesModule.getEqSelectOpt()).should('be.visible',{timeout:2000}).first().click()
         cy.get(AREquivalentCoursesModule.getEqSearch()).clear({timeout:6000})
         cy.get(AREquivalentCoursesModule.getEqSelectOpt()).eq(0).click()
         cy.get(AREquivalentCoursesModule.getEqSelectOpt()).eq(1).click()
         cy.get(AREquivalentCoursesModule.getEqSelectOpt()).eq(2).click()
         cy.get(AREquivalentCoursesModule.getEqOkBtn()).contains('OK',{timeout:2000}).click()
         cy.get(AREquivalentCoursesModule.getEqOkBtn()).contains('Apply').click({force:true}, {timeout:5000})
         AREquivalentCoursesModule.scrollToEquivalentCourse()

         //Verify Equivalent Course List items
         cy.get(AREquivalentCoursesModule.getEqListNumber()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqCourseTitle()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqEditBtn()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqExpToggle()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqDeleteBtn()).should('be.visible')

         //Verify that Equivalent course can be removed from the Add online course Form
         cy.get(AREquivalentCoursesModule.getEqDeleteBtn()).eq(1).click()
         cy.get(AREquivalentCoursesModule.getEqRemoveModalTitle()).should('have.text', 'Remove Equivalency')
         cy.get(AREquivalentCoursesModule.getEqRemovalModal()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqRemoveBtn()).contains('Remove').should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqRemovalModal()).contains('Cancel').should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqRemovalModal()).contains('Cancel').click()
         cy.get(AREquivalentCoursesModule.getEqDeleteBtn()).eq(0).click({timeout:3000})
         cy.get(AREquivalentCoursesModule.getEqRemoveBtn()).contains('Remove',{timeout:3000}).click()

         cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click({force:true})

         // Store the course id for later use
         cy.publishCourseAndReturnId({timeout:3000}).then((id) => {
         commonDetails.courseID = id.request.url.slice(-36);

         })
    })

        it('Verify New created course equivalent details are present on View history modal', () => {
        
         //Filter for Equivalent course does it exists or not
         ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName+commonDetails.CourseEquivalent, {timeout:5000})
         ARDashboardPage.selectTableCellRecordByIndexAndName(ocDetails.courseName+commonDetails.CourseEquivalent,2)

         // click on edit online course button
         AREquivalentCoursesModule.getAREditOcMenuActionsByNameThenClick('Edit')
         ARDashboardPage.getMediumWait()

         //Verify that the view history modal has the course equivalent details
         cy.get(ARCBAddEditPage.getViewHistoryBtn()).click()
         ARDashboardPage.getMediumWait()
         cy.get(ARViewHistoryModal.getViewHistoryModalTitle()).contains(ocViewHistoryDetails.OcViewHistory)
         cy.get(AREquivalentCoursesModule.getAdminUsername()).contains('System')
         cy.get(AREquivalentCoursesModule.getEqHistoryDetails()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getHistoryModalViewBtn()).should('be.visible').click({ multiple: true })
         cy.get(ARCBAddEditPage.getCloseModal()).should('be.visible',{timeout:3000}).click()
         

         })


        it('Verify Course Details and Modify Course Equivalent', () => {

         //Filter for Equivalent course 
         ARDashboardPage.AddFilter('Name', 'Contains', ocDetails.courseName+commonDetails.CourseEquivalent, {timeout:5000})
         ARDashboardPage.selectTableCellRecordByIndexAndName(ocDetails.courseName+commonDetails.CourseEquivalent,2)

         // click on edit online course button
         AREquivalentCoursesModule.getAREditOcMenuActionsByNameThenClick('Edit')
         ARDashboardPage.getMediumWait()
         

         //Verify Course Details 
         cy.get(AREquivalentCoursesModule.getEqExpToggle()).eq(1).click({timeout:5000})
         cy.get(AREquivalentCoursesModule.getEqCourseDesc()).should('have.text','Description')
         cy.get(AREquivalentCoursesModule.getEqCourseCompt()).should('have.text','Awarded Competencies')
         cy.get(AREquivalentCoursesModule.getEqCourseTag()).should('have.text','Tags')
 
         //Verify course with no description,competencies or tags text 
         cy.get(AREquivalentCoursesModule.getEqNoDescText()).should('have.text', 'No Description')
         cy.get(AREquivalentCoursesModule.getEqNoComptText()).should('have.text', 'This course does not award any competencies.')
         cy.get(AREquivalentCoursesModule.getEqNoTagText()).should('have.text', 'This course does not have any tags configured.')

         //Modify Course Equivalent

         cy.get(AREquivalentCoursesModule.getEquivalentCourseBtn()).click()
         cy.get(AREquivalentCoursesModule.getEqSearch()).type('Admin Visibility/ Equivalent', {timeout:10000})
         cy.get(AREquivalentCoursesModule.getEqSelectOpt()).eq(0).should('be.visible',{timeout:2000}).click()
         cy.get(AREquivalentCoursesModule.getEqOkBtn()).contains('OK',{timeout:2000}).click()
         cy.get(AREquivalentCoursesModule.getEqOkBtn()).contains('Apply', {timeout:5000}).click({force:true})
         AREquivalentCoursesModule.scrollToEquivalentCourse()
         cy.get(AREquivalentCoursesModule.getEqExpToggle()).eq(0).should('be.visible',{timeout:2000}).click()
         
         //Verify Course with Description, competencies or tags
         cy.get(AREquivalentCoursesModule.getEqDescReadBtn()).should('have.text','Read More',{timeout:3000}).click()
         cy.get(AREquivalentCoursesModule.getEqComptDetails()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqComptBadge()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqComptLevel()).should('be.visible')
         cy.get(AREquivalentCoursesModule.getEqExpToggle()).eq(0).click()

         //Verify that Clicking on the Edit link open the Edit online course page
         cy.get(AREquivalentCoursesModule.getEqEditLink()).eq(1).click()

         })
        })
    

