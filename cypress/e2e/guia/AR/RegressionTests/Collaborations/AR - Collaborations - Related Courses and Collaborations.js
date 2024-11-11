import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'

describe('AR - Collaborations - Related Courses and Collaborations - Courses', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
    })

    for (let i = 0; i < collaborationDetails.courseTypes.length; i++) {
        it(`Verify Collaborations in ${collaborationDetails.courseTypes[i]}`, () => {
            cy.createCourse(collaborationDetails.courseTypes[i], `Collaboration - ${collaborationDetails.courseTypes[i]} - ${commonDetails.timestamp}`)
            if (collaborationDetails.courseTypes[i] === 'Course Bundle') {
                //Verify Social Section (contains Collaboration Dropdown) Does Not Exist in CB
                cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).should('not.exist')
            } else {
                if (collaborationDetails.courseTypes[i] === 'Curriculum') {
                    //Add course to curriculum
                    ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
                    cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
                }

                //Open Social Settings
                cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()


                //Verify Multiple Collaborations can be Added to Each Course Type
                cy.get(ARCourseSettingsSocialModule.getCollaborationsDDown()).click()
                for (let j = 0; j < collaborationDetails.collabNames.length; j++) {
                    cy.get(ARCourseSettingsSocialModule.getCollaborationsSearchTxtF()).type(collaborationDetails.collabNames[j])
                    ARCourseSettingsSocialModule.getCollaborationsOpt(collaborationDetails.collabNames[j])
                    cy.get(ARCourseSettingsSocialModule.getCollaborationsSearchTxtF()).clear()

                }
                cy.get(ARCourseSettingsSocialModule.getFormLabel()).contains('Collaborations').click({ force: true }) //Hide DDown

                //Verify Collaboration can be Removed from Course
                cy.get(ARCourseSettingsSocialModule.getFormLabel()).contains(collaborationDetails.collabNames[0]).parent().within(() => {
                    cy.get(ARCourseSettingsSocialModule.getClearBtn()).click()
                })

                //Publish Course
                cy.get(AROCAddEditPage.getPublishBtn()).click()
                cy.wrap(arPublishModal.WaitForElementStateToChange(arPublishModal.getContinueBtn()))
                cy.get(arPublishModal.getContinueBtn()).click()
                cy.get(arPublishModal.getContinueBtn()).should("not.exist")
                cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
            }
        })
    }

    it('Verify Collaborations in Courses Persisted', () => {
        //Verify Collaborations Persisted then Delete Course (minus CB)
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', commonDetails.timestamp))
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        for (let i = 0; i < collaborationDetails.courseTypes.length - 1; i++) {
            //Edit Course
            cy.get(arCoursesPage.getTableCellName(2)).contains(`Collaboration - ${collaborationDetails.courseTypes[i]} - ${commonDetails.timestamp}`).click()
            cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit'), { timeout: 15000 }).should('have.attr', 'aria-disabled', 'false')
            cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click()

            //Open Social Settings
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social'), { timeout: 15000 }).should("exist")
            cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social'),).click()

            //Verify Selections Persisted
            cy.get(ARCourseSettingsSocialModule.getSelectedCollaboration()).contains(collaborationDetails.collabNames[1]).should('exist')
            cy.get(ARCourseSettingsSocialModule.getSelectedCollaboration()).contains(collaborationDetails.collabNames[2]).should('exist')
            //Delete Course
            cy.go('back')
            cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
            cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete'), { timeout: 15000 }).should('have.attr', 'aria-disabled', 'false')
            cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete')).click()
            cy.get(arCoursesPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
            cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        }
    })
})

describe.only('AR - Collaborations - Related Courses and Collaborations - Collaborations', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Collaborations
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaborations'))
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Filter for Collaboration and Edit it
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', collaborationDetails.collabNames[0]))
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arDashboardPage.getTableCellName(2)).contains(collaborationDetails.collabNames[0]).click()
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration'), { timeout: 15000 }).should('have.attr', 'aria-disabled', 'false')
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration')).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
    })

    it('Verify Adding Courses to Collaboration', () => {
        //Verify Multiple Courses can be Added to a Collaboration
        for (let j = 0; j < collaborationDetails.courseNames.length; j++) {
            cy.get(ARCollaborationAddEditPage.getCoursesDDown()).click()
            cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
            cy.get(ARCollaborationAddEditPage.getCoursesSearchTxtF()).type(collaborationDetails.courseNames[j])
            cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
            cy.get(ARCollaborationAddEditPage.getCourseOptionsDDown()).within(() => {
                ARCollaborationAddEditPage.getCoursesOpt(collaborationDetails.courseNames[j])
            })
            cy.get(ARCollaborationAddEditPage.getFormLabel()).contains('Description').click({ force: true }) //Hide DDown

            //If we don't hide the ddown each time, using .clear() in the search field de-selects the course for some reason
        }

        //Verify Course can be Removed from Collaboration
        cy.get(ARCollaborationAddEditPage.getFormLabel()).contains('Description').click({ force: true })
        for (let k = collaborationDetails.courseNames.length ; k <= collaborationDetails.courseNames.length; k++) {
            cy.get(ARCollaborationAddEditPage.getSelectionCourse(k)).contains(collaborationDetails.courseNames[0], { timeout: 15000 }).parent().within(() => {
                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
            })
        }

        //Save Changes
        cy.get(arDashboardPage.getSaveBtn()).click({force: true})
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Collaboration has been updated.')
        cy.get(arDashboardPage.getToastCloseBtn()).click()

    })

    it('Verify Courses in Collaboration Persisted', () => {
        //a wait added to load the page properly 
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        let i , k ;
        //Verify Course Persisted then Delete
        for ( i = 1 ,  k = collaborationDetails.courseNames.length - 1 ; i < collaborationDetails.courseNames.length; i++ , k--) {
            cy.get(ARCollaborationAddEditPage.getSelectionCourse(k)).contains(collaborationDetails.courseNames[i], { timeout: 15000 }).should('exist').parent().within(() => {
                cy.get(ARCollaborationAddEditPage.getClearBtn()).click()
                cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
            })
        }
        //Save Changes
        cy.get(arDashboardPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Collaboration has been updated.')
        cy.get(arDashboardPage.getToastCloseBtn()).click()

    })
})


