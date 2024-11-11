import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { ocDetails, catalogVisibility, courseResourceSection  } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'
import ARCourseREsourcesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseResources.module'

/**
 * Testrail URL:
 * https://absorblms.testrail.io//index.php?/tests/view/288885
 * Original NASA story: https://absorblms.atlassian.net/browse/NASA-6779
 * Automation Subtask: https://absorblms.atlassian.net/browse/NASA-7502
 */

describe('AR - CED - OC - Catalog Visibility - Create Course - T288885', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)
    })   

    it('Verify Catalog Visibility Thumbnail and Poster can be uploaded', () => {
        cy.createCourse('Online Course')

        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Resources')).click()
        AROCAddEditPage.getShortWait()

        //Select Resources
        cy.get(ARCourseREsourcesModule.getResourceBtn()).click()
        AROCAddEditPage.getShortWait()

        //Add Valid Name to Object Lesson
        cy.get(ARCourseREsourcesModule.getNameTxt()).eq(1).type(courseResourceSection.ocFMCourseREsourceName)

        //Set Source to be file. force:true used here because the radio button was being covered, even though it wasn't. This is due to the way radio buttons are being coded
        //Tested to make sure the correct button was being selected, it is. 
        //There are 2 instances of the radio button that is implemented and no way to seperate them; using eq to select the correct one
        cy.get(ARCourseSettingsCatalogVisibilityModule.getSelectFileBtnOption()).eq(1).click({force:true})

        //Choose a File
        cy.get(ARCourseREsourcesModule.getCourseResourcesChooseFileBtn()).click()

        //Select upload from the media library and upload a file
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()

        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.courseResourceFMUploadName)
        AROCAddEditPage.getMediumWait() //Wait for file upload to appear
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        AROCAddEditPage.getMediumWait() //Wait for Course details to appear

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36)     
                })
      })
})
