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

let header = ''
let courses = []
let cTypes= []

describe('C2116 - NLE Performance Investigation - Catalog Recommendations Based on Completing', function(){

    before('Create learners, Course and Enroll',() => {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username6, ["Learner"], void 0)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course', ocDetails.courseName)
        //publish Course
        cy.publishCourseAndReturnId().then((id)=> {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username5, userDetails.username6])
    })

    it('Add container Recommendations',() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu(),{timeout:10000}).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            cy.get(LEManageTemplateTiles.getAddNewContainerBtn()).click()
            cy.get(LEManageTemplateTiles.getContainerByIndex($length + 1)).within(() => {
                cy.get(LEManageTemplateTiles.getContainerTypeDDown()).find('select').select('Ribbon')
                cy.get(LEManageTemplateTiles.getRibbonContainerLabelTxtF()).find('select').select('RecommendationsByLastCompletion')
            })

            //Save changes
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            cy.get(LEManageTemplateTiles.getChangesSavedBanner(),{timeout:15000}).should('be.visible').and('contain','Changes Saved.')
        })
    })

    it('Save title, course name and course type for first learner',() => {
        // For first login getNavMenu is missing, which is expected if url is '/'
        // This is not related to our case, so url '/#/dashboard'
        cy.apiLoginWithSession(userDetails.username5, userDetails.validPassword, '/#/dashboard')
        cy.get(ARDashboardPage.getWelcomeTile(),{timeout:10000}).should('be.visible')
        // On first login start and finish course
        cy.get("body").then($body=>{
            if($body.find(LEDashboardPage.getOnLoginCourseBtns()).length >0){
                cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
                    cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course').click()
                })
            }
        })

        // store header in a variable
        // for each course store title, type
        cy.visit('/#/dashboard')
        cy.get(ARDashboardPage.getWelcomeTile(),{timeout:10000}).should('be.visible')
        cy.contains(LEDashboardPage.getRecommendationByLastText()).scrollIntoView().should("exist").and('be.visible')
        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByLastText()).invoke('text').as('title')
        cy.get('@title').then((t)=> header = t)

        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByLastText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardName()).each(($el)=>{
                   courses.push($el.text())
               })
        })

        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByLastText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardType()).each(($el)=>{
                    cTypes.push($el.text())
            })
        })

    })

    it('Compare title, course name and course type with first learner',() => {
        // For first login getNavMenu is missing, which is expected if url is '/'
        // This is not related to our case, so url '/#/dashboard'
        cy.apiLoginWithSession(userDetails.username6, userDetails.validPassword, '/#/dashboard')
        cy.get(ARDashboardPage.getWelcomeTile(),{timeout:10000}).should('be.visible')
        
        // On first login start and finish course
        cy.get("body").then($body=>{
            if($body.find(LEDashboardPage.getOnLoginCourseBtns()).length >0){
                cy.get(LEDashboardPage.getOnLoginCourseBtns()).within(() => {
                    cy.get(LEDashboardPage.getElementByAriaLabelAttribute("View and Start Course")).should('have.text', 'View and Start Course').click()
                })
            }
        })

        cy.apiLoginWithSession(userDetails.username6, userDetails.validPassword, '/#/dashboard')
        cy.contains(LEDashboardPage.getRecommendationByLastText()).should("exist").and('be.visible')
        // TODO:

        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByLastText()).invoke('text').then((text)=>{
            expect(text).to.eq(header)
        })

        // Assert all course name
        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByLastText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardName()).each(($el,index)=>{
                    expect($el.text()).to.eq(courses[index])
                })
            })

        
        // Assert all course type
        LEDashboardPage.getRibbonLabelByName(LEDashboardPage.getRecommendationByLastText())
            .siblings(LEDashboardPage.getCarouselContainer()).eq(0).within(()=>{
                cy.get(LEDashboardPage.getCourseCardType()).each(($el,index)=>{
                    expect($el.text()).to.eq(cTypes[index])
                })
            })
    })

    after('Delete recommendations ribbon', ()=>{
        
        // Remove newly created courses
        for (let index = 0; index < commonDetails.courseIDs.length; index++) {
            cy.deleteCourse(commonDetails.courseIDs[index])
        } 

        // Remove learners
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.deleteUsers([userDetails.username5, userDetails.username6])
        cy.visit('/#/dashboard')
        cy.get(ARDashboardPage.getWelcomeTile(),{timeout:10000}).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu(),{timeout:10000}).should('be.visible')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        LEManageTemplateTiles.getDeleteContainerByLabel('Recommended Courses (Last Completion)')
        
        //Save changes
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateTiles.getChangesSavedBanner(),{timeout:15000}).should('be.visible').and('contain','Changes Saved.')
    })
})