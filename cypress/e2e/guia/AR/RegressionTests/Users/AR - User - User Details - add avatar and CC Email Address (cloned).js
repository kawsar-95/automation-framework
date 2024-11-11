import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import {userDetails, ecommFields, employmentDetailsSectionFields, detailsSectionFields, adminRoles}  from '../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('C1012 - AR - User Details - add avatar and CC Email Address (cloned)', () => { 
    before('Add a User', () => {
        //Log in as a system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
        //Redirect to the left panel and click on the Users Icon
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on Users button
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARUserAddEditPage.getMediumWait()
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        ARUserAddEditPage.getMediumWait()

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

        // Fill out details section
        cy.get(ARUserAddEditPage.getLanguageDDown()).click()
        cy.get(ARUserAddEditPage.getLanguageDDownSearchTxtF()).eq(0).type(detailsSectionFields.language)
        cy.get(ARUserAddEditPage.getLanguageDDownOpt()).contains(detailsSectionFields.language).click()

        cy.get(ARUserAddEditPage.getNotesTxtA()).type(detailsSectionFields.notes)

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        // cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        cy.intercept('**/details').as('saveUserDetails').wait('@saveUserDetails')
    })

    after('User Deleted', () => {
        //Redirect to the left panel and click on the Users Icon
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on Users button
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARUserAddEditPage.getMediumWait()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.wrap(ARUserAddEditPage.AddFilter('Username', 'Contains', userDetails.username))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        ARUserAddEditPage.getShortWait()
        cy.get(ARUserAddEditPage.getTableCellName(4)).contains(userDetails.username).click()
        arDeleteModal.getDeleteItem()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')       
    })

    it('Verify Edit User', () => {
        // Navigate to Users page, select an user and click Edit
        cy.get(ARUserAddEditPage.getElementByTitleAttribute('Users')).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')

        cy.wrap(ARUserAddEditPage.AddFilter('Username', 'Contains', userDetails.username))
        ARUserAddEditPage.getShortWait()
        cy.get(ARUserAddEditPage.getTableCellName(4)).contains(userDetails.username).click()
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Edit User'), {timeout:6000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')
        ARUserAddEditPage.getLongWait()

        // select a file on the formats .png on the avatar, and save
        cy.get(ARUserAddEditPage.getAvatarRadioBtn()).filter(':contains("File")').should('exist')
        cy.get(ARUserAddEditPage.getAvatarRadioBtn()).contains('File').click({force:true})
        ARUploadFileModal.getShortWait()

        cy.get(ARUserAddEditPage.getChooseFileBtn()).click({force:true})
        ARUploadFileModal.getShortWait()

        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('dialog-title')).should('have.text', 'File Manager')
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('media-library-file-upload')).click()
        ARUploadFileModal.getShortWait()

        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(detailsSectionFields.avatarFilePath)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click()
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.intercept('/api/rest/v2/admin-uploads').as('getUpload').wait('@getUpload')
        ARUploadFileModal.getShortWait()

        // select a file on the formats .jpg on the avatar, and save
        cy.get(ARUserAddEditPage.getChooseFileBtn()).click({force:true})
        ARUploadFileModal.getShortWait()

        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('dialog-title')).should('have.text', 'File Manager')
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('media-library-file-upload')).click()
        ARUploadFileModal.getShortWait()

        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(detailsSectionFields.avatarFilePathJpg)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click()
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.intercept('/api/rest/v2/admin-uploads').as('getUpload').wait('@getUpload')

        // select an image from url, paste the url on the field and save
        cy.get(ARUserAddEditPage.getAvatarRadioBtn()).contains('Url').click()
        cy.get(ARUserAddEditPage.getUrlTxtF()).type(detailsSectionFields.avatarUrl)

        // verify that you can add up to 5 cc email addresses
        cy.get(ARUserAddEditPage.getCCEmailAddresses()).should('have.text', 'Add CC Email Address')
        cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).type(detailsSectionFields.CCEmailAddress)
        cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).eq(1).type(detailsSectionFields.CCEmailAddress2)
        cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).eq(2).type(detailsSectionFields.CCEmailAddress3)
        cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).eq(3).type(detailsSectionFields.CCEmailAddress4)
        cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).eq(4).type(detailsSectionFields.CCEmailAddress5)
        ARUploadFileModal.getShortWait()

        // Delete cc email
        cy.get(ARUserAddEditPage.getCCEmailAddressDeleteBtn()).eq(4).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressDeleteBtn()).eq(3).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressDeleteBtn()).eq(2).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressDeleteBtn()).eq(1).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressDeleteBtn()).click()

        cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).type(detailsSectionFields.CCEmailAddress)

        cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).should('have.value', detailsSectionFields.CCEmailAddress)

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        ARUploadFileModal.getShortWait()
    })
})
