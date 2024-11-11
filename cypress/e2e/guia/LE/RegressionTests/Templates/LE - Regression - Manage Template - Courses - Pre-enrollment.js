import { users } from "../../../../../../helpers/TestData/users/users"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateMenu from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu"
import LEManageTemplateCoursesPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import LEManageTemplateTiles from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles"
import LEManageTemplateSettingsPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"
import { collaborationDetails } from "../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { templateDetails } from "../../../../../../helpers/TestData/Template/TemplateDetails"
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"


describe("C7548 - GUIA-NoAuto - NLE-3912 - What's next needs to respect the Pre-enrollment toggle in learner management Courses ", () => {
    
    before(() => {
        //sign in and navigate to manage template before each test
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        LEDashboardPage.getShortWait()
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Course Details')
        LEDashboardPage.getShortWait()
        LEManageTemplateCoursesPage.getTurnOnOffEnablePreEnrollmentToggleBtn('false')
        LEDashboardPage.getShortWait()
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
       
    })

    it('Create OC with Featured Courses',()=>{
        cy.createCourse('Online Course', ocDetails.courseName)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        ARDashboardPage.getShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        cy.get(ARCBAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARCBAddEditPage.getToggleDisabled()).click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Create CB with Featured Courses',()=>{
        cy.createCourse('Course Bundle')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARSelectModal.getChooseBtn()).contains('Choose').click()
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Catalog visibility - turn on toggle
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCBAddEditPage.getLShortWait()
        cy.get(ARCBAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARCBAddEditPage.getToggleDisabled()).click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Create ILC with Featured Courses',()=>{
        cy.createCourse('Instructor Led')
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Catalog visibility - turn on toggles
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARILCAddEditPage.getLShortWait()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Create CURR with Featured Courses',()=>{

        cy.createCourse('Curriculum')
        cy.get(ARSelectModal.getChooseBtn()).contains('Choose').click()
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Catalog visibility - turn on toggles
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

})

describe('create new tiles to verify pre-enrollment toggle btn', function(){

    it('create new tiles to verify pre-enrollment toggle btn', function(){
        cy.learnerLoginThruDashboardPageWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getLongWait()
        //Navigate to theme page
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEDashboardPage.getShortWait()
        //	Verified that Both Header and Body Font can be altered by the System Admin.
        LEManageTemplateSettingsPage.getContentMenuItemByName('Content')
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
          //Add new container
          LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', templateDetails.labelName)
          //Add collaboration activity tile
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName, `What's Next`)
          LEDashboardPage.getShortWait()

        })

        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
          //Add new container
          LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', templateDetails.labelName2)
          //Add collaboration activity tile
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName2, `What's Next`)
          LEDashboardPage.getShortWait()
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName2, `My Courses`)
          LEDashboardPage.getShortWait()
        })

        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
          //Add new container
          LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', templateDetails.labelName3)
          //Add collaboration activity tile
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName3, `What's Next`)
          LEDashboardPage.getShortWait()
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName3, `My Courses`)
          LEDashboardPage.getShortWait()
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName3, `FAQs`)
          LEDashboardPage.getShortWait()
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName3, `Messages`)
          LEDashboardPage.getShortWait()
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName3, `Resources`)
          LEDashboardPage.getShortWait()
          LEManageTemplateTiles.getAddNewTile(templateDetails.labelName3, `Resume`)
          LEDashboardPage.getShortWait()
        })

        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
          //Add new container
          LEManageTemplateTiles.getAddNewContainerByType($length + 1, 'Ribbon')
          //Add collaboration activity tile
          cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).last().within(()=>{
          LEManageTemplateTiles.getSelectRibbonLabelByName('Featured Courses')
          LEDashboardPage.getShortWait()
          })
        })
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).click()
        LEDashboardPage.getLongWait()
    })

})

describe("Verify pre-enrollment toggle btn ", () => {
    
  
  after(function() {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'course-bundles')
        }
    })


    it('Verify pre-enrollment toggle btn ',() => {
        //sign in and navigate to manage template before each test        
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, "#/login")
        //Large/Extra large tile should not be clickable
        LEDashboardPage.getLongWait()
        cy.get(LEDashboardPage.getLargeTileCourseTitle()).eq(1).click()
        LEDashboardPage.getVShortWait()
        cy.get(LEDashboardPage.getExternalTrainingModal()).should('not.exist')
        LEDashboardPage.getVShortWait()
        cy.get(LEDashboardPage.getLargeTileCourseTitle()).eq(2).click()
        LEDashboardPage.getVShortWait()
        cy.get(LEDashboardPage.getExternalTrainingModal()).should('not.exist')
        LEDashboardPage.getVShortWait()
        cy.get(LEDashboardPage.getLargeTileCourseTitle()).eq(3).click()
        LEDashboardPage.getVShortWait()
        cy.get(LEDashboardPage.getExternalTrainingModal()).should('not.exist')
        LEDashboardPage.getVShortWait()
        //Clicking on a Small/Medium What's Next tile for a Learner with no enrollments will direct the Learner to the Catalog if Pre-enrollment is disabled
        cy.get(LEDashboardPage.getWhatsNextSmallTile()).eq(2).click()
        LEDashboardPage.getShortWait()
        cy.get(LECatalogPage.getCatalogPageTitle()).should('be.visible')
        LEDashboardPage.getVShortWait()

    })

    it('Enable pre-enrollment toggle btn and course details should be visible',()=>{
        //Enable pre-enrollment toggle btn and course details should be visible
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '#/login')
        LEManageTemplateCoursesPage.turnOnOffEnablePreEnrollmentToggleBtn('true')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Dashboard')
        LEDashboardPage.getLongWait()
        cy.get(LEDashboardPage.getLargeTileCourseTitle()).eq(1).click()
        LEDashboardPage.getVShortWait()
        cy.get(LECoursesPage.getCourseTitleInBanner()).should('exist')
        LEDashboardPage.getVShortWait()
    })
        
    it('Enable pre-enrollment toggle btn and course details should be visible',()=>{
        //Enable pre-enrollment toggle btn and course details should be visible
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '#/login')
        LEManageTemplateCoursesPage.turnOnOffEnablePreEnrollmentToggleBtn('true')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Dashboard')
        LEDashboardPage.getLongWait()
        cy.get(LEDashboardPage.getLargeTileCourseTitle()).eq(1).click()
        LEDashboardPage.getVShortWait()
        cy.get(LECoursesPage.getCourseTitleInBanner()).should('exist')
        LEDashboardPage.getVShortWait()
    })

    it('delete all the created tiles',()=>{
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '#/login')
        LEDashboardPage.getLongWait()
        //Navigate to theme page
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEDashboardPage.getShortWait()
        //	Verified that Both Header and Body Font can be altered by the System Admin.
        LEManageTemplateSettingsPage.getContentMenuItemByName('Content')
        LEDashboardPage.getShortWait()
        LEManageTemplateTiles.getDeleteContainerByLabel(templateDetails.labelName)
        LEManageTemplateTiles.getDeleteContainerByLabel(templateDetails.labelName2)
        LEManageTemplateTiles.getDeleteContainerByLabel(templateDetails.labelName3)
        cy.get(LEManageTemplateTiles.getContainerLabel()).last().parents(LEManageTemplateTiles.getContainerHeader()).within(() => {
        cy.get(LEManageTemplateTiles.getContainerDeleteBtn()).click()
        })
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).click()
        LEDashboardPage.getLongWait()
    }) 
})
