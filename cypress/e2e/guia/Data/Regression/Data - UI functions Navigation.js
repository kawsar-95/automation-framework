import DataReportPagesNavigation from "../../../../../helpers/Data/PageObjects/DataMenu/DataReportPagesNavigation";
import DataLeftSideMenu from "../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";


describe('DMS navigation smoke test', () => {
  it('should go through all sub menus and make sure each report page accessible', () => {
    
    // Visit the authenticated page and assert that the user is logged in
    cy.visit('/')
    DataReportPagesNavigation.getShortWait()
    cy.get(DataReportPagesNavigation.getDashboardsSubTab('Overview')).should('be.visible')

    // Dashboards - visit each tab in Dashboards
    DataReportPagesNavigation.getDashboardsSubTabThenClick('Imports')
    DataReportPagesNavigation.getShortWait()
    cy.get(DataReportPagesNavigation.getDashboardsCardTitle('Total Imports')).should('be.visible')
    DataReportPagesNavigation.getDashboardsSubTabThenClick('Exports')
    DataReportPagesNavigation.getShortWait()
    cy.get(DataReportPagesNavigation.getDashboardsCardTitle('Total Exports')).should('be.visible')

    // Integrations (Imports/Exports)
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Imports')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Exports')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Exports')).should('be.visible')

    // Users (Users/Roles)
    DataLeftSideMenu.getLeftMenuBtnThenClick('Users')
    DataLeftSideMenu.getSubMenuThenClick('Users')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Users')).should('be.visible')
 
    DataLeftSideMenu.getLeftMenuBtnThenClick('Users')
    DataLeftSideMenu.getSubMenuThenClick('Roles')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Roles')).should('be.visible')

    // Audit Logs (Imports/Exports/Modules/Turnkeys)

    DataLeftSideMenu.getLeftMenuBtnThenClick('Audit Logs')
    DataReportPagesNavigation.getShortWait()
    DataReportPagesNavigation.getAuditLogSubMenuThenClick('Imports')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Audit Logs for Imports')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Audit Logs')
    DataReportPagesNavigation.getAuditLogSubMenuThenClick('Exports')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Audit Logs for Exports')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Audit Logs')
    DataLeftSideMenu.getSubMenuThenClick('Modules')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Audit Logs for Modules')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Audit Logs')
    DataLeftSideMenu.getSubMenuThenClick('Turnkeys')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Audit Logs for Turnkeys')).should('be.visible')

    // Tools (Sandbox Refresh/User Restore/Course Restore/Enrollment Restore/Enrollment Deletion/External Applications/Feature Flags/Impersonate/Database Migrations)
    // Errors/Hangfire pages need manual check since they open to a different url
    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataLeftSideMenu.getSubMenuThenClick('Sandbox Refresh')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Sandbox Refreshes')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataLeftSideMenu.getSubMenuThenClick('User Restore')
    DataReportPagesNavigation.getShortWait()
    cy.get(DataReportPagesNavigation.getUserRestoreCancelBtn()).click()
    cy.get(DataReportPagesNavigation.getReportPageTitle('User Restore')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataLeftSideMenu.getSubMenuThenClick('Course Restore')
    DataReportPagesNavigation.getShortWait()
    cy.get(DataReportPagesNavigation.getUserRestoreCancelBtn()).click()
    cy.get(DataReportPagesNavigation.getReportPageTitle('Course Restore')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataReportPagesNavigation.getShortWait()
    DataLeftSideMenu.getSubMenuThenClick('Enrollment Deletion')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Enrollment Deletions')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataLeftSideMenu.getSubMenuThenClick('External Applications')
    cy.get(DataReportPagesNavigation.getReportPageTitle('External Applications')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataLeftSideMenu.getSubMenuThenClick('Feature Flags')
    cy.get(DataReportPagesNavigation.getFeatureFlagImpersonatePageTitle('Feature Flags')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataLeftSideMenu.getSubMenuThenClick('Impersonate')
    cy.get(DataReportPagesNavigation.getFeatureFlagImpersonatePageTitle('Impersonate')).should('be.visible')

    DataLeftSideMenu.getLeftMenuBtnThenClick('Tools')
    DataLeftSideMenu.getSubMenuThenClick('Database Migrations')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Database Migrations')).should('be.visible')

    // Alfred
    DataLeftSideMenu.getLeftMenuBtnThenClick('Alfred')
    DataReportPagesNavigation.getAlfredSubMenuThenClick('Overview')
    cy.get(DataReportPagesNavigation.getReportPageTitle('Alfred Integrations')).should('be.visible')

  });
});
