import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'


let courses = []
let cTypes= []

describe('C2116 - NLE Performance Investigation - Catalog Recommendations Based on Courses You Completed', function(){
    
    before('Create learners, Courses and Enroll',() => {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)        
        cy.createUser(void 0, userDetails.username6, ["Learner"], void 0)
        //Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password,'/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course', ocDetails.courseName)
        //publish Course 1
        cy.publishCourseAndReturnId().then((id)=> {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        cy.createCourse('Online Course', ocDetails.courseName2)
        //publish Course 2
        cy.publishCourseAndReturnId().then((id)=> {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName, ocDetails.courseName2], [userDetails.username5,userDetails.username6])
    })

    it('Add container Recommendations',() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        cy.get(LEManageTemplateTiles.getAddNewContainerBtn(),{timeout:15000}).should('be.visible')
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            cy.get(LEManageTemplateTiles.getAddNewContainerBtn()).click()
            cy.get(LEManageTemplateTiles.getContainerByIndex($length + 1)).within(() => {
                cy.get(LEManageTemplateTiles.getContainerTypeDDown()).find('select').select('Ribbon')
                cy.get(LEManageTemplateTiles.getRibbonContainerLabelTxtF()).find('select').select('RecommendationsByAllCompletions')
            })
            //Save changes
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            cy.get(LEManageTemplateTiles.getChangesSavedBanner(),{timeout:15000}).should('be.visible').and('contain','Changes Saved.')
        })
    })

    it('Save course name and course type for first learner in second ribbon',() => {
        courses = []
        cTypes= []
        cy.apiLoginWithSession(userDetails.username5, userDetails.validPassword, '/#/dashboard')
        
        cy.get(LEDashboardPage.getWelcomeTile(),{timeout:15000}).should('be.visible').and('contain','Welcome,')

        // On first login start and finish course
        cy.get("body").then($body=>{
            if($body.find(LEDashboardPage.getOnLoginCourseBtns()).length >0){
                cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
                    cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course').click()
                })
            }
        })

        cy.visit('/#/dashboard')
        // Title of this Ribbon is not dynamic, so only if exist checked, 
        // Those methods to save appearing course names into courses array, which is above defined, for verification in next it block. 
        cy.contains(LEDashboardPage.getRecommendationByAllText()).should("exist")        
        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByAllText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardName()).each(($el)=>{
                    courses.push($el.text())
                })
            })

        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByAllText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardType()).each(($el)=>{
                    cTypes.push($el.text())
                })
            })

        //Get userID for deletion later
        cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36);
        })
    })

    it('Compare course name and course type with first learner in second ribbon',() => {
        cy.apiLoginWithSession(userDetails.username6, userDetails.validPassword)
        cy.contains(LEDashboardPage.getRecommendationByAllText(),{timeout:15000}).should("exist")
        // On first login start and finish course
        cy.get("body").then($body=>{
            if($body.find(LEDashboardPage.getOnLoginCourseBtns()).length >0){
                cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
                    cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course').click()
                })
            }
        })
        cy.visit('/#/dashboard')
        // Title of this Ribbon is not dynamic, so only if exist checked
        cy.contains(LEDashboardPage.getRecommendationByAllText(),{timeout:15000}).should("exist")
        // Assert all course name
        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByAllText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardName()).each(($el,index)=>{
                    expect($el.text()).to.eq(courses[index])
                })
        })
        // Assert all course type
        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByAllText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardType()).each(($el,index)=>{
                    expect($el.text()).to.eq(cTypes[index])
                })
            })
        //Get userID for deletion later
        cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID2 = currentURL.slice(-36);
        })            
    })

    after('Delete recommendations ribbon', ()=>{
        // Remove newly created courses
        for (let index = 0; index < commonDetails.courseIDs.length; index++) {
            cy.deleteCourse(commonDetails.courseIDs[index])
        } 
        // Remove learners
        cy.deleteUser([userDetails.userID])
        cy.deleteUser([userDetails.userID2])
        //Delete created Tile
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        cy.get(LEManageTemplateTiles.getAddNewContainerBtn(),{timeout:15000}).should('be.visible')
        LEManageTemplateTiles.getDeleteContainerByLabel('Recommended Courses (All Completions)')
        //Save changes
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateTiles.getChangesSavedBanner(),{timeout:15000}).should('be.visible').and('contain','Changes Saved.')
    })

})