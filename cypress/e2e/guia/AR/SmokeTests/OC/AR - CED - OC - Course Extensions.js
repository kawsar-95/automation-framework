
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails, courseExtension } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import CreateCoursePage from '../../../../../../helpers/AR/pageObjects/SmokeObjects/CreateCoursePage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - CED - OC - Course Extensions', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport() 
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify Course Extension Fields, Publish OC Course', () => {
        cy.createCourse('Online Course')

        //Open Enrollment Rules
        cy.get(CreateCoursePage.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:10000}).should('have.attr','class').and('include','enabled')

        //Enable E-Commerce
        ARDashboardPage.generalToggleSwitch("true",ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer())
        cy.wait(3000)
        //Add an Extension
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).click()
      
        
        //Verify Extension Fields Cannot be Blank
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).clear()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        CreateCoursePage.getExtensionPriceTxtF()).clear()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionErrorMsg()).should('contain', miscData.field_required_error)

        //Verify Extension Fields Accept Numerical Values Only (Field Resets on Blur)
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).type('a').blur()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).should('have.value', '')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).type('a').blur()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).should('have.value', '')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getDeleteExtensionBtn()).click()

        //Verify a Max of 3 Extensions can Be Added
        for (let i = 0; i < courseExtension.extensionDays.length; i++) {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).click()
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), i) + ' ' +
            ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).type(courseExtension.extensionDays[i])
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), i) + ' ' +
            ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).type(courseExtension.extensionPrices[i])
        }
        
        //Verify 4th Extension Cannot be Added
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).should('not.exist')

        //Publish OC
        cy.publishCourse()
    })

    it('Verify Course Extensions Persisted and Can Be Deleted, Publish OC Course', () => {
        //Filter for and Edit Course
        cy.editCourse(ocDetails.courseName)

        //Store course ID
        cy.url().should('contain', 'edit').then((currentURL) => {
            commonDetails.courseID = currentURL.slice(-36); //Store courseID
        })
        
        //Open Enrollment Rules
        cy.get(CreateCoursePage.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:10000}).should('have.attr','class').and('include','enabled')

        //Verify all 3 Extensions Persisted
        //*Extensions do not save in order so we need to create arrays of the saved values and compare them to the originals*
        for (let i = 0; i < courseExtension.extensionDays.length; i++) {
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), i) + ' ' +
                ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).invoke('attr', 'value').then(($val) => {
                cy.wrap($val).as(`days_${i}`) //Get each extension day value
                    cy.get(`@days_${i}`).then(days_1 => {
                        courseExtension.extensions.push(String(days_1)) //Store each extension value
                    })
            })
            cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), i) + ' ' +
                ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).invoke('attr', 'value').then(($price) => {
                cy.wrap($price).as(`price_${i}`) //Get each extension day value
                    cy.get(`@price_${i}`).then(price_1 => {
                        courseExtension.prices.push(String(price_1)) //Store each extension value
                    })
            })
        }

        //Compare Sorted arrays from course with originals
        cy.get(courseExtension.extensionDays).each(($span, i) => {
            expect($span).to.equal(courseExtension.extensions.sort()[i])
        })
        cy.get(courseExtension.extensionPrices).each(($span, i) => {
            expect($span).to.equal(courseExtension.prices.sort()[i])
        })

        //Verify an Extension can be Edited
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).clear().type('10')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).clear().type('100')

        //Verify Extensions Can be Deleted
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 2) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getDeleteExtensionBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 1) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getDeleteExtensionBtn()).click()

        //Publish OC
        cy.publishCourse()
    })

    it('Verify Course Extension Edit and Deletion', () => {
        //Filter for and Edit Course
        cy.editCourse(ocDetails.courseName)
    
        //Open Enrollment Rules
        cy.get(CreateCoursePage.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:10000}).should('have.attr','class').and('include','enabled')

        //Verify Extension Edit Persisted
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).should('have.value', '10')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).should('have.value', '100')

        //Verify Extension Deletion Persisted
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 1) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).should('not.exist')
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 1) + ' ' +
        ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).should('not.exist')
    })
})