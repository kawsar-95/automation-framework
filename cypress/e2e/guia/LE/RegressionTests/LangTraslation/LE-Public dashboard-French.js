import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LELangaugesModal from '../../../../../../helpers/LE/pageObjects/Modals/LELanguages.modal'
import French from '../../../../../../helpers/LE/pageObjects/Translation/French'
import LEPollsPage from '../../../../../../helpers/LE/pageObjects/Polls/LEPollsPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEFAQsPage from '../../../../../../helpers/LE/pageObjects/FAQs/LEFAQsPage'
import LENewsPage from '../../../../../../helpers/LE/pageObjects/News/LENewsPage'
import LEEnrollmentKeyModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'
import courses from '../../../../../fixtures/courses.json'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'



describe('LE - Auth - Login and Logout - Valid - As Admin', function(){


//Public dashboard Language change to French 
it('Login Dashbooard', () => {

cy.visit('#/public-dashboard')
cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible')
LELangaugesModal.selectLanguage('Français')
LEDashboardPage.getShortWait()
cy.get(LEDashboardPage.getPublicDashboardLoginBtn.call('Connexion')).should('be.visible')
cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
cy.get(LEDashboardPage.getHamLoginBtn()).should ('be.visible'),('Connectez-vous pour voir la totalité du contenu')
cy.get(French.getTableaudebord()).should ('be.visible'),('Tableau de bord')
cy.get(French.getTableaudebord()).should ('be.visible'),('Catalogue')

cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()
cy.get(French.getLoginModalTitle()).should('contain.text','Bienvenue. Veuillez vous connecter ci-dessous afin d','accéder à vos cours').should('be.visible')
cy.get(French.getNom()).should('contain.text',"Nom d'utilisateur").should('be.visible')
cy.get(LEDashboardPage.getUsernameTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_USERNAME)
cy.get(French.getNom()).should('contain.text','Mot de passe').should('be.visible')
cy.get(LEDashboardPage.getPasswordTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_PASSWORD)
cy.get(French.getRester()).should('contain.text','Rester connecté').should('be.visible')
cy.get(French.getAvez()).should('contain.text','Avez-vous oublié votre mot de passe?').should('be.visible')
cy.get(French.getInscription()).should('contain.text','Inscription').should('be.visible')
cy.get(LEDashboardPage.getLoginBtn()).contains('Connexion').click()

})

//PrivateDashboard Lang change to French 
it('PrivateDashboard',() => {

 cy.visit('#/public-dashboard')
   LELangaugesModal.selectLanguage('Français')
   cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
   cy.get(LEDashboardPage.getHamLoginBtn()).should('be.visible')  
   cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()
   cy.get(LEDashboardPage.getUsernameTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_USERNAME)
   cy.get(LEDashboardPage.getPasswordTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_PASSWORD)
   cy.get(LEDashboardPage.getLoginBtn()).contains('Connexion').click()

   cy.get(LEDashboardPage.getDashboardPageTitle()).should('have.text', "Bienvenue GUI_Auto Admin LogInOut" + "Nous sommes très heureux de votre visite.")
   LEDashboardPage.getShortWait()
   
//Verify cards exist within the ribbon
cy.scrollTo('center')
   French.getCatalogueRibbonbyNom('Catalogue').should('be.visible')
   LEDashboardPage.getRibbonCardsByLabelName('Catalogue')
   LEDashboardPage.getMediumWait()

//Verify My courses ribbon label & cards are visible in french
   French.getMesCoursbyNom('Mes cours').should('be.visible')
   LEDashboardPage.getRibbonCardsByLabelName('Mes cours')

//Verify Featured Courses ribbon label & cards are visible in french
   LEDashboardPage.getMediumWait()
   LEDashboardPage.getRibbonLabelByName('Cours proposés').should('be.visible')
   LEDashboardPage.getRibbonCardsByLabelName('Cours proposés')

//Verify Pinned Courses ribbon label & cards are visible in french
   LEDashboardPage.getMediumWait()
   LEDashboardPage.getRibbonLabelByName('Mes cours épinglés').should('be.visible')
   LEDashboardPage.getRibbonCardsByLabelName('Mes cours épinglés')


//Verify Mandatory Courses ribbon label & cards are visible in french
  LEDashboardPage.getMediumWait()
  LEDashboardPage.getRibbonLabelByName('Cours obligatoires').should('be.visible')
  LEDashboardPage.getRibbonCardsByLabelName('Cours obligatoires')


})


it('Verify Tiles and URLs', () => {
cy.visit('#/public-dashboard')
  LELangaugesModal.selectLanguage('Français')
  cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
  cy.get(LEDashboardPage.getHamLoginBtn()).should('be.visible')  
  cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()
  cy.get(LEDashboardPage.getUsernameTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_USERNAME)
  cy.get(LEDashboardPage.getPasswordTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_PASSWORD)
  LEDashboardPage.getMediumWait()
  cy.get(LEDashboardPage.getLoginBtn()).contains('Connexion').click()


//Verify Polls tile, content, and URL in French

  French.getSondagesbyNom('Sondages')
  cy.get(LEPollsPage.getPollsPageTitle()).should('contain', 'Sondages')
  cy.get(French.getPollsubtitleinFrench()).should('contain',"Participer aux sondages. Votez sur toutes les choses qui comptent!")
 LEDashboardPage.getMediumWait()
  cy.scrollTo('bottom')
  LEPollsPage.getPollQ(miscData.poll_01_title).should('be.visible')
  LEDashboardPage.getShortWait()
  LEPollsPage.getPollQuestionByName(miscData.poll_02_title).should('be.visible')
  cy.url().should('include', '/#/polls').go('back')
  LEDashboardPage.getMediumWait()

//Verify FAQ tile, content, and URL in French

        LEDashboardPage.getTileByNameThenClick('FAQ')
        cy.get(LEFAQsPage.getFAQsPageTitle()).should('contain', 'Foire aux questions')
        LEDashboardPage.getMediumWait()
        cy.scrollTo('center')
        LEFAQsPage.getFAQsByTitle(miscData.faq_01_title).should('be.visible')
        LEFAQsPage.getFAQsByTitle(miscData.faq_02_title).should('be.visible')
        LEFAQsPage.getFAQsByTitle(miscData.faq_03_title).should('be.visible')
        cy.url().should('include', '/#/faq').go('back')
        LEDashboardPage.getShortWait()

//Verify News tile, content, and URL in French

        LEDashboardPage.getTileByNameThenClick('Dernières actualités')
        cy.get(LENewsPage.getNewsPageTitle()).should('contain', 'Dernières actualités')
        LEDashboardPage.getMediumWait()
        cy.scrollTo('bottom')
        LENewsPage.getNewsArticleByTitle(miscData.news_art_03_title).should('be.visible')
        cy.url().should('include', '/#/news').go('back')
        LEDashboardPage.getShortWait()

//Verify enrollment tile, content, and URL in French

        LEDashboardPage.getTileByNameThenClick("Clé d'inscription")
        cy.get(LEEnrollmentKeyModal.getModalTitle()).should('contain', "Clé d'inscription")
        LEDashboardPage.getMediumWait()
        cy.get(LEEnrollmentKeyModal.getModalCloseBtn()).click()
        LEDashboardPage.getShortWait()

//Verify external link tiles will open in new tabs by checking that their target attribute is _blank  

        LEDashboardPage.getExternalLinkTileByName("Fil d'activité Facebook").should('have.attr', 'target', '_blank')
        LEDashboardPage.getExternalLinkTileByName('fil Twitter').should('have.attr', 'target', '_blank')
        LEDashboardPage.getExternalLinkTileByName('Course Deep Link').should('have.attr', 'target', '_blank')
        LEDashboardPage.getExternalLinkTileByName('Lien externe').should('have.attr', 'target', '_blank')

 //Verify tiles and URLs. Content verified in LE Nav - Side Menu.js

        LEDashboardPage.getTileByNameThenClick('Mes cours')
        LEDashboardPage.getMediumWait()
        cy.url().should('include', '/#/courses').go('back')
        LEDashboardPage.getTileByNameThenClick('Boîte de réception')
        LEDashboardPage.getVLongWait()
        cy.url().should('include', '#/profile/inbox').go('back')
      
        LEDashboardPage.getTileByNameThenClick('Ressources')
       LEDashboardPage.getLongWait()
        cy.url().should('include', '/#/resources').go('back')
        LEDashboardPage.getTileByNameThenClick('Catalogue')
       LEDashboardPage.getLongWait()
        cy.url().should('include', '/#/catalog').go('back')
    })






})


