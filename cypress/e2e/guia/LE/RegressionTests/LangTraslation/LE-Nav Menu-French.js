import users from '../../../../../fixtures/users.json'
import courses from '../../../../../fixtures/courses.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import LECalendarPage from '../../../../../../helpers/LE/pageObjects/Courses/LECalendarPage'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'
import French from '../../../../../../helpers/LE/pageObjects/Translation/French'
import LELanguagesModal from '../../../../../../helpers/LE/pageObjects/Modals/LELanguages.modal'



describe('LE - Nav - Side Menu', function () {


    beforeEach(() => {
        //sign in before each test block
        cy.apiLoginWithSession(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD, "#/login")
        LELanguagesModal.selectLanguage('Français')
        LEDashboardPage.getShortWait()
    })

    it('Navigation Side Menu - Verify Contents & Click Dashboard', () => {
        //cy.get(LELanguagesModal.selectLanguage('Français'))
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByName('Mes cours').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Catalogue').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Ressources').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Mon calendrier').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Relevé de notes').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Profil').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Déconnexion').should('be.visible')
        LESideMenu.getLEMenuItemsByName('Tableau de bord').should('be.visible')
        LEDashboardPage.getMediumWait()
        //Contents verified, click dashboard button in french and assert URL
        LESideMenu.getLEMenuItemsByName('Tableau de bord').click()
        cy.url().should('include', '/#/dashboard')
        LEDashboardPage.getMediumWait()
    })

    it('Click My Courses - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LEDashboardPage.getMediumWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Mes cours')
        cy.url().should('include', '/#/courses/')
        cy.get(LECoursesPage.getCoursesPageTitle()).should('contain', 'Mes cours')
        LECoursesPage.getMediumWait()
        cy.get(LECoursesPage.getCourseCardName()).should('contain', 'Azam CURR')
        cy.get(LEFilterMenu.getFilterBtn()).should('be.visible').click()
        LEDashboardPage.getMediumWait()
        cy.get(French.getHideRefineSearchTxtinFrench()).should('contain.text','Masquer Affiner la recherche').should('be.visible')
        cy.get(French.getShowCategoriesTxtinFrench()).should('have.text','Afficher les catégories').should('be.visible')
        cy.get(French.getShowCompletedTxtinFrench()).should('have.text','Afficher les éléments terminés').should('be.visible')
        cy.get(French.getOCChkBoxinFrench()).should('have.text','Cours en ligne').should('be.visible').click()
        cy.get(French.getILCChkBoxinFrench()).should('have.text','Cours en présentiel').should('be.visible').click()
        cy.get(French.getCURRChkBoxinFrench()).should('have.text','Cursus').should('be.visible').click()
        cy.get(French.getSearchFilterTxtFinFrench()).should('have.text','Nom du cours:').should('be.visible')
        cy.scrollTo('center')
        cy.get(LEFilterMenu.getSearchFilterTxtF()).should('be.visible').type('test')
        LEDashboardPage.getMediumWait()
        cy.get(French.getAdvancedFilterDDownTxtinFrench()).should('have.text','Filtrage avancé:').should('be.visible')
        cy.get(LEFilterMenu.getSearchFilterBtn()).should('be.visible').click()
        cy.get(LEFilterMenu.getAdvancedFilterDDown()).should('be.visible')
        LEDashboardPage.getMediumWait()
    })


    it('Click Resources - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LEDashboardPage.getShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Ressources')
        cy.url().should('include', '#/resources')
        cy.get(LEResourcesPage.getResourcesPageTitle()).should('contain', 'Ressources')
        cy.get(French.getSortColumnTxtinFrench()).should('have.text','Nom de la ressource').should('be.visible')
        cy.get(LEResourcesPage.getResourceName()).should('contain', 'Global Resource Manual Test K')
        cy.get(LEResourcesPage.getViewBtn()).should('be.visible')
        //Filter menu begins in an expanded state in the resources page 
        cy.get(French.getResourceSearchFilterTxtinFrench()).should('have.text','Masquer Affiner la recherche').should('be.visible')
        cy.get(French.getShowCategoriesTxtinFrench()).should('have.text','Afficher les catégories').should('be.visible')
        cy.get(French.getSearchFilterTxtFinFrench()).should('have.text','Nom de la ressource:').should('be.visible')
        cy.get(LEFilterMenu.getSearchFilterTxtF()).should('be.visible').type('test')
        cy.get(LEFilterMenu.getSearchFilterBtn()).should('be.visible').click()
        cy.get(French.getTagTextinFrench()).should('have.text','Balises:').should('be.visible')
        cy.get(LEFilterMenu.getTagsDDown()).should('be.visible').click()
        LEDashboardPage.getVLongWait()
    })

    it('Click Calendar - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LEDashboardPage.getShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Mon calendrier')
        cy.url().should('include', '#/courses/?viewType=Calendar')
        cy.get(LECalendarPage.getCalendarPageTitle()).should('contain', 'Mes cours')
        cy.get(LECalendarPage.getViewBtn()).should('be.visible')
        cy.get(LECalendarPage.getCalendarMonthYearBtn()).should('be.visible').click()
        cy.get(LECalendarPage.getCalendarPrevMonthBtn()).should('be.visible').click()
        cy.get(LECalendarPage.getCalendarNextMonthBtn()).should('be.visible').click()
        cy.get(LECalendarPage.getCalendarDayofMonth()).should('be.visible')
        LEDashboardPage.getMediumWait()
    })

    it('Click Transcript - Verify URL & Page Contents', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LEDashboardPage.getShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Relevé de notes')
        cy.url().should('include', '#/transcript')
        LEDashboardPage.getVLongWait()
        cy.get(LETranscriptPage.getTranscriptPageTitle()).should('contain', 'Relevé de notes pour ' + users.learner01.LEARNER_01_FNAME + ' ' + users.learner01.LEARNER_01_LNAME)
        cy.get(French.getTranscriptUsernameTxtinFrench()).should('have.text',"Nom d'utilisateur:GUIAutoL01")
        cy.get(LETranscriptPage.getUsername()).should('contain', users.learner01.LEARNER_01_USERNAME)
        cy.get(French.getTranscriptEmailTxtinFrench()).should('have.text',"Adresse e-mail:qa.guiauto1@absorblms.com")
        cy.get(LETranscriptPage.getEmail()).should('contain', users.learner01.LEARNER_01_EMAIL)
        cy.get(LETranscriptPage.getPrintTranscriptBtn()).should('have.text','Imprimer le relevé de notes').should('be.visible')
    //TranscriptCertificate
        cy.get(French.getTranscriptinFrench()).should('have.text','Certificats').should('be.visible')
        cy.get(French.getTranscriptCourseTitleinFrench()).should('be.visible')
        cy.get(French.getTranscriptCertValidFrominFrench()).should('be.visible')
        cy.get(French.getTranscriptCertExpireinFrench()).should('be.visible')
        cy.get(French.getTranscriptCertViewinFrench()).should('be.visible')
    //TranscriptCompetencies
    cy.scrollTo('center')
    LEDashboardPage.getMediumWait()
        cy.get(French.getTranscriptHeadersinFrench()).should('have.text','CréditsCompétencesCoursFormation externe').should('be.visible')
        cy.get(French.getTranscriptComptinFrench()).should('have.text','Titre de compétence').should('be.visible')
        cy.get(French.getTranscriptComptLevelinFrench()).should('have.text','Niveau').should('be.visible')
        cy.get(French.getTranscriptComptEarnedDateinFrench()).should('have.text',"Date d’obtention").should('be.visible')
    //  TranscriptCourseenrollment
        cy.get(French.getTranscriptHeadersinFrench()).should('have.text','CréditsCompétencesCoursFormation externe').should('be.visible')
        cy.get(French.getTranscriptCourseTitleinFrench()).should('be.visible')
        cy.get(French.getTranscriptCourseStatusinFrench()).should('be.visible')
        cy.get(French.getTranscriptScoreinFrench()).should('be.visible')
        cy.get(French.getTranscriptCompletionDateinFrench()).contains("Date d'achèvement").should('be.visible')
        cy.get(French.getTranscriptCreditsinFrench()).should('be.visible')
        cy.get(French.getTranscriptLoadmoreTextinFrench()).contains('Charger plus...').should('be.visible')
    //TranscriptExternalTraining
    cy.scrollTo('bottom')
        cy.get(French.getTranscriptExtTrainingTxtinFrench()).contains('Formation externe').should('be.visible')
        cy.get(French.getTranscriptCourseNameinFrench()).contains('Nom du cours').should('be.visible')
        cy.get(French.getTranscriptCourseStatusinFrench()).contains('Statut').should('be.visible')
        cy.get(French.getTranscriptCompletionDateinFrench()).contains("Date d'achèvement").should('be.visible')
        cy.get(French.getTranscriptCertViewinFrench()).contains('Visionner').should('be.visible')
        LEDashboardPage.getMediumWait()

    //TimeandDate
        cy.get(French.getTranscriptTimezoneinFrench()).should('be.visible')
       


    })

    it('Click Profile - Verify URL', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Profil')
        LEDashboardPage.getMediumWait()
        cy.url().should('include', '#/profile')
        //Profile page elements verified in LE Nav - Top Toolbar.js
    })

    it('Click Log out - Verify Log Off & URL', () => {
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Déconnexion')
        LEDashboardPage.getMediumWait()
        cy.url().should('include', '#/public-dashboard')
    })
})