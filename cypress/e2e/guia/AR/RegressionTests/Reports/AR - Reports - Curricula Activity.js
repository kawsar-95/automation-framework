import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { commonDetails} from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arCurriculaActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import arCourseActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'


describe('AR -Reports - Create Course and filter the created course data in Curricula activity report', function(){
    
    var i=0;
    let SearchData = [`${defaultTestData.USER_LEARNER_LNAME}`,`${defaultTestData.USER_LEARNER_FNAME}`,`${departments.dept_top_name}`,`0`]; //test specific array
    let SearchDetails = [`Last Name`,`First Name`,`Department`,`Progress`];

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
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

    it('Create Curriculum,  Upload Certificate, & Publish Course and enroll learner in course', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        //Create curriculum and add single course
        cy.createCourse('Curriculum')
        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getLShortWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        //Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARCURRAddEditPage.getMediumWait() //Wait for toggles to become enabled

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
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })
       it("Filter the saved course data in Curricula Activity Report ",()=>{
        
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Curricula Activity'))
        //Filter and select already created course
        arCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)
        for(i=0;i< SearchDetails.length;i++)
        {
            if(i< SearchDetails.length-2)
            {
            //Filter the data for Last Name,First Name    
            arCurriculaActivityReportPage.AddFilter(SearchDetails[i], 'Contains',SearchData[i])
            arCurriculaActivityReportPage.getMediumWait()
            cy.get(arCurriculaActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCurriculaActivityReportPage.getElementByAriaLabelAttribute(arCurriculaActivityReportPage.getRemoveBtn())).should('be.visible').click()
           }else if(i== SearchDetails.length-2)
           {
            //Filter the data for the Department  
            arCourseActivityReportPage.AddFilter(SearchDetails[i], 'Is Only',SearchData[i] )
            arCurriculaActivityReportPage.getMediumWait()
            cy.get(arCurriculaActivityReportPage.getA5TableCellRecordByColumn(2+parseInt([i]))).contains(SearchData[i]).should('be.visible')
            cy.get(arCurriculaActivityReportPage.getElementByAriaLabelAttribute(arCurriculaActivityReportPage.getRemoveBtn())).should('be.visible').click()
           }else if(i==SearchDetails.length-1)
           {
            //Filter the data for the progress 
            arCurriculaActivityReportPage.AddFilter(SearchDetails[i], 'Equals',SearchData[i])
            arCurriculaActivityReportPage.getMediumWait()
            cy.get(arCurriculaActivityReportPage.getTableProgressColTxt()).scrollIntoView()
            cy.get(arCurriculaActivityReportPage.getA5TableCellRecordByColumn(6+parseInt([i]))).contains(`0`).should('be.visible')
            cy.get(arCurriculaActivityReportPage.getElementByAriaLabelAttribute(arCurriculaActivityReportPage.getRemoveBtn())).should('be.visible').click()
           }
         }
       })
})
