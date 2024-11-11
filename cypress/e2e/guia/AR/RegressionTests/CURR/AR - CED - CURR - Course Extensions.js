import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails, courseExtension } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'


describe('AR - CED - CURR - Course Extensions', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('Verify Course Extension Fields, Publish Curriculum Course', () => {
        //Create curriculum
        cy.createCourse('Curriculum')
        //Add course to curriculum
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        ARSelectModal.getMediumWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCURRAddEditPage.getMediumWait()

        //Enable E-Commerce
        cy.get(ARCURRAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + ARCURRAddEditPage.getToggleEnabled()).click()
        ARCURRAddEditPage.getShortWait()

        //Add an Extension
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddExtensionBtn()).click()
        ARCURRAddEditPage.getShortWait()
        
        //Verify Extension Fields Cannot be Blank
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionDaysTxtF()).clear()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getExtensionGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getExtensionPriceTxtF()).clear()
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
        arCoursesPage.getVShortWait()

        //Publish Curr
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Verify Course Extensions Persisted and Can Be Deleted, Publish OC Course', () => {
        //Filter for and Edit Course
        cy.editCourse(currDetails.courseName)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCURRAddEditPage.getShortWait()

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

        //Publish Curr
        arCoursesPage.getVShortWait()
        cy.publishCourse()
    })

    it('Verify Course Extension Edit and Deletion', () => {
        //Filter for and Edit Course
        cy.editCourse(currDetails.courseName)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCURRAddEditPage.getShortWait()

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