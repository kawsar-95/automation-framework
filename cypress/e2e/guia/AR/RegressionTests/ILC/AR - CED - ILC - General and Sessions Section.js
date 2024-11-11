import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Regress - CED - ILC - General and Sessions Section - Create Course', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Add a Description, Select a Language, Add Terms & Conditions, Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Set ILC Description and Bold Text
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).clear()
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).type(ilcDetails.description)
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).type('{selectall}')
        ARILCAddEditPage.getBoldBtnByLabelThenClick('Description')

        //Toggle Terms and Conditions to ON
        cy.get(ARILCAddEditPage.getSyllabusShowTermsAndConditionToggle() + ARILCAddEditPage.getToggleDisabled()).click()

        //Add Terms and Conditions and Right Align Text
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type(commonDetails.termsAndConditions)
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type('{selectall}')
        arCoursesPage.getRightAlignBtnByLabelThenClick('Terms & Conditions')

        //Verify the terms and conditions can be toggled OFF, then back ON, and the text remains.
        cy.get(ARILCAddEditPage.getSyllabusShowTermsAndConditionToggle() + ARILCAddEditPage.getToggleEnabled()).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSyllabusShowTermsAndConditionToggle() + ARILCAddEditPage.getToggleDisabled()).click()
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).should('have.html', '<p style="text-align: right;">GUIA Terms and Conditions</p>')  

        //Open More Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()
        ARILCAddEditPage.getShortWait()

        //Collapse More Section
        cy.get(arAddMoreCourseSettingsModule.getCollapseCourseSettingByNameBtn('More')).click()

        //Expand More Section
        cy.get(arAddMoreCourseSettingsModule.getExpandCourseSettingByNameBtn('More')).click()

        //Hide More Section
        cy.get(arAddMoreCourseSettingsModule.getHideCourseSettingByNameBtn('More')).click()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify Settings Have Been Persisted, Verify General Fields', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Assert that Course Has Been Activated
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARILCAddEditPage.getGeneralStatusToggleContainerName()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify Error Msg When Title Field is Blank
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(ARILCAddEditPage.getGeneralTitleErrorMsg()).should('contain', 'Field is required.')

        //Verify Title Field Does not Accept >450 Chars
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).invoke('val', ARILCAddEditPage.getLongString(450)).type('a')
        cy.get(ARILCAddEditPage.getGeneralTitleErrorMsg()).should('contain', 'Field cannot be more than 450 characters.')

        //Verify Title Field Does not Accept HTML
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).clear().invoke('val', commonDetails.textWithHtmlTag.slice(0,-1))
            .type(commonDetails.textWithHtmlTag.slice(-1))
        ARILCAddEditPage.getVShortWait()
        cy.get(ARILCAddEditPage.getPublishBtn()).click()
        ARILCAddEditPage.getLShortWait()
        cy.get(ARILCAddEditPage.getGeneralSectionErrorMsg()).should('contain', 'Field contains invalid characters.')

        //Enter Valid Title
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).invoke('val', ilcDetails.courseName + commonDetails.appendText.slice(0,-1))
            .type(commonDetails.appendText.slice(-1))

        //Assert that Description Text is Bold (different HTML in firefox and chrome/edge)
        if (Cypress.isBrowser('firefox')) {
            cy.get(ARILCAddEditPage.getDescriptionTxtF()).should('have.html', '<strong><br>GUIA-CED-ILC-Description<br></strong>') 
        }
        if (Cypress.isBrowser('chrome' || 'edge')) {
            cy.get(ARILCAddEditPage.getDescriptionTxtF()).should('have.html', '<strong>GUIA-CED-ILC-Description</strong>') 
        }
 
        //Edit Description
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).clear() //Need to clear before separate type()
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).type(ilcDetails.description + commonDetails.appendText)

        //Verify Description Field Does not Accept >4000 Chars
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).clear() //Need to clear before separate invoke()
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).invoke('text', ARILCAddEditPage.getLongString(4001)).type('a', { force: true })
        cy.get(ARILCAddEditPage.getDescriptionErrorMsg()).should('contain', 'Field cannot be more than 4000 characters.')

        //Verify Description Field DOES accept HTML
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).clear() //Need to clear before separate type()
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).type(commonDetails.textWithHtmlTag)

        //Select a New Language
        cy.get(ARILCAddEditPage.getGeneralLanguageClearBtn()).click()
        cy.get(ARILCAddEditPage.getGeneralLanguageDDown()).click()
        cy.get(ARILCAddEditPage.getGeneralLanguageDDownOpt()).contains('French').click()

        //Assert that Terms and Conditions Text is Right Aligned
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).should('have.html', '<p style="text-align: right;">GUIA Terms and Conditions</p>')  

        //Edit Terms and Conditions
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).clear() //Need to clear before separate type()
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type(commonDetails.termsAndConditions + commonDetails.appendText)

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course & Verify Fields Have Been Successfully Edited', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Assert Title Field Edit Persisted
        cy.get(ARILCAddEditPage.getGeneralTitleTxtF()).should('have.value', ilcDetails.courseName + commonDetails.appendText)

        //Assert Description Field Edit Persisted
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).should('contain.text', commonDetails.textWithHtmlTag)

        //Assert Language Field Edit Persisted
        cy.get(ARILCAddEditPage.getGeneralLanguageDDown()).should('contain.text', 'French')

        //Assert Terms and Conditions Field Edit Persisted
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).should('contain.text', commonDetails.termsAndConditions + commonDetails.appendText)
    })
})