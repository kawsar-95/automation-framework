import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";

export default new class AREnrollUsersPage extends arBasePage {

    getEnrollUsersToggle() {
        return '[class*="enroll-users-module__users_toggle"]'
    }

    getUsersHeader() {
        return this.getElementByDataNameAttribute("label")
    }

    getEnrollUsersDDown() {
        return '[data-name="userIds"] [data-name="field"]'
    }

    getEnrollUserUpDownIcon() {
        return '[class*="icon icon-arrows-up-down"]'
    }

    getEnrollUsersSearchTxtF() {
        return this.getElementByNameAttribute("userIds")
    }

    getEnrollUsersOpt(learnerName) {
        //cy.get('[class*="select-module__input--gFr8I"]').contains(learnerName).click()
        cy.get('[class="_user_name_email_4qguj_70"]').contains(learnerName).click()
    }

    getILCSessionsDDown() {
        return '[class*="select-field-module__placeholder"]'
    }

    getILCSessionSearchTxt() {
        return "Sessions";
    }

    getILCSessionsDDownOpt(sessionName) {
        cy.get('[class*="session-select-option-module__name"]').contains(sessionName).click()
    }

    //Use when enrolling users into multiple ILC courses & sessions at once
    getSelectILCSessionWithinCourse(courseName, sessionName) {
        cy.get('[data-name="name"]').contains(courseName).parents('[class*="_content_8z5wt_15"]').within(() => {
            cy.get('[data-name="field"]').click()
            cy.get('input[data-name="input"]').type(sessionName)
            cy.get('[role="option"]').contains(new RegExp("^" + sessionName + "$", "g")).click() //use regex for exact match
        })
    }

    getEnrollCourseItem() {
        return '[data-name="course-list"]'
    }

    getSelectILCSessionDDown() {
        return '[data-name="field"]'
    }

    getILCSessionsDDownOpts() {
        return '[class*="_session_iaq2i"]'
    }

    getILCSessionsDDownOptName() {
        return '[class*="_name_iaq2i"]'
    }

    getSpacesLeftTxt() {
        return '[data-name="spaces-left"]'
    }

    checkSessionsAvailableSeats(courseName, sessionName, availableSeats) {
        cy.get(this.getCourseNameModule()).contains(courseName).parents(this.getEnrollCourseItem()).within(() => {
            cy.get(this.getSelectILCSessionDDown()).click() // open sessions ddown
            cy.get(this.getILCSessionsDDownOptName()).contains(new RegExp("^" + sessionName + "$", "g")).parents(this.getILCSessionsDDownOpts()).within(() => {
                if (availableSeats === 0) {
                    cy.get(this.getSpacesLeftTxt()).should('have.text', 'No seats available')
                }
                else if (availableSeats > 0) {
                    cy.get(this.getSpacesLeftTxt()).should('have.text', `${availableSeats} seats available`)
                } else {
                    cy.get(this.getSpacesLeftTxt()).should('have.text', 'Unlimited seats')
                }
            })
            cy.get(this.getSelectILCSessionDDown()).click() // hide sessions ddown
        })
    }

    getEnrollUsersAddCourseBtn() {
        return "add-course";
    }

    getLabel(){
        return '[data-name="label"]'
    }

    //Pass array of courses & usernames or single course & username in an array to enroll user(s) in the course(s)
    //pass ilc session name if wanting to enroll user in ilc session as well - currently only works when ILC is passed as only course in array.
    getEnrollUserByCourseAndUsername(course, username, ilcSession = null) {
        //Filter for and select course(s)
        for (let i = 0; i < course.length; i++) {
            cy.wrap(this.AddFilter('Name', 'Contains', course[i]))
            cy.get(this.getWaitSpinner()).should('not.exist')
            cy.get(this.getTableCellName(2),{timeout:15000}).contains(course[i]).should('exist')
            ARDashboardPage.selectTableCellRecord(course[i], 2)
        }
        if (course.length > 1) {
            cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Enroll Users'), 2000))
            cy.get(this.getAddEditMenuActionsByName('Enroll Users')).click()
        } else {
            cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Enroll User'), 2000))
            cy.get(this.getAddEditMenuActionsByName('Enroll User')).click()
        }
        //Filter for and select user(s)
        cy.get(this.getEnrollUsersDDown()).click()
        for (let i = 0; i < username.length; i++) {
            cy.get(this.getEnrollUsersSearchTxtF()).type(username[i])
            this.getEnrollUsersOpt(username[i])
            cy.get(this.getEnrollUsersSearchTxtF()).clear()
        }
        cy.get(this.getUsersHeader()).contains('Users').click() // hide users ddown
        //Select ILC session if passed
        if (ilcSession != null) {
            this.getSelectILCSessionWithinCourse(course[0], ilcSession)
        }

        //Save enrollment
        cy.wrap(this.WaitForElementStateToChange(this.getSaveBtn(), this.getShortWait()))
        cy.get(this.getSaveBtn()).click()
        //Wait for enrollment to complete
        if (course.length > 1) { //for bulk enrollments
            cy.get(this.getToastSuccessMsg(), { timeout: 20000 }).should('contain', 'Enrollment Requested')
            cy.get(this.getToastCloseBtn()).click()
            this.getShortWait()
            // cy.get(this.getToastSuccessMsg(), { timeout: 30000 }).should('contain', 'Enrollment Successful')
        } else {
            cy.get(this.getToastSuccessMsg(), { timeout: 20000 }).should('be.visible')
            //cy.get(this.getToastCloseBtn()).click()
        }
    }
    getEnrollUserTxtF() {
        return 'input[class*="select2-input"]'
    }
    getUserEnrollDDown() {
        return 'div[class="input-group"]'
    }
    getUserEnrollListItem() {
        return 'ul.select2-results > li'
    }

    //Enroll Users Page 
    getEnrollUsersContextMenu() {
        return `[id="enroll-users-context-menu"]`
    }

    getSelectedRowCssClass() {
        return ` _selected`
    }

    getUnselectedRowCssClass() {
        return `grid-row-module__grid_row--jTLF3`
    }

    getEnrollCourseModuleDetails() {
        return `[class*="_courses_"]`
    }

    // Added for TC# C982
    getCourseNameModule() {
        return '[data-name="name"]'
    }

    getEnrollUsersPageTitle() {
        return '[data-name="header"]'
    }

    getExceedAvailableSeatsWarningTxt() {
        return '[aria-label="Notification"]'
    }

    getExceedAvailableSeatsWarningMsg() {
        return 'You will exceed the available seats of this session.'
    }

    getChooseBtn() {
        return '[data-name="submit"]'
    }

    getSearchTxtF() {
        return 'input[aria-label="Search"]';
    }

    getFirstSelectOpt() {
        return `[role='tree'] > [role='treeitem']:nth-child(1) [class*="_hierarchy_node"]`
    }

    /**
   * A function that searches and selects object in the Select modal.
   * If there are more than one objects in the array, then it goes through the loop to search, select,
   * and clear the search field until all objects have been selected. It clicks the Choose button at the end of the loop
   * @param arrayElements - Contains a single or a list of objects.
  */
    SearchAndSelectFunction(arrayElements) {
        cy.wrap(arrayElements).each((el) => {
            cy.get(this.getSearchTxtF()).clear().type(el);
            cy.wait(1000)
            cy.get(this.getFirstSelectOpt()).click();
        })
        cy.get(this.getChooseBtn()).contains('Choose').click();
    }

    /**
     * AA function that shows a window for adding a new report layout with the specified name.
     * @param {string} name - Name of the report layout to be created.
     */
    createNewReportLayout(name){
        cy.get(this.getElementByDataNameAttribute('create-full')).click()
        cy.get(this.getElementByAriaLabelAttribute('Nickname')).type(name)
        cy.get(this.getCreateLayoutModalSaveBtn()).click({ force: true })
    }

}