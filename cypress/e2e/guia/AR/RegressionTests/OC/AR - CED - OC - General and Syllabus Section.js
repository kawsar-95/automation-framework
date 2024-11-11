import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'


describe('AR - Regress - CED - OC - General and Syllabus Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC Course, Verify General and Syllabus Fields, Publish Course', () => {
        cy.createCourse('Online Course')

        //Verify Save Button is Disabled if Title Field is Blank
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear()
        cy.get(arCoursesPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'true')

        //Verify Title Field Does Not Allow > 450 Chars
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).invoke('val', AROCAddEditPage.getLongString(450)).type('a')
        cy.get(AROCAddEditPage.getGeneralTitleErrorMsg()).should('contain', miscData.char_450_error)

        //Verify Title Field Does Not Accept HTML
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(commonDetails.textWithHtmlTag)
        AROCAddEditPage.getVShortWait()
        cy.get(arCoursesPage.getPublishBtn()).click()
        cy.get(AROCAddEditPage.getGeneralSectionErrorMsg()).should('contain', miscData.invalid_chars_error)

        //Add Valid Value to Title Field
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(ocDetails.courseName)

        //Verify Description Field Does Not Allow > 4000 Chars 
        cy.get(AROCAddEditPage.getDescriptionTxtF()).invoke('text', AROCAddEditPage.getLongString(4001)).type('a', { force: true })
        cy.get(AROCAddEditPage.getGeneralDescriptionErrorMsg()).should('contain', miscData.char_4000_error)

        //Verify Description Field Does Accept HTML
        cy.get(AROCAddEditPage.getDescriptionTxtF()).clear()
        cy.get(AROCAddEditPage.getDescriptionTxtF()).type(commonDetails.textWithHtmlTag)

        //Verify No Language is Selected By Default
        cy.get(AROCAddEditPage.getGeneralLanguageDDown()).should('contain.text', '')

        //Select a Language
        cy.get(AROCAddEditPage.getClearGeneralLanguageInput()).click()
        cy.get(AROCAddEditPage.getGeneralLanguageDDown()).click()
        cy.get(AROCAddEditPage.getGeneralLanguageDDownOpt()).contains('English').click()

        //Toggle Show/Hide On Syllabus Block
        cy.get(arAddMoreCourseSettingsModule.getCollapseCourseSettingByNameBtn('Syllabus')).click()
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('not.be.visible')
        cy.get(arAddMoreCourseSettingsModule.getExpandCourseSettingByNameBtn('Syllabus')).click()

        //Verify Error Message and that Course Cannot Be Saved if Chapter Name Field is Blank
        cy.get(AROCAddEditPage.getChapterNameTxtF()).clear()
        cy.get(arCoursesPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'true')
        cy.get(AROCAddEditPage.getChapterNameErrorMsg()).should('contain', miscData.field_required_error)

        //Verify Chapter Name Field Does Not Allow > 450 Chars
        cy.get(AROCAddEditPage.getChapterNameTxtF()).invoke('val', AROCAddEditPage.getLongString(450)).type('a')
        cy.get(AROCAddEditPage.getChapterNameErrorMsg()).should('contain', miscData.char_450_error)

        //Add Valid Value to Chapter Name Field
        cy.get(AROCAddEditPage.getChapterNameTxtF()).eq(0).clear().type('GUIA Chapter 1')

        //Verify a Second Chapter Can Be Added. 
        cy.get(AROCAddEditPage.getAddChapterBtn()).click()
        AROCAddEditPage.getLShortWait() //Takes a moment to load the second chapter.
        cy.get(AROCAddEditPage.getChapterNameTxtF()).eq(1).clear().type('GUIA Chapter 2')

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

describe('AR - Regress - CED - OC - General and Syllabus Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course, Verify Fields Persisted, Add Terms and Conditions, Delete a Chapter', () => {
        //Turn the Show Terms and Conditions Toggle ON
        AROCAddEditPage.getShortWait() //Ensure toggle is enabled after loading course
        cy.get(AROCAddEditPage.getTermsAndConditionBtn()).click()

        //Add Terms and Conditions and Right Align Text
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type(commonDetails.termsAndConditions)
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).type('{selectall}')
        arCoursesPage.getRightAlignBtnByLabelThenClick()

        //Verify the Second Chapter Can Be Deleted
        cy.get(AROCAddEditPage.getDeleteChapterBtn()).eq(1).click()
        cy.get(arCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        AROCAddEditPage.getShortWait()

        //Publish the Course
        cy.publishCourse()
    })

    it('Edit OC Course, Verify Fields and Chapter Deletion Persisted', () => {
        //Verify Terms and Conditions Field Persisted
        cy.get(arCoursesPage.getTermsAndConditionsTxtF()).should('contain.text', commonDetails.termsAndConditions)

        //Verify the Second Chapter Deletion Persisted
        cy.get(AROCAddEditPage.getChapterNameTxtF()).contains('GUIA Chapter 2').should('not.exist')
    })
})