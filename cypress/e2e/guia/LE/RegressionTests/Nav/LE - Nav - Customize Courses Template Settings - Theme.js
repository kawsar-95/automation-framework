import { users } from '../../../../../../helpers/TestData/users/users'
import { defaultThemeColors, testThemeColors } from '../../../../../../helpers/TestData/Template/templateTheme'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateThemePage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateThemePage'

describe('LE - Nav - Customize Courses Template Settings - Theme', function () {
  //This script uses indexes to identify elements for the menus as there was no way to define them another way
  beforeEach(() => {
      //sign in and navigate to manage template before each test
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
      LEManageTemplateMenu.getManageTemplateMenuItemsByName('Theme').should('be.visible').click()
      cy.url().should('include', '/#/learner-mgmt/theme')
      LEManageTemplateThemePage.getManageTemplateThemeContainerByNameThenClick('Colors')
      
  })

  it('Change Theme Colors, save, verify colors are reflected in LE', () => {
    //Branding
    LEManageTemplateThemePage.getPickColorByName('Base', testThemeColors.testColor1)
    LEManageTemplateThemePage.getPickColorByName('Highlight', testThemeColors.testColor2)
    //Status
    LEManageTemplateThemePage.getPickColorByName('Primary', testThemeColors.testColor3)
    LEManageTemplateThemePage.getPickColorByName('Default', testThemeColors.testColor1)
    //Dashboard
    LEManageTemplateThemePage.getPickColorByName('Dashboard Background', testThemeColors.testColor2)
    LEManageTemplateThemePage.getPickColorByName('Dashboard Container Title', testThemeColors.testColor3)
    LEManageTemplateThemePage.getPickColorByName('Dashboard Tile Icon', testThemeColors.testColor1)
    LEManageTemplateThemePage.getPickColorByName('Dashboard Tile Text', testThemeColors.testColor2)
    LEManageTemplateThemePage.getPickColorByName('Tile Background', testThemeColors.testColor3)
    //Type
    LEManageTemplateThemePage.getPickColorByName('Banner & Button Text', testThemeColors.testColor1)
    LEManageTemplateThemePage.getPickColorByName('Title & Body Text', testThemeColors.testColor2)
    LEManageTemplateThemePage.getPickColorByName('Hyperlinks', testThemeColors.testColor3)
    //Icons
    LEManageTemplateThemePage.getPickColorByName('Header Icons', testThemeColors.testColor1)
    LEManageTemplateThemePage.getPickColorByName('View Selection Icons', testThemeColors.testColor2)
    LEManageTemplateThemePage.getPickColorByName('Menu Icons', testThemeColors.testColor3)
    LEManageTemplateThemePage.getPickColorByName('Button Icons', testThemeColors.testColor1)
    //Accessibility
    LEManageTemplateThemePage.getPickColorByName('Keyboard Focus Visible', testThemeColors.testColor2)
    //Save & Verify
    cy.get(LEManageTemplateThemePage.getContainerSaveBtn()).click()
    cy.get(LEManageTemplateThemePage.getSuccessMessage()).should('have.text', 'Changes Saved.')
    cy.get('.header__header').invoke('css', 'background-color').should('eq', testThemeColors.testColorRGB1)
    cy.get(LEManageTemplateThemePage.getCountPill()).invoke('css', 'background-color').should('eq', testThemeColors.testColorRGB2)
    //Navigate to Courses
    cy.get(LEDashboardPage.getNavMenu()).click()
    LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
    cy.get('.dropdown__arrow', {timeout: 10000}).invoke('css', 'color').should('eq', testThemeColors.testColorRGB1)
    //Navigate to Dashboard
    cy.visit('/#/dashboard')
    cy.get(LEDashboardPage.getPrivateDashboardBackground(), {timeout: 10000}).invoke('css', 'background-color').should('eq', testThemeColors.testColorRGB2)
    //Navigate to Profile Page
    cy.get(LEDashboardPage.getNavProfile()).click()
    cy.get(LEProfilePage.getEditProfileBtn()).invoke('css', 'background-color').should('eq', testThemeColors.testColorRGB3)

      
      
  })

      it('Change Theme Colors back to default, save, verify colors are reflected in LE', () => {
        //Branding
        LEManageTemplateThemePage.getPickColorByName('Base', defaultThemeColors.default_base_color)
        LEManageTemplateThemePage.getPickColorByName('Highlight', defaultThemeColors.default_highlight_color)
        //Status
        LEManageTemplateThemePage.getPickColorByName('Primary', defaultThemeColors.default_primary_color)
        LEManageTemplateThemePage.getPickColorByName('Default', defaultThemeColors.default_default_color)
        //Dashboard
        LEManageTemplateThemePage.getPickColorByName('Dashboard Background', defaultThemeColors.default_dashboard_background_color)
        LEManageTemplateThemePage.getPickColorByName('Dashboard Container Title', defaultThemeColors.default_dashboard_container_title)
        LEManageTemplateThemePage.getPickColorByName('Dashboard Tile Icon', defaultThemeColors.default_dashboard_tile_icon_color)
        LEManageTemplateThemePage.getPickColorByName('Dashboard Tile Text', defaultThemeColors.default_dashboard_tile_text)
        LEManageTemplateThemePage.getPickColorByName('Tile Background', defaultThemeColors.default_tile_background_color)
        //Type
        LEManageTemplateThemePage.getPickColorByName('Banner & Button Text', defaultThemeColors.default_banner_button_text_color)
        LEManageTemplateThemePage.getPickColorByName('Title & Body Text', defaultThemeColors.default_title_body_text_color)
        LEManageTemplateThemePage.getPickColorByName('Hyperlinks', defaultThemeColors.default_hyperlinks_color)
        //Icons
        LEManageTemplateThemePage.getPickColorByName('Header Icons', defaultThemeColors.default_header_icons_color)
        LEManageTemplateThemePage.getPickColorByName('View Selection Icons', defaultThemeColors.default_view_selection_icons_color)
        LEManageTemplateThemePage.getPickColorByName('Menu Icons', defaultThemeColors.default_menu_icons_color)
        LEManageTemplateThemePage.getPickColorByName('Button Icons', defaultThemeColors.default_button_icons_color)
        //Accessibility
        LEManageTemplateThemePage.getPickColorByName('Keyboard Focus Visible', defaultThemeColors.default_keyboard_focus_visible_color)
        //Save & Verify
        cy.get(LEManageTemplateThemePage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateThemePage.getSuccessMessage()).should('have.text', 'Changes Saved.')
        cy.get('.header__header').invoke('css', 'background-color').should('eq', defaultThemeColors.default_base_rgb)
        cy.get(LEManageTemplateThemePage.getCountPill()).invoke('css', 'background-color').should('eq', defaultThemeColors.default_highlight_rgb)
        //Navigate to Courses
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get('.dropdown__arrow', {timeout: 10000}).invoke('css', 'color').should('eq', defaultThemeColors.default_default_rgb)
        //Navigate to Dashboard
        cy.visit('/#/dashboard')
        cy.get(LEDashboardPage.getPrivateDashboardBackground(), {timeout: 10000}).invoke('css', 'background-color').should('eq', defaultThemeColors.default_dashboard_background_rgb)
        //Navigate to Profile Page
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getEditProfileBtn()).invoke('css', 'background-color').should('eq', defaultThemeColors.default_primary_rgb)
  })



})