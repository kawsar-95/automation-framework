import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arAddCommentsPage from '../../../../../../helpers/AR/pageObjects/Comments/ARAddCommentsPage'
import { competencyDetails } from '../../../../../../helpers/TestData/Competency/competencyDetails'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails, arrayOfCourses } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { commentsDetails } from '../../../../../../helpers/TestData/Comments/commentsDetails'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'


describe("C7429, C7431, C7432 - AR-Create course, add,update and delete comments",() =>{
    
    before(()=>{
        //Sign into admin side as sys admin, navigate to Collaborations
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Curriculum', 'GUIA-CED-CURR-2022-06-13T12:17:10+05:30')
        arSelectModal.SearchAndSelectFunction(arrayOfCourses.twoElementsArray)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        ARSelectModal.getLShortWait()
        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Allow Comments')
        cy.publishCourseAndReturnId().then((id) => {
          commonDetails.courseIDs.push(id.request.url.slice(-36))
      })    
        ARCourseSettingsCompletionModule.getMediumWait()
      })
      after(function () {
        cy.deleteCourse(commonDetails.courseID, 'curricula');
        arAddCommentsPage.A5AddFilter('Reply', 'Starts With', currDetails.commentReply_1)
        arAddCommentsPage.getLShortWait()
        cy.get("body").then($body => {
          if ($body.find(arAddCommentsPage.getNoResultFoundMessage()).length > 0)  { 
            cy.log("No record available to Delete") 
        }else{
          arManageCategoriesPage.SelectManageCategoryRecord()
          arAddCommentsPage.getA5AddEditMenuActionsByNameThenClick('Delete')
          arAddCommentsPage.clickOnDeleteConfirmation()
        }
       })
      })
      beforeEach(()=>{
        //Sign into admin side as sys admin, navigate to Comments menu
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCommentsReport()
    })
        
      it('should be allow to add a comments in above course',()=>{
        //Add New Comments by selecting Add comments option
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Add Comment')
        cy.get(arAddCommentsPage.getCourseTextBoxSelection()).contains('Choose').click()
        //validate course is available in drop down
        arAddCommentsPage.getLShortWait()
        cy.get(arAddCommentsPage.getCourseFromDropDown()).contains('GUIA-CED-CURR-2022-06-13T12:17:10+05:30').click()
        cy.get(arAddCommentsPage.getPostCommantsBox()).type(competencyDetails.description)
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(commentsDetails.uploadPath)
        cy.get(arAddCommentsPage.getCommentSubmitButton()).should('be.visible').click({force:true})
        //Validate Added comments in main comments grid
        cy.get(arAddCommentsPage.getCommentColumnData()).should('have.text', competencyDetails.description)
        arAddCommentsPage.selectA5TableCellRecord(competencyDetails.description)
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Manage Comment')
        cy.get(arAddCommentsPage.getAttachedFileName()).should('be.visible')
    })

   it('Click On show comments and Verify Saved comments',()=>{
      
        cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Course Comments")
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Show Comments')
        //verify added comments 
        cy.get(arAddCommentsPage.getCommentColumnData()).should('have.text', competencyDetails.description)
    })
   it('Select existing comments and Reply by the manage button',() =>
   {
   //Add filter 
    arAddCommentsPage.A5AddFilter('Comment', 'Starts With', competencyDetails.description)
    arAddCommentsPage.selectA5TableCellRecord(competencyDetails.description)
    //Validate manage comment available and click on this 
    arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Manage Comment')
    // Validate Alert window 
    arAddCommentsPage.clickOnReplyButtonAndHandleAlert()
    cy.get(arAddCommentsPage.getReplyTextBox()).type(currDetails.commentReply_1,{timeout:5000})
    cy.get(arAddCommentsPage.getReplyButton()).should('contain','Reply').click()
    cy.get(arAddCommentsPage.getReplyTextBox()).type(currDetails.commentReply_2)
    cy.get(arAddCommentsPage.getReplyButton()).should('contain','Reply').click()
    cy.get(arAddCommentsPage.getBackButton()).should('contain','Back').click()
    arAddCommentsPage.getLShortWait()
    arAddCommentsPage.A5AddFilter('Reply', 'Starts With', currDetails.commentReply_1)
    cy.get(arAddCommentsPage.getCommentReplyColumnData()).contains(currDetails.commentReply_1).should('have.text',currDetails.commentReply_1)
    cy.get(arAddCommentsPage.getClearButton()).click()
    arAddCommentsPage.A5AddFilter('Reply', 'Starts With', currDetails.commentReply_2)
    cy.get(arAddCommentsPage.getCommentReplyColumnData()).contains(currDetails.commentReply_2).should('have.text',currDetails.commentReply_2)
    
})
  it('Show all replies comment by show all replies button',()=>
  {
    arAddCommentsPage.A5AddFilter('Comment', 'Starts With', competencyDetails.description)
    arAddCommentsPage.selectA5TableCellRecord(competencyDetails.description)
    arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Show All Replies')
    cy.get(arAddCommentsPage.getCommentReplyColumnData(),{ timeout: 10000 }).contains(currDetails.commentReply_1).should('have.text',currDetails.commentReply_1)
    cy.get(arAddCommentsPage.getCommentReplyColumnData(),{ timeout: 10000 }).contains(currDetails.commentReply_2).should('have.text',currDetails.commentReply_2)

   })

   it('Select existing comments and Delete Selected comment',()=>
   {
    arAddCommentsPage.A5AddFilter('Reply', 'Starts With', currDetails.commentReply_1)
    arAddCommentsPage.selectA5TableCellRecord(currDetails.commentReply_1)
    arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete')
    arAddCommentsPage.clickOnDeleteConfirmation()
    cy.get(arAddCommentsPage.getNoResultFoundMessage()).should('have.text', "Sorry, no results found.")
  })
  it('Item per page in course comment page',()=>{
      cy.get(arAddCommentsPage.getDefaultPageSize()).contains('20').should('have.value','20')
      cy.get(arAddCommentsPage.getDefaultPageSize()).select('50').should('have.value','50')

  })
})

