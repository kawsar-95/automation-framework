import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import { departments } from '../../../../../../helpers/TestData/Department/departments'


describe('AR - CED - OC - Variable Pricing', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Verify Variable Pricing Fields, Publish OC Course', () => {
        //Add new OC
        cy.createCourse('Online Course')

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Enable E-Commerce
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsEnrollmentRulesModule.getEnableEcommToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
        AROCAddEditPage.getVShortWait()
        //Set Default Price
        cy.get(ARCourseSettingsEnrollmentRulesModule.getDefaultPriceTxtF()).clear().type('10')

        //Verify Message When No Variable Prices Exist
        cy.get(ARCourseSettingsEnrollmentRulesModule.getNoVariablePriceTxt()).should('contain', 'This course has no variable price group.')

        //Add Variable Price and Verify Error Message Until Required Fields Have Values
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddVariablePriceBtn()).click()
        cy.get(arCoursesPage.getErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.sub_dept_A_name])
        cy.get(arCoursesPage.getErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).type(courses.course_price_15)

        //Verify a Second Variable Price Rule Can Be Added
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAddVariablePriceBtn()).click()
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.sub_dept_B_name])
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).type(courses.course_price_20)

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Verify Course Variable Prices Persisted and Can Be Edited & Deleted, Publish OC Course', () => {
        //Filter for and Edit Course
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getLShortWait()

        //Verify Original Variable Price Rules Persisted
        //Need to use if statement as these do not always save in order
        cy.get(ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptF()).eq(0).invoke('val').then((val) => {
             if (val === `.../${departments.sub_dept_B_name}`) {
               cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
                    ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).should('have.value', courses.course_price_20)

               //Verify other department and price
               cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
               ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptF()).should('have.value', `.../${departments.sub_dept_A_name}`)
               cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
                    ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).should('have.value', courses.course_price_15)

             } else if (val === `.../${departments.sub_dept_A_name}`) {
               cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
                    ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).should('have.value', courses.course_price_15)

               //Verify other department and price
               cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
                    ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptF()).should('have.value', `.../${departments.sub_dept_B_name}`)
               cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
                    ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).should('have.value', courses.course_price_20)
             }
        })

        //Delete Variable Price Rule
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getDeleteVariablePriceBtn()).click()

        //Edit Variable Price Rule
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.sub_dept_C_name])
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).clear().type(courses.course_price_25)

        //Publish OC
        cy.publishCourse()
    })

    it('Verify Variable Price Edit and Deletion', () => {
        //Filter for and Edit Course
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()

        //Verify Variable Price Rule Delete Persisted
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 1) + ' ' +
             ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptF()).should('not.exist')

        //Verify Variable Price Rule Edit Persisted
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
            ARCourseSettingsEnrollmentRulesModule.getVariablePriceDeptF()).should('have.value', `.../${departments.sub_dept_C_name}`)
        cy.get(arCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsEnrollmentRulesModule.getVariablePriceGroup(), 0) + ' ' +
            ARCourseSettingsEnrollmentRulesModule.getVariablePriceTxtF()).should('have.value', courses.course_price_25)
    })
})