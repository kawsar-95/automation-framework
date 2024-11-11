
export default new class LEDashboardAccountMenu {
    constructor() {
        this.dashboardMenuItemBtn = '[href="#/dashboard"]';
        this.myCoursesMenuItemBtn = '[href="#/courses/"]';
        this.catalogMenuItemBtn = '[href="#/catalog/"]';
        this.resourcesMenuItemBtn = '[href="#/resources/"]';
        this.calenderMenuItemBtn = '[href*="Calendar"]';
        this.transcriptMenuItemBtn = '[href="#/transcript"]';
        this.profileMenuItemBtn = '[href="#/profile"]';
        this.logoutMenuItemBtn = 'button [class*="icon-logout-arrow"]';
    }

}