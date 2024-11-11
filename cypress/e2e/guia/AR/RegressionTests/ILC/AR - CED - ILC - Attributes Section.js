import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, attributes } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - ILC - Attributes Section', function(){

    beforeEach(() => {
        cy.viewport(1280, 720) //Enlarge viewport so Attributes section is visible
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Attribute Section Fields, & Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARILCAddEditPage.getLShortWait()
        //Expand attributes
        // cy.get(ARCourseSettingsAttributesModule.getExpandAttributesBtn()).click()

        //Enter a Long String (>4000 Chars) in the Audience Text Field and Verify Error Message
        cy.get(ARCourseSettingsAttributesModule.getAudienceTxtF()).invoke('val', ARILCAddEditPage.getLongString(4001)).type('a')
        cy.get(ARCourseSettingsAttributesModule.getErrorMsgByFieldDataName('audience')).should('contain', 'Field cannot be more than 4000 characters.')
        cy.get(ARILCAddEditPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'true') //Verify Publish Btn is Disabled
        //Enter Valid Text in the Audience Field
        cy.get(ARCourseSettingsAttributesModule.getAudienceTxtF()).clear().type(attributes.audience)

        //Enter Valid Text in the Goals Field
        cy.get(ARCourseSettingsAttributesModule.getGoalsTxtF()).type(attributes.goals)

        //Enter a Long String (>255 Chars) in the External ID Text Field and Verify Error Message
        cy.get(ARCourseSettingsAttributesModule.getExternalIdTxtF()).invoke('val', ARILCAddEditPage.getLongString()).type('a')
        cy.get(ARCourseSettingsAttributesModule.getErrorMsgByFieldDataName('externalId')).should('contain', 'Field cannot be more than 255 characters.')
        cy.get(ARILCAddEditPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'true') //Verify Publish Btn is Disabled
        //Enter Valid Text in the External ID Field
        cy.get(ARCourseSettingsAttributesModule.getExternalIdTxtF()).clear().type(attributes.externalID)

        //Enter Valid Text in the Vendor Field
        cy.get(ARCourseSettingsAttributesModule.getVendorTxtF()).type(attributes.vendor)

        //Enter an Invalid Value in the Company Cost Field 
        cy.get(ARCourseSettingsAttributesModule.getCompanyCostTxtF()).type('abc123').blur()
        cy.get(ARCourseSettingsAttributesModule.getCompanyCostTxtF()).should('have.value', '') //Field Value Should Reset 
        //Enter a Valid Value in the Company Cost Field
        cy.get(ARCourseSettingsAttributesModule.getCompanyCostTxtF()).type('200')

        //Enter a Valid Value in the Learner Cost Field
        cy.get(ARCourseSettingsAttributesModule.getLearnerCostTxtF()).type('201')

        //Enter a Valid Value in the Company Time Field
        cy.get(ARCourseSettingsAttributesModule.getCompanyTimeTxtF()).type('202')

        //Enter a Valid Value in the Learner Time Field
        cy.get(ARCourseSettingsAttributesModule.getlearnerTimeTxtF()).type('203')

        //Publish the ILC Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify Attribute Section Fields Have Been Persisted', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Attribute Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Audience Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getAudienceTxtF()).should('have.value', attributes.audience)

        //Assert Goals Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getGoalsTxtF()).should('have.value', attributes.goals)

        //Assert External Id Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getExternalIdTxtF()).should('have.value', attributes.externalID)

        //Assert Vendor Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getVendorTxtF()).should('have.value', attributes.vendor)

        //Assert Company Cost Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getCompanyCostTxtF()).should('have.value', '200.00')

        //Assert Learner Cost Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getLearnerCostTxtF()).should('have.value', '201.00')

        //Assert Company Time Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getCompanyTimeTxtF()).should('have.value', '202')

        //Assert learner Time Value was Persisted Correctly
        cy.get(ARCourseSettingsAttributesModule.getlearnerTimeTxtF()).should('have.value', '203')
    })
})