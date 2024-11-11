import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'

describe('C829, AR - ILC - An Administrator can Assign a Category to an ILC Course (cloned)', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Assign a Category to an ILC', () => {
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCURRAddEditPage.getShortWait()

        //Select a Category
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()

        ARSelectModal.SearchAndSelectFunction([courses.category_01_name])
        ARCURRAddEditPage.getShortWait()

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        // The course can be found in the correct Category on the learner side
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
        arDashboardPage.getMediumWait()

        // Navigate to Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        arDashboardPage.getMediumWait()
        cy.get(LEFilterMenu.getFilterBtnContainer()).then(($ele) => {
            if ($ele.hasClass(LEFilterMenu.getHideFilterBtnClassName())) {
                cy.get(LEFilterMenu.getFilterBtn()).click()
                arDashboardPage.getMediumWait()
            }
        })

        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Show Categories')).invoke('val').then((value) => {
            if (value==='false') {
                cy.get(LECatalogPage.getShowCategoriesToggle()).click()
                arDashboardPage.getLongWait()
            }
        })
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Show Categories')).should('have.value', 'true')

        cy.get(LECatalogPage.getCategorySelector(courses.category_01_name)).should('exist').click()
        arDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getElementByTitleAttribute(ilcDetails.courseName)).should('exist')
    })

    it('Change the Category of the ILC', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCURRAddEditPage.getShortWait()

        //Select a Category
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn()).click()

        ARSelectModal.SearchAndSelectFunction([courses.category_02_name])
        ARCURRAddEditPage.getShortWait()

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        // The course can be found in the correct Category on the learner side
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
        arDashboardPage.getMediumWait()

        // Navigate to Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        arDashboardPage.getMediumWait()
        cy.get(LEFilterMenu.getFilterBtnContainer()).then(($ele) => {
            if ($ele.hasClass(LEFilterMenu.getHideFilterBtnClassName())) {
                cy.get(LEFilterMenu.getFilterBtn()).click()
                arDashboardPage.getMediumWait()
            }
        })

        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Show Categories')).invoke('val').then((value) => {
            if (value==='false') {
                cy.get(LECatalogPage.getShowCategoriesToggle()).click()
                arDashboardPage.getLongWait()
            }
        })
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Show Categories')).should('have.value', 'true')

        cy.get(LECatalogPage.getCategorySelector(courses.category_02_name)).should('exist').click()
        arDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getElementByTitleAttribute(ilcDetails.courseName)).should('exist')
    })

    it('Remove the Category of an ILC', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARCURRAddEditPage.getShortWait()

        // Remove the Category
        cy.get(arAddMoreCourseSettingsModule.getElementByAriaLabelAttribute('Category')).find('button').click()

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        // The course is removed from the Category on the learner side.
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
        arDashboardPage.getMediumWait()

        // Navigate to Catalog
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        arDashboardPage.getMediumWait()
        cy.get(LEFilterMenu.getFilterBtnContainer()).then(($ele) => {
            if ($ele.hasClass(LEFilterMenu.getHideFilterBtnClassName())) {
                cy.get(LEFilterMenu.getFilterBtn()).click()
                arDashboardPage.getMediumWait()
            }
        })

        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Show Categories')).invoke('val').then((value) => {
            if (value==='false') {
                cy.get(LECatalogPage.getShowCategoriesToggle()).click()
                arDashboardPage.getLongWait()
            }
        })
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Show Categories')).should('have.value', 'true')

        cy.get('body').then($body => {
            if ($body.find(LECatalogPage.getCategorySelector(courses.category_02_name)).length) {
                return LECatalogPage.getCategorySelector(courses.category_02_name)
            }
            return false
        })
        .then(selector => {
            if(selector){
                cy.get(selector).click() 
                arDashboardPage.getMediumWait()
                cy.get(LECatalogPage.getElementByTitleAttribute(ilcDetails.courseName)).should('not.exist')
            }   
        });
    })
})

