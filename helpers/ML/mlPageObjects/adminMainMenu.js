
export default new class mainMenu {

    menuGroupCourse() {
        return `[id="courses-menu-group"]`;
    }

    reportsCourse() {
        return `[id="courses-report-menu-option"]`;
    }

    menuGroupSetup() {
        return `[id="setup-menu-group"]`;
    }

    absorbUtilities() {
        return `[id="absorb-utilities-menu-option"]`;
    }

    columnNameFilter() {
        return `[title="Name Filter"]`;
    }

    btnAddFilter() {
        return `[data-name="submit-filter"]`;
    }
    
    textFieldValue() {
        return 'input[aria-label="Value"]';
    }
    
}