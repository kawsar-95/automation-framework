import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARCURRAddEditPage, { CurrPageLableMessages } from "../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"

describe('C7320 - AUT-698 - AE - Core Regression - Curriculum - Availability - Pre-requisites (cloned)', () => {

    before('Create a temporary Competency', () => {
        // Login admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Navigate to the Competencies menu item
        ARDashboardPage.getCompetenciesReport()
        
        ARCURRAddEditPage.getA5AddEditMenuActionsByNameCompetencyThenClick()
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
        // Create Competency
        cy.get(ARCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(ARCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(ARCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)
        // Save Competency
        cy.get(ARCompetencyAddEditPage.getA5SaveBtn()).click()
       
    })

    after('Delete Course and Competencies', () => {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID, 'curricula')
        // Delete Competencies
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Navigate to the Competencies menu item
        ARDashboardPage.getCompetenciesReport()
        // Filter created competencies
        ARDashboardPage.A5AddFilter('Name', 'Contains', competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Select competencies
        //here wait is necessary so filterout from the table 
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(competencyDetails.competencyName).click()
        
        // Click delete btn
        //here wait is necessary to load the button
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click()
        
        // Click modal ok btn 
        cy.get(ARDeleteModal.getA5OKBtn(),{timeout:15000}).should('be.visible')
        cy.get(ARDeleteModal.getA5OKBtn()).click()
       
    })

    it('Curriculum - Availability - Pre-requisites', () => {
        // Login admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Admin login successfull
        cy.url('/admin/dashboard').should('exist')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Click the courses menu item
        ARDashboardPage.getCoursesReport()
        // Assert Corses page title
        cy.get(ARCURRAddEditPage.getPageTitle()).should('contain', 'Courses')
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Click on add curriculum btn
        cy.get(ARCURRAddEditPage.getAddCurriculumCoursesActionsButtonsByLabel()).should('have.text', `Add Curriculum`).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Assert add curriculum page title
        cy.get(ARCURRAddEditPage.getPageTitle()).should('contain', 'Add Curriculum')

        // Active status toggle btn
        ARCBAddEditPage.generalToggleSwitch('true',ARUserAddEditPage.getIsActiveToggleContainer())
        // Assert that the course is now inactive
        // Type course name required field
        cy.get(ARCURRAddEditPage.getGeneralTitleInput()).invoke('val', currDetails.courseName.slice(0, -1)).type(currDetails.courseName.slice(-1))

        // Type description field
        cy.get(ARILCAddEditPage.getDescriptionTxtF()).type(`${currDetails.description}`)
        ARDashboardPage.getShortWait()
        // Click language field
        cy.get(ARCURRAddEditPage.getGeneralLanguageDDown()).click({ force: true })
        // Select language 
        cy.get(ARCURRAddEditPage.getGeneralLanguageDDownOpt()).contains(currDetails.language).click()
        // Select tags input
        cy.get(ARCURRAddEditPage.getTagsInputField()).contains('Choose').click()
        // Type tags name
        cy.get(ARCURRAddEditPage.getTagsInputTypeField()).type(miscData.auto_tag1)
        // Select tags 
        cy.get(ARCURRAddEditPage.getTagsUlList()).contains(miscData.auto_tag1).click()
        // Double click on availability menu
        cy.get(ARCURRAddEditPage.getCourseSettingsByAvailabilityNameBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCURRAddEditPage.getCourseSettingsByAvailabilityNameBtn()).click()
        // Access Date 'Date' Option
        cy.get(ARCURRAddEditPage.getAvailabilityFieldName()).should('contain', CurrPageLableMessages.accessDateLabel)
        // Expiration 'Time from enrollment' Option
        cy.get(ARCURRAddEditPage.getAvailabilityFieldName()).should('contain', CurrPageLableMessages.expirationLabel)
        // Due Date 'Date' Option
        cy.get(ARCURRAddEditPage.getAvailabilityFieldName()).should('contain', CurrPageLableMessages.dueDateLabel)

        // Validate allow course content download toggle 
        cy.get(ARCURRAddEditPage.getAllowCourseContentToggle()).should("have.text", "Off")
        // Assert allow course content download description
        cy.get(ARCURRAddEditPage.getAllowCourseContentDownload()).should('contain', CurrPageLableMessages.offlineDownloadDescription)
        // Click on add prerequisite btn
        cy.get(ARCURRAddEditPage.getPrerequisitebtn()).click()

        cy.get(ARCURRAddEditPage.getPrerequisiteContainer()).within(() => {
            // Prerequisites name required
            cy.get(ARCURRAddEditPage.getPrerequisiteName()).should('contain', CurrPageLableMessages.requiredNameLabel)
            // Prerequisites name type field
            cy.get(ARCURRAddEditPage.getPrerequisiteNameField()).clear().type(CurrPageLableMessages.prerequisiteTestTypeLable)
            // Assert Requirement Type
            cy.get(ARCURRAddEditPage.getPrerequisiteRequirementType()).should('contain', CurrPageLableMessages.requirementTypeLabel)
            cy.get(ARCURRAddEditPage.getCompleteCoursebtn()).should('be.checked').parents().should('contain', CurrPageLableMessages.completeCoursesLabel)
            cy.get(ARCURRAddEditPage.getValidCertificatebtn()).should('not.be.checked').parents().should('contain', CurrPageLableMessages.validCertificatesLabel)
            cy.get(ARCURRAddEditPage.getCompetenciesbtn()).should('not.be.checked').parents().should('contain', CurrPageLableMessages.competenciesLabel)
            // Assert Courses (Required)
            cy.get(ARCURRAddEditPage.getCoursesTxt()).should('contain', CurrPageLableMessages.requiredCoursesLabel)
            // Assert Completion Type
            cy.get(ARCURRAddEditPage.getCompletionType()).should('contain', CurrPageLableMessages.completionTypeLabel)
            cy.get(ARCURRAddEditPage.getMustCompletebtn()).should('be.checked').parents().should('contain', CurrPageLableMessages.mustCompleteAllLabel)
            cy.get(ARCURRAddEditPage.getRequiredToCompletebtn()).should('not.be.checked').parents().should('contain', CurrPageLableMessages.required2completeLabel)
            // Required to complete btn click
            cy.get(ARCURRAddEditPage.getRadiobtn()).contains(CurrPageLableMessages.required2completeLabel).click()
            cy.get(ARCURRAddEditPage.getRequiredCourseCountTxtFields()).should('contain', CurrPageLableMessages.requiredCourseCountLabel)
            cy.get(ARCURRAddEditPage.getRequiredCourseCountInput()).should('not.be.disabled')
            // Valid Certificates click
            cy.get(ARCURRAddEditPage.getRadiobtn()).contains(CurrPageLableMessages.validCertificatesLabel).click()
            // Competencies click
            cy.get(ARCURRAddEditPage.getRadiobtn()).contains(CurrPageLableMessages.competenciesLabel).click()
            // Add competency btn click
            cy.get(ARCURRAddEditPage.getAddCompetenciesbtn()).should('be.visible').click()
            
        })

        // Assert Select Competencies page
        cy.get(ARCURRAddEditPage.getCompetencyTitle()).should('contain', CurrPageLableMessages.selectCompetenciesLabel)
        // Cancel Select Competencies pag
        cy.get(ARCURRAddEditPage.getCancelBtnFooter()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARCURRAddEditPage.getCompetencyName()).contains(CurrPageLableMessages.competenciesLabel).should('exist')
        // Add competency btn click
        cy.get(ARCURRAddEditPage.getAddCompetenciesbtn()).click()
        // Competency input bar click and type
        cy.get(ARCURRAddEditPage.getCompetencyInput()).click().type(competencyDetails.competencyName)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        ARDashboardPage.getShortWait()
        // Select competency
        cy.get(ARCURRAddEditPage.getCompetencySelectList()).contains(competencyDetails.competencyName).click()
        // Click on choose btn
        cy.get(ARCURRAddEditPage.getFooterChoosebtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // Assert selected competency label 
        cy.get(ARCURRAddEditPage.getCompetencyLable()).should('contain', competencyDetails.competencyName)
        // Click competency remove trash icon 
        cy.get(ARCURRAddEditPage.getRemoveCompetencyBtn()).click()
        // Assert selected competency label does not exist
        cy.get(ARCURRAddEditPage.getCompetencyLable()).should('not.exist')
        cy.get(ARCURRAddEditPage.getPrerequisiteRemovebtn()).click()
        ARDashboardPage.getShortWait()
        // Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })
})