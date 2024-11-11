import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import ARFilesPage from "../../../../../../helpers/AR/pageObjects/Setup/ARFilesPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

describe('C6318 - AR - Setup - Delete Folder', function () {
    before('Create a Course with a Poster Upload', function() {
        // Login as a sys admin and visit to course page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        // Create a course for all learners without any content
        cy.createCourse('Online Course', ocDetails.courseName) 
        
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        ARDashboardPage.getShortWait()
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()

        // Upload a poster
        cy.get(ARDashboardPage.getFileChooserBtnContainer()).find('div').contains('Choose File').click({force: true})
        ARDashboardPage.getVShortWait()

        cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(`${commonDetails.filePath}${commonDetails.posterImgName}`)
        ARDashboardPage.getLShortWait()

        // Save the uploaded poster image
        cy.get(arUploadFileModal.getSaveBtn()).click()
        ARDashboardPage.getLongWait()

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })  
    })

    // 
    after('Delete Course as Part of Clean-up', function() {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Open File Manager, Open a Sub-Folder and Delete', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click on Setup
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        // Click on files options
        ARDashboardPage.getMenuItemOptionByName('Files')
        ARDashboardPage.getMediumWait()

        cy.get(ARFilesPage.getSubFolder('Public')).eq(1).click({force: true})
        ARFilesPage.getMediumWait()
        cy.get(ARFilesPage.getSubFolder('Courses')).eq(1).click({force: true})
        ARFilesPage.getMediumWait()
        cy.get(ARFilesPage.getFilFolderSearchContainer()).eq(0).within(() => {
            cy.get('input').invoke('show').type(commonDetails.courseID, {force: true})
        })
        ARFilesPage.getMediumWait()

        // Assert that searching a course directeory is found
        cy.get(ARFilesPage.getFolderList()).should('have.length.gt', 0)
        // Select the folder found
        cy.get(ARFilesPage.getFolderList()).then($els => {}).as('folderList')
        cy.get('@folderList').then(folders => folders[0].click())
        ARFilesPage.getMediumWait()

        // Binding window:confirm event to mimic clicking 'OK' in browser confirm dialog
        cy.on('window:confirm', (str) => {
            expect(str).to.eq('Are you sure you want to delete this folder?')
            return true
        })

        // Delete the folder
        cy.get(ARFilesPage.getFolderDeleteBtn()).eq(0).invoke('show').click({force: true})
    })
})