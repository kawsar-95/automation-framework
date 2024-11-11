import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEUploadFileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEUploadFileModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'

describe('LE - Profile - Learner Can Upload Avatar', function(){

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign in and go to social profile
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()
    })

    after(function() {
        //Cleanup - Delete User
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Learner can Upload Avatar Image', () => {    
        //Verify Placeholder Avatar
        cy.get(LEProfilePage.getAvatarPlaceholder()).should('exist')
        
        //Verify Avatar Upload Can be Cancelled while Scan is in progress
        cy.get(LEProfilePage.getUploadAvatarBtn()).click()
        cy.get(LEDashboardPage.getFileInput()).attachFile(`${resourcePaths.resource_image_folder}${images.umbrella_icon_filename}`)
        cy.get(LEUploadFileModal.getUploadedFileMsg()).should('contain', 'Upload processing')
        cy.get(LEUploadFileModal.getFooterBtn()).contains('Cancel').click()
        cy.get(LEProfilePage.getAvatarPlaceholder()).should('exist')

        //Verify Avatar Image can Be Successfully Uploaded
        cy.get(LEProfilePage.getUploadAvatarBtn()).click()
        cy.get(LEDashboardPage.getFileInput()).attachFile(`${resourcePaths.resource_image_folder}${images.umbrella_icon_filename}`)
        cy.get(LEUploadFileModal.getUploadedFileMsg(), {timeout:LEDashboardPage.getLShortWait()}).should('contain', 'Upload verified')
        cy.get(LEUploadFileModal.getFooterBtn()).contains('Save').click()
        LEDashboardPage.getShortWait()
    })

    it('Verify Learner Avatar Persists', () => {  
        //Verify Avatar Image has Persisted
        cy.get(LEProfilePage.getAvatar()).should('have.attr', 'src')    
            .and('include', images.umbrella_icon_filename.slice(0, -4).replace(/\s/g, '%20'))
    })
})