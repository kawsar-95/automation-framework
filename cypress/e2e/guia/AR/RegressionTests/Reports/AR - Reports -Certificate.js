import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import arCertificateReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCertificateReportPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arLearnerCompetenciesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerCompetenciesReportPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAssessmentsReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARAssessmentsReportPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('AR -Create Course ,Filter the saved course data in Certificate reports', function(){
    
    var i=0;
    let SearchData = [`${ocDetails.courseName}`,`${defaultTestData.USER_LEARNER_LNAME}`,`${defaultTestData.USER_LEARNER_FNAME}`,`${departments.dept_top_name}`,`Online Course`]; //test specific array
    let SearchDetails = [`Course`, `Last Name`,`First Name`,`Department`,`Type`];

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    after(function() {
      //Delete Course
      cy.deleteCourse(commonDetails.courseID)
      //Delete user
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      arDashboardPage.getMediumWait()
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
      cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
      cy.intercept('**/users/operations').as('getUser').wait('@getUser');
      cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
      cy.wrap(arUserPage.selectTableCellRecord(userDetails.username))
      cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
      cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
      cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
      cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
      cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
  })
    it('Create OC Course, Upload Certificate, & Publish Course', () => {
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
      cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
      

        cy.createCourse('Online Course')
        
         //Open Enrollment Rules
         cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
         arAddMoreCourseSettingsModule.getShortWait()

        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        AROCAddEditPage.getMediumWait() //Wait for toggles to become enabled

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')

         //Select a Certificate File
         cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
         cy.get(arDashboardPage.getElementByDataNameAttribute('image-preview')).eq(0).click()
         cy.get(arDashboardPage.getElementByDataNameAttribute('media-library-apply')).click()
         arDashboardPage.getLongWait()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        //Enroll Leaner in already created course
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

      it("Filter the saved data in Certificate Report ",()=>{
          
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Certificates'))
            arCertificateReportPage.getLShortWait()
              for(i=0;i<SearchDetails.length;i++)
              {
                if(i< SearchDetails.length-2){
                  //Filter the data for last and first name 
                    arCertificateReportPage.AddFilter(SearchDetails[i], 'Contains',SearchData[i])
                    arCertificateReportPage.getLShortWait()
                    cy.get(arCertificateReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
                    cy.get(arCertificateReportPage.getElementByTitleAttribute(arCertificateReportPage.getRemoveBtn())).click()
                 }else if(i==SearchDetails.length-2){
                   //Filter and validate data for department
                   arCertificateReportPage.AddFilter(SearchDetails[i], 'Is Only',SearchData[i])
                    cy.get(arCertificateReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
                    cy.get(arCertificateReportPage.getElementByTitleAttribute(arCertificateReportPage.getRemoveBtn())).click()
                  }else if(i==SearchDetails.length-1){
                    //filter and validate the data for course type 
                    arAssessmentsReportPage.TypeAddFilter(SearchDetails[i], 'Online Course')
                    cy.get(arCertificateReportPage.getA5TableCellRecordByColumn(5+parseInt([i])),{timeout:1000}).should('contain',SearchData[i])
                    arCertificateReportPage.getLShortWait()
                    cy.get(arCertificateReportPage.getA5TableCellRecordByColumn(5+parseInt([i]))).contains(SearchData[i]).click()
                  }
                  
                }
                  //Validate right action level
                   arCertificateReportPage.getRightActionMenuLabel()
        })
  })