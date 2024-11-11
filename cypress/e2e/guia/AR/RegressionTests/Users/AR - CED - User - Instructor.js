import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import {userDetails, ecommFields, employmentDetailsSectionFields, detailsSectionFields, adminRoles}  from '../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'

describe('AR - CED - User - Instructor', () => {
    
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
    })

    it('Verify an Admin can Create an Instructor Type User', () => {
        //Add new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')

        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        //Set Active status is ON by default
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getIsActiveToggleContainer()) + ' ' + ARUserAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify learner toggle is ON by default
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getLearnerToggleContainer()) + ' ' + ARUserAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        
        //Turn Learner toggle OFF and turn Instructor toggle ON
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getLearnerToggleContainer()) + ' ' + ARUserAddEditPage.getToggleEnabled()).click()
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getInstructorToggleContainer()) + ' ' + ARUserAddEditPage.getToggleDisabled()).click()

        //Verify toggle ON Message
        cy.get(ARUserAddEditPage.getToggleDescriptionBanner()).should('contain', ARUserAddEditPage.getInstructorToggleOnMsg())

        //Fill out contact information section
        cy.get(ARUserAddEditPage.getAddressTxtF()).type(ecommFields.address)
        cy.get(ARUserAddEditPage.getAddress2TxtF()).type(ecommFields.address2)
        cy.get(ARUserAddEditPage.getCountryDDown()).click()
        cy.get(ARUserAddEditPage.getCountryDDownSearchTxtF()).eq(0).type(ecommFields.country)
        cy.get(ARUserAddEditPage.getCountryDDownOpt()).contains(ecommFields.country).click('bottom', { force: true })
        cy.get(ARUserAddEditPage.getStateProvinceDDown()).click()
        cy.get(ARUserAddEditPage.getStateProvinceDDownSearchTxtF()).eq(0).type(ecommFields.province)
        cy.get(ARUserAddEditPage.getStateProvinceDDownOpt()).contains(ecommFields.province).click()
        cy.get(ARUserAddEditPage.getCityTxtF()).type(ecommFields.city)
        cy.get(ARUserAddEditPage.getZipPostalCodeTxtF()).type(ecommFields.postalCode)
        cy.get(ARUserAddEditPage.getPhoneTxtF()).type(ecommFields.phone)

        //Fill out employee details section
        cy.get(ARUserAddEditPage.getEmployeeNumberTxtF()).type(employmentDetailsSectionFields.employeeNumber)
        cy.get(ARUserAddEditPage.getJobTitleTxtF()).type(employmentDetailsSectionFields.jobTitle)
        cy.get(ARUserAddEditPage.getLocationTxtF()).type(employmentDetailsSectionFields.location)
        cy.get(ARUserAddEditPage.getSupervisorDDown()).click()
        cy.get(ARUserAddEditPage.getSupervisorDDownSearchTxtF()).eq(0).type(employmentDetailsSectionFields.supervisor)
        cy.get(ARUserAddEditPage.getSupervisorDDownOpt()).contains(employmentDetailsSectionFields.supervisor).click('bottom', { force: true })
        cy.get(ARUserAddEditPage.getGenderDDown()).click()
        cy.get(ARUserAddEditPage.getGenderDDownOpt()).contains(employmentDetailsSectionFields.gender).click()
        cy.get(ARUserAddEditPage.getDateHiredBtn()).click()
        ARUserAddEditPage.getSelectDate(employmentDetailsSectionFields.dateHired)
        cy.get(ARUserAddEditPage.getDateTerminatedBtn()).click()
        ARUserAddEditPage.getSelectDate(employmentDetailsSectionFields.dateTerminated)

        //Fill out details section
        cy.get(ARUserAddEditPage.getAvatarRadioBtn()).contains('File').click()
        cy.get(ARUserAddEditPage.getChooseFileBtn()).click()
        arDashboardPage.getVShortWait()
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(detailsSectionFields.avatarFilePath)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.intercept('/api/rest/v2/admin-uploads').as('getUpload').wait('@getUpload')
        cy.get(ARUserAddEditPage.getLanguageDDown()).click()
        cy.get(ARUserAddEditPage.getLanguageDDownSearchTxtF()).eq(0).type('{selectall}{backspace}')
        cy.get(ARUserAddEditPage.getLanguageDDownSearchTxtF()).eq(0).type(detailsSectionFields.language)
        cy.get(ARUserAddEditPage.getLanguageDDownOpt()).contains(detailsSectionFields.language).click()
        cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).type(detailsSectionFields.CCEmailAddress)
        cy.get(ARUserAddEditPage.getNotesTxtA()).type(detailsSectionFields.notes)

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        cy.intercept('**/details').as('saveUserDetails').wait('@saveUserDetails')
        cy.wait('@getUsers')
    })

    it('Verify Instructor User Creation Persists, Edit Instructor', () => {
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)

        //Verify general section fields persisted and edit them
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).should('have.value', userDetails.firstName).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).should('have.value', userDetails.middleName).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).should('have.value', userDetails.lastName).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).should('have.value', userDetails.emailAddress)
            .clear().type(userDetails.emailAddressEdited)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).should('have.value', userDetails.username).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getDepartmentTxtF()).should('have.value', departments.dept_top_name)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.Dept_B_name])

        //Add a new temporary password
        cy.get(ARUserAddEditPage.getNewTemporaryPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmTemporaryPasswordTxtF()).type(userDetails.validPassword)
        
        //Verify toggles persisted
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getIsActiveToggleContainer()) + ' ' + ARUserAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getLearnerToggleContainer()) + ' ' + ARUserAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getInstructorToggleContainer()) + ' ' + ARUserAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify contact information section fields persisted and edit them
        cy.get(ARUserAddEditPage.getAddressTxtF()).should('have.value', ecommFields.address).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getAddress2TxtF()).should('have.value', ecommFields.address2).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getCountryDDown()).should('contain.text', ecommFields.country)
        cy.get(ARUserAddEditPage.getStateProvinceDDown()).should('contain.text', ecommFields.province)
        cy.get(ARUserAddEditPage.getCountryDDown()).click()
        cy.get(ARUserAddEditPage.getCountryDDownSearchInputTxt()).eq(0).type(ecommFields.country2)
        cy.get(ARUserAddEditPage.getCountryDDownSearchInputTxt()).eq(0).type('{downArrow}{enter}')
        cy.get(ARUserAddEditPage.getStateProvinceDDown()).click()
        cy.get(ARUserAddEditPage.getStateProvinceDDownSearchTxtF()).eq(0).type(ecommFields.province2)
        cy.get(ARUserAddEditPage.getStateProvinceDDownSearchTxtF()).eq(0).type('{downArrow}{enter}')
        cy.get(ARUserAddEditPage.getCityTxtF()).should('have.value', ecommFields.city).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getZipPostalCodeTxtF()).should('have.value', ecommFields.postalCode)
            .clear().type(ecommFields.zipCode)
        cy.get(ARUserAddEditPage.getPhoneTxtF()).should('have.value', ecommFields.phone).type(userDetails.appendText)

        //Verify employee details section fields persisted and edit them
        cy.get(ARUserAddEditPage.getEmployeeNumberTxtF()).should('have.value', employmentDetailsSectionFields.employeeNumber).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getJobTitleTxtF()).should('have.value', employmentDetailsSectionFields.jobTitle).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getLocationTxtF()).should('have.value', employmentDetailsSectionFields.location).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getSupervisorDDown()).should('contain.text', employmentDetailsSectionFields.supervisorName)
        cy.get(ARUserAddEditPage.getGenderDDown()).should('contain.text', employmentDetailsSectionFields.gender).click()
        cy.get(ARUserAddEditPage.getGenderDDownOpt()).contains(employmentDetailsSectionFields.gender2).click()
        cy.get(ARUserAddEditPage.getDateHiredTxtF()).should('have.value', employmentDetailsSectionFields.dateHired)
        cy.get(ARUserAddEditPage.getDateHiredBtn()).click()
        ARUserAddEditPage.getSelectDate(employmentDetailsSectionFields.dateHired2)
        cy.get(ARUserAddEditPage.getDateTerminatedTxtF()).should('have.value', employmentDetailsSectionFields.dateTerminated)
        cy.get(ARUserAddEditPage.getDateTerminatedBtn()).click()
        ARUserAddEditPage.getSelectDate(employmentDetailsSectionFields.dateTerminated2)
        
        //Verify details section fields persisted and edit them
        cy.get(ARUserAddEditPage.getFileTxtF()).should('have.value', detailsSectionFields.avatarImageName)
        cy.get(ARUserAddEditPage.getAvatarRadioBtn()).contains('Url').click()
        cy.get(ARUserAddEditPage.getUrlTxtF()).type(detailsSectionFields.avatarUrl)
        cy.get(ARUserAddEditPage.getLanguageDDown()).should('contain.text', detailsSectionFields.language)
        cy.get(ARUserAddEditPage.getLanguageDDown()).click()
        cy.get(ARUserAddEditPage.getLanguageDDownSearchTxtF()).eq(0).type(detailsSectionFields.language2)
        cy.get(ARUserAddEditPage.getLanguageDDownSearchTxtF()).eq(0).type('{downArrow}{enter}')
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).should('have.value', detailsSectionFields.CCEmailAddress)
        cy.get(ARUserAddEditPage.getNotesTxtA()).should('contain.text', detailsSectionFields.notes).type(userDetails.appendText)

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been updated successfully.')
        cy.intercept('**/details').as('saveUser').wait('@saveUser')
        cy.wait('@getUsers')
    })

    it('Verify Instructor User Edits Persist', () => {
        ARUserAddEditPage.getEditUserByUsername(userDetails.username+userDetails.appendText)

        //Verify general section fields persisted
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).should('have.value', userDetails.firstName+userDetails.appendText)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).should('have.value', userDetails.middleName+userDetails.appendText)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).should('have.value', userDetails.lastName+userDetails.appendText)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).should('have.value', userDetails.emailAddressEdited)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).should('have.value', userDetails.username+userDetails.appendText)
        cy.get(ARUserAddEditPage.getDepartmentTxtF()).should('have.value', `.../${departments.Dept_B_name}`)

        //Verify contact information section fields persisted
        cy.get(ARUserAddEditPage.getAddressTxtF()).should('have.value', ecommFields.address+userDetails.appendText)
        cy.get(ARUserAddEditPage.getAddress2TxtF()).should('have.value', ecommFields.address2+userDetails.appendText)
        cy.get(ARUserAddEditPage.getCountryDDown()).should('have.text', ecommFields.country2)
        cy.get(ARUserAddEditPage.getStateProvinceDDown()).should('have.text', ecommFields.province2)
        cy.get(ARUserAddEditPage.getCityTxtF()).should('have.value', ecommFields.city+userDetails.appendText)
        cy.get(ARUserAddEditPage.getZipPostalCodeTxtF()).should('have.value', ecommFields.zipCode)
        cy.get(ARUserAddEditPage.getPhoneTxtF()).should('have.value', ecommFields.phone+userDetails.appendText)

        //Verify employee details section fields persisted
        cy.get(ARUserAddEditPage.getEmployeeNumberTxtF()).should('have.value', employmentDetailsSectionFields.employeeNumber+userDetails.appendText)
        cy.get(ARUserAddEditPage.getJobTitleTxtF()).should('have.value', employmentDetailsSectionFields.jobTitle+userDetails.appendText)
        cy.get(ARUserAddEditPage.getLocationTxtF()).should('have.value', employmentDetailsSectionFields.location+userDetails.appendText)
        cy.get(ARUserAddEditPage.getGenderDDown()).should('contain.text', employmentDetailsSectionFields.gender2)
        cy.get(ARUserAddEditPage.getDateHiredTxtF()).should('have.value', employmentDetailsSectionFields.dateHired2)
        cy.get(ARUserAddEditPage.getDateTerminatedTxtF()).should('have.value', employmentDetailsSectionFields.dateTerminated2)
        
        //Verify details section fields persisted
        cy.get(ARUserAddEditPage.getUrlTxtF()).should('have.value', detailsSectionFields.avatarUrl)
        cy.get(ARUserAddEditPage.getLanguageDDown()).should('contain.text', detailsSectionFields.language2)
        cy.get(ARUserAddEditPage.getNotesTxtA()).should('contain.text', detailsSectionFields.notes+userDetails.appendText)
    })

    it('Verify Instructor User can be Deleted', () => {
        cy.wrap(ARUserAddEditPage.AddFilter('Username', 'Contains', userDetails.username+userDetails.appendText))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        ARUserAddEditPage.getShortWait()
        cy.get(ARUserAddEditPage.getTableCellName(4)).contains(userDetails.username+userDetails.appendText).click()
        arDeleteModal.getDeleteItem()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.get(ARUserAddEditPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})
