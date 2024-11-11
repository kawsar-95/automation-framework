import actionButtons from '../../../../cypress/fixtures/actionButtons.json'
import courses from '../../../../cypress/fixtures/courses.json'
import { departments } from '../../../../helpers/TestData/Department/departments'
import { default as arSelectModal } from '../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { addCompetenciesData, dashboardDetails, generatedReportsData, LoginsWidgetData } from '../../../TestData/Dashboard/dashboardDetails'
import { groupDetails } from "../../../../helpers/TestData/Groups/groupDetails.js"
import arBasePage from "../../ARBasePage"
import { courses as coursesTest } from '../../../TestData/Courses/courses'
import ARUserAddEditPage from '../User/ARUserAddEditPage'
import ARUnsavedChangesModal from '../Modals/ARUnsavedChangesModal'
import ARDeleteModal from '../Modals/ARDeleteModal'
import menuItems from '../../../../cypress/fixtures/menuItems.json'
import AREditClientUserPage from '../PortalSettings/AREditClientUserPage'

const FREQUENCY = 'frequency'
const RANGE = 'range'
const AVAILABILITY_RULE_ITEM = 'availability-rule-item'
const FLY_OUT_MENU = 'fly-out-menu'
const FLY_OUT_MENU_OPTION = 'fly-out-menu-option'
const WIDGET_TYPE = 'widgetType'
const WIDGET_LAYOUT = 'widget-layout'
const DISPLAY_OPTIONS = ['Line Graph', 'Summary', 'Vertical Bar Graph']
const CESBD_DISPLAY_OPTIONS = ['Horizontal Bar Graph', 'Horizontal Stacked Bar Graph', 'Vertical Bar Graph', 'Vertical Stacked Bar Graph']


const GROUPS = 'Groups'
let currentTime = new arBasePage().getTimeStamp()

const addloginWidgetData = {
    'lineGraph': {
        loginTitle: 'Logins Line Graph_' + currentTime,
        frequency: 'Hourly',
        range: 'Last 7 Days',
        userType: 'Is Learner',
        displayOption: 0
    },
    'summary': {
        loginTitle: 'Logins Summary_' + currentTime,
        frequency: 'Daily',
        range: 'Last 14 Days',
        userType: 'Is Learner',
        displayOption: 1
    },
    'verticalBarGraph': {
        loginTitle: 'Logins Vertical Bar Graph_' + currentTime,
        frequency: 'Monthly',
        range: 'Last 6 Months',
        userType: 'Is Learner',
        displayOption: 2
    }
}

const editloginWidgetData = {
    'lineGraph': {
        frequency: 'Daily',
        range: 'Last 14 Days'
    },
    'summary': {
        frequency: 'Monthly',
        range: 'Last 3 Months'
    },
    'verticalBarGraph': {
        frequency: 'Daily',
        range: 'Last 7 Days'
    }
}

const addCESByDepartmentWidgetData = {
    'horizontalBarGraph': {
        title: 'CESBD_Horizontal',
        subtitle: 'subtitle',
        rule: 'Mandatory Course',
        category: 'GUIA - Category - DO NOT DELETE',
        displayOption: 0
    },
    'horizontalStackedBarGraph': {
        title: 'CESBD_HorizontalStacked',
        subtitle: 'subtitle',
        rule: 'User Status',
        category: 'GUIA - Category - DO NOT DELETE',
        displayOption: 1
    },
    'verticalBarGraph': {
        title: 'CESBD_Vertical',
        subtitle: 'subtitle',
        rule: 'Type',
        category: 'GUIA - Category - DO NOT DELETE',
        displayOption: 2
    },
    'verticalStackedBarGraph': {
        title: 'CESBD_VerticalStacked',
        subtitle: 'subtitle',
        rule: 'Featured Course',
        category: 'GUIA - Category - DO NOT DELETE',
        displayOption: 3
    }
}

const editCESByDepartmentWidgetData = {
    'horizontalBarGraph': {
        enrollmentStatus: ['Absent', 'Not Complete']
    },
    'horizontalStackedBarGraph': {
        enrollmentStatus: ['Failed', 'Not Started']
    },
    'verticalBarGraph': {
        enrollmentStatus: ['Completed', 'Failed']
    },
    'verticalStackedBarGraph': {
        enrollmentStatus: ['In Progress', 'Not Started']
    }
}

const addCESByCourseWidgetData = {
    'horizontalBarGraph': {
        title: 'CESBC_Horizontal',
        subtitle: 'subtitle',
        course: [courses.OC_FILTER_01_NAME, courses.OC_FILTER_02_NAME, courses.OC_FILTER_03_NAME],
        displayOption: 0
    },
    'horizontalStackedBarGraph': {
        title: 'CESBC_HorizontalStacked',
        subtitle: 'subtitle',
        course: [courses.OC_LESSON_ACT_OVAS_NAME],
        displayOption: 1
    },
    'verticalBarGraph': {
        title: 'CESBC_Vertical',
        subtitle: 'subtitle',
        course: [courses.CURR_FILTER_01_NAME],
        displayOption: 2
    },
    'verticalStackedBarGraph': {
        title: 'CESBC_VerticalStacked',
        subtitle: 'subtitle',
        course: [courses.OC_02_ADMIN_APPROVAL_NAME],
        displayOption: 3
    }
}

export default new class ARDashboardPage extends arBasePage {

    //AR login page
    getARLoginBtn() {
        return '[class*="button-module__content"]'
    }

    //Top Nav Element
    // Use this text as value for data-name attribute to get this element
    getHelpAndSupportBtn() {
        return 'button-support'
    }
    // Use this text as value for data-name attribute to get this element  
    getMyMessagesBtn() {
        return 'button-message';
    }
    // Use this text as value for data-name attribute to get this element      
    getAccountBtn() {
        return 'button-account';
    }

    getBlatantAccountBtn() {
        return '[class*="menu-toggle account"]'
    }

    getCurrentUserLabel() {
        //return '[class*="main-header-module__current_user"]';
        return '[data-name="current_user"]'
    }

    getLearnerAndReviwerExperienceBtn() {
        return `[class="_button_link_xelcc_1 _button_zkujl_29"]`
    }

    /**
   * This method/function is used to get any of the menu items on the left hand side of the Admin LMS.
   * The method/function takes a string label exactly the way it is displayed on the front end and returns the selector for the menu option 
   * @param {String} text The desired menu option name.
   * Example: Use getARLeftMenuByLabel('Courses') to get the selector for the Courses menu option
   * Use this text/label as value for data-name attribute to get this element  
   */
    getARLeftMenuByLabel(text) {
        return `${text}`
    }

    getARLeftMenuByText(text) {
        return cy.get('[class*="main-menu-option-module__main_menu_option"]').filter(`:contains(${text})`);
    }

    getLeftMenuItem() {
        return '[class*="label"]'
    }

    getLeftMenuByName(name) {
        cy.get(this.getLeftMenuItem).contains(name).click()
    }

    getDeletePOPUPMsgTxt() {
        return "div[class='message has-icon']"
    }

    // Dasboard Elements 
    getSysAdminDashboardPageTitle() {
        return '[class*="default-system-admin-dashboard-module__title"]';
    }

    getSysAdminDashboardPageTitleTxt() {
        return 'Welcome to your LMS';
    }

    getAdminDashboardPageTitle() {
        return '[class*="_header_wrapper_141s0_1"]';
    }

    getAdminDashboardPageTitleTxt() {
        return 'Welcome to Your Dashboard';
    }

    getDashboardDDownF() {
        return `[data-name="select-field"]`
    }

    getSelectedDashboardLabel() {
        return `[data-name="select-field"]`
    }

    addDashboardTileBtn() {
        return '[class*=default-system-admin-dashboard-module__tile]:nth-of-type(1) [class*="button-module__content"]';
    }

    assignDashboardTileBtn() {
        return '[class*=default-system-admin-dashboard-module__tile]:nth-of-type(2) [class*="button-module__content"]';
    }

    manageDashboard() {
        return "Manage Dashboard";
    }

    getManageDashboardMenuItems() {
        return `[data-name="fly-out-menu-option-button"]`
    }

    addCourseBtn() {
        return "add-course";
    }

    addUserBtn() {
        return "add-user";
    }

    updateYourProfileBtn() {
        return "edit-current-user";
    }

    getSanitizedHtml() {
        return '[class="sanitized_html"]';
    }

    getBoldBtn() {
        return '[data-cmd="bold"]'
    }

    getSingleDatePickerInput() {
        return 'input[class*="DateInput_input"]';
    }

    getManageDashboardBtn() {
        return `button[data-name="fly-out-menu"]`
    }

    // ---------- Menu Items Methods ----------

    getMenuItem() {
        return '[data-name="link"] [data-name="title"]'
    }

    getTemplatesOption() {
        //return '[class*="main-menu-option-module__main_menu_option--lsz51"]'
        // return '[class*="main-menu-option-module__main_menu_option"]'
        return '[class*="_main_menu_options"]'
    }
    getaddnewTemplate() {
        return '[data-menu="Sidebar"]'
    }
    getSearchdeptfortemplate() {
        return '[id="DepartmentId"]'
        //return '[class="select"]'
    }
    getSearchinputfordept() {
        return '[type="text"][placeholder="Search"]'
    }
    getaddtemplatedeptoptions() {
        return '[class="options"]'
    }
    gettemplateAddbutton() {
        return '[class="has-icon btn success large"][data-menu="Sidebar"]'
    }
    getinheritsettingcheckbox() {
        //return '[class*="toggle-module__toggle___1ECOf inherit-settings-module__toggle___15cce inherit-settings__toggle"]'
        return '[class*="inherit-settings__toggle"]'
    }
    getUsersTab() {
        return '[data-tab-menu="Users"]'
    }
    getCustomFieldsTab() {
        return `a[data-tab-menu="CustomFields"]`
    }

    getLearnMoreUrlText() {
        return '[placeholder="Learn More URL"]'
    }

    getUserWarningMsgflag() {
        return '[id="UserWarningMessageEnabled"]'
    }

    getWarningMsgModal() {
        return '[class="user-warning-message-module__wrapper___ZqjFZ user-warning-message__wrapper"]';
    }

    getLangGlobeBtn() {
        return '[class="icon icon-globe"]'
    }

    getLanguageOption() {
        return '[type="button"]'
    }

    getWelcomeTile() {
        return '[class*="welcome-dashboard-tile-module__tile"]'
    }

    getNextgenLEflag() {
        return '[id="IsNextGenLearnerExperienceEnabled"]'
    }

    getNextgenLEtoggle() {
        return 'div/a[class="toggle"]'
    }
    getLearnerIdleTimeouttoggle() {
        return '[id="IsLearnerIdleTimeoutEnabled"]'
    }
    getLearnerIdleTimeoutTxtF() {
        return '[type="text"][name="LearnerIdleTimeoutMinutes"]'
    }
    getLearnerIdleTimeoutCodetoggle() {
        return '[id="IsIdleTimeoutVerificationEnabled"]'
    }

    /**
   * This method/function is used to get any of the menu items displayed under the Menu Option of the Admin LMS.
   * The method/function takes the name of the menu item to be selected from the list displayed 
   * @param {string} text The name of the desired menu item option on the list.
   * Ex1: Use getMenuItemOptionByName('Question Banks') to get the selector for Question Banks menu item from Courses Menu
   * Ex2: Use getMenuItemOptionByName('Department') to get the selector for Departments menu item from Users Menu
   * Ex3: Use getMenuItemOptionByName('Polls') to get the selector for Polls menu item from Engage Menu
   * Ex4: Use getMenuItemOptionByName'System Usage') to get the selector for System Usage menu item from Setup Menu
   * {force:true} is used in the click event so the test will not fail in firefox
   */
    getMenuItemOptionByName(text) {
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getMenuItem(), { timeout: 15000 }).should('be.visible')
        cy.get(this.getMenuItem()).contains(new RegExp("^" + text + "$", "g")).invoke('show').scrollIntoView().should('be.visible').click()
        /** 
        * This method is amended to make the title verification for both A5 pages and New generation pages. 
        * It makes an initial page check then if the page is an A5 page,it uses different element to verify page title.
        * The A5 pages have different element for page title.
        */
        cy.get("body").then($body => { 
            if ($body.find(this.getA5PageRoot()).length > 0) {   
                cy.get(this.getA5PageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', `${text}`)
            }
            else cy.get(this.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', `${text}`)
        })
        cy.get(this.getWaitSpinner()).should('not.exist')
    }


    getMenuHeaderTitleDataName() {
        return `title`;
    }

    // This method is used to navigate to the Courses report page from the side navigation menu bar.
    getCoursesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COURSES))
    }

    getUsersReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.USERS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.USERS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getDepartmentsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.USERS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.DEPARTMENTS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getGroupsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.USERS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.GROUPS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getAbsorbContentReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.ABSORB_CONTENT))
        cy.get(this.getWaitSpinner()).should('not.exist')

    }


    getCoursesActivityReport() {
        this.getMediumWait() 
        cy.get(this.getWaitSpinner()).should('not.exist',{timeout:5000})
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COURSE_ACTIVITY))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getUserEnrollmentsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist',{timeout:5000})
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.USERS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.USER_ENROLLMENTS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCourseEnrollmentReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COURSE_ENROLLMENTS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getBillboardsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ENGAGE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.BILLBOARDS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getGlobalResourcesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.GLOBAL_RESOURCES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

   
    getUserGroupReport(){
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.USERS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(GROUPS))
        cy.get(this.getWaitSpinner()).should('not.exist') 

    }

    getRolesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.USERS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.ROLES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCreditsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.CREDITS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCompetenciesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COMPETENCIES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCurriculaActivityReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.CURRICULA_ACTIVITY))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCompetenciesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COMPETENCIES))
        cy.get(this.getWaitSpinner(), {timeout:15000}).should('not.exist')
    }

    getQuestionBankReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.QUESTION_BANKS))
        cy.get(this.getWaitSpinner(), {timeout:15000}).should('not.exist')
    }

    getDepartmentsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.USERS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.DEPARTMENTS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCouponsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ECOMMERCE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COUPONS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getLeaderboardsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ENGAGE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.LEADERBOARDS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCollborationsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ENGAGE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COLLABORATIONS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getSetupMenu() {
        this.getMediumWait()
      cy.get(this.getWaitSpinner()).should('not.exist')
      cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.SETUP))).click()
      cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getTemplatesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.SETUP))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.TEMPLATES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCommentsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COMMENTS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getTransactionsReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ECOMMERCE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.TRANSACTIONS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getSavedReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.SETUP))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.SAVED_REPORTS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getEcommerceTransactionReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ECOMMERCE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.TRANSACTIONS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getECommerceTransactionDetailsReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ECOMMERCE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.TRANSACTION_DETAILS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getECommerceCouponsReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ECOMMERCE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COUPONS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getGeneratedReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.SETUP))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.GENERATED_REPORTS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getTagsReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.TAGS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getNewsArticlesReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.ENGAGE))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.NEWS_ARTICLES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getILCActivityReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.ILC_ACTIVITY))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    // This method is used to navigate to the Dashboards report page from the side navigation menu bar.
    getDashboardsReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.SETUP))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.DASHBOARDS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getVenuesReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.VENUES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCertificatesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.CERTIFICATES))
    }
    
    getILCSessionsReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.ILC_SESSIONS))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCourseSummaryReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.COURSE_SUMMARY))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getCertificatesReport() {
        this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.CERTIFICATES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getPortalSettingsMenu(){
         this.getMediumWait()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getElementByDataNameAttribute(this.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(this.getPortalSettingsBtn()).should('be.visible')
        cy.get(this.getPortalSettingsBtn()).should('be.visible').click()
        cy.get(this.getUsersTab()).should('be.visible')
        cy.get(this.getUsersTab()).click()
    }

    getMessageTemplateReport() {
        this.getMediumWait()
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.SETUP))).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.MESSAGE_TEMPLATES))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getExternalTrainingReport() {
        cy.get(this.getElementByAriaLabelAttribute(this.getARLeftMenuByLabel(menuItems.REPORTS)), {timeout: 3000}).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.getMenuItemOptionByName(menuItems.EXTERNAL_TRAINING))
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    filterDashboardsReportByTitle(title) {
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.AddFilter('Title', 'Starts With', title))
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getTableCellName(2), { timeout: 15000 }).contains(title).should('exist')
        cy.get(this.getGridTable()).eq(0).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    // This method is used to click on the report action button based on the passed action button name.
    // TODO : Could be moved to the Base Page if it is being used outside of the Dashboards project.
    reportItemAction(action) {
        cy.wrap(this.WaitForElementStateToChange(this.getActionBtnByTitle(action)))
        cy.get(this.getActionBtnByTitle(action)).should('have.text', action).click()
    }

    addDashboard(dashboardName, dashboardType) {
        // Add New Dashboard
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getAddEditMenuActionsByName(actionButtons.ADD_DASHBOARD)).click()
        cy.get(this.getModalTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Add Dashboard')

        // Select Dashboard Layout
        cy.get(this.getRadioBtn()).find('span').contains(dashboardType).click()
        cy.get(this.getSaveBtn()).should('have.text', actionButtons.NEXT).click()
        cy.get(this.getModalTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Manage Dashboard')

        // Activate New Dashboard
        this.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())

        // Enter Dashboard Name
        cy.get(this.getElementByAriaLabelAttribute('Name')).type(dashboardName)

        // Access Rules Section - Add Dashboard Assignment
        cy.get(this.getElementByDataName(actionButtons.SELECT_DEPARTMENTS_DATA_NAME)).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        cy.get(this.getManageDashboardDepartmentListName(), { timeout: 15000 }).scrollIntoView().should('be.visible').and('contain', departments.dept_top_name)
        cy.get(this.getElementByDataNameAttribute('dashboardAssignmentGroupIds')).within(() => {
            cy.get(this.getDDown()).click()
            cy.get(this.getElementByNameAttribute('dashboardAssignmentGroupIds')).type(groupDetails.automaticGroup)
            cy.get(this.getListItem()).contains(groupDetails.automaticGroup).click()
        })
        // Access Rules Section - Add Dashboard Editor
        cy.get(this.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(this.getPickerBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        cy.get(this.getManageDashboardDepartmentinputF(), { timeout: 15000 }).scrollIntoView().should('be.visible').and('have.value', departments.dept_top_name)
        // Save Changes to Dashboard
        cy.wrap(this.WaitForElementStateToChange(this.getSubmitBtn()))
        cy.get(this.getSubmitBtn()).click()

        // Wait so that the page can be redirected to the Dashboards Landing Page
        cy.get(this.getConfigureWidgetsDasboardTitle(), { timeout: 15000 }).should('be.visible').and('contain', dashboardDetails.dashboardName)
    }

    deleteDashboard(dashboardName) {
        this.getDashboardsReport()
        cy.get(this.getWaitSpinner()).should('not.exist')
        this.AddFilter('Title', 'Contains', dashboardName)
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getTableCellName(2), { timeout: 15000 }).contains(dashboardName).should('exist')
        cy.get(this.getGridTable()).eq(0).click()
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName(actionButtons.DELETE_DASHBOARD), 5000))
        cy.get(this.getAddEditMenuActionsByName(actionButtons.DELETE_DASHBOARD)).click()
        cy.get(ARUnsavedChangesModal.getPromptHeader(), { timeout: 15000 }).should('be.visible').and('contain', 'Delete Dashboard')
        cy.get(this.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()

        // Verify if the Dashboard was deleted
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getNoResultMsg()).should('have.text', "No results found.")
    }

    setUpDesiredDashboardbyName(dashboardName) {
        cy.get(this.getWaitSpinner()).should('not.exist')
        cy.get(this.getDashboardDDownF(), { timeout: 10000 }).should('be.visible')
        cy.get(this.getDashboardDDownF()).click()
        cy.get(this.getDashboardDDownOpt()).last().scrollIntoView()
        cy.get(this.getDashboardDDownOpt()).contains(dashboardName).click()
        cy.get(this.getSelectedDashboardLabel(), { timeout: 15000 }).should('be.visible').and('contain', dashboardName)
    }

    navigateWidgetConfiguration() {
        //Navigate to widget settings
        cy.get(this.getManageDashboardBtn(), { timeout: 10000 }).should('be.visible')
        cy.get(this.getManageDashboardBtn()).click()
        cy.get(this.getManageDashboardMenuItems()).contains(actionButtons.CONFIGURE_WIDGETS).click()
    }

    addWidget(widgetType, widgetIndex = 0) {
        // Select the Add Widget button in the Configure Dashboards Landing Page
        cy.get(this.getElementByDataName(WIDGET_LAYOUT)).eq(widgetIndex).find(this.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).click()

        // Select 'Logins' option from the dropdown selection and click Ok
        cy.get(this.getDDownField()).click()
        cy.get(this.getElementByDataName(WIDGET_TYPE)).find('span').contains(widgetType).click()
        cy.get(this.getSaveBtn()).should('have.text', actionButtons.OK).click()
    }

    addWidgetWithoutConfirmation(widgetType, widgetIndex = 0) {
        // Select the Add Widget button in the Configure Dashboards Landing Page
        cy.get(this.getElementByDataName(WIDGET_LAYOUT)).eq(widgetIndex).find(this.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).click()

        // Select 'Logins' option from the dropdown selection and click Ok
        cy.get(this.getDDownField()).click()
        cy.get(this.getElementByDataName(WIDGET_TYPE)).find('span').contains(widgetType).click()

    }

    editWidget(widgetIndex = 0) {
        // Edit the widget based on the passed index
        cy.get(this.getElementByDataName(FLY_OUT_MENU)).eq(widgetIndex).click()
        cy.get(this.getElementByDataName(FLY_OUT_MENU_OPTION)).contains(actionButtons.EDIT_WIDGET).click()
    }

    clearWidget(widgetIndex = 0) {
        // Edit the widget based on the passed index
        cy.get(this.getElementByDataName(FLY_OUT_MENU)).eq(widgetIndex).click()
        cy.get(this.getElementByDataName(FLY_OUT_MENU_OPTION)).contains(actionButtons.CLEAR_WIDGET).click()
        this.getConfirmModalBtnByText(actionButtons.CLEAR)
    }

    //---------------LOGIN WIDGET---------------//
    addLoginWidgetInfoForDashboard(loginWidgetType) {
        let widgetType = addloginWidgetData[loginWidgetType]

        // General Section - Enter Title for the Logins widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(widgetType.loginTitle)

        // Data Section - Select Frequency and Range Option
        cy.get(this.getElementByDataName(FREQUENCY)).find(this.getDDownField()).click()
        cy.get(this.getElementByDataName(FREQUENCY)).find('li').contains(widgetType.frequency).click()
        cy.get(this.getElementByDataName(RANGE)).find(this.getDDownField()).click()
        cy.get(this.getElementByDataName(RANGE)).find('li').contains(widgetType.range).click()

        // Data Section - Add and Refine Rule
        cy.get(this.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find(this.getDDownField()).eq(0).click()
        cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find('li').contains(widgetType.userType).click()
        cy.get(this.getElementByDataName(actionButtons.ADD_DATA_NAME)).click()
        cy.get(this.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()

        // Select Login Widget Type and Save Changes to Logins Widget
        cy.get(this.getRadioBtn()).find('span').contains(DISPLAY_OPTIONS[widgetType.displayOption]).click()
        cy.wrap(this.WaitForElementStateToChange(this.getSubmitBtn()))
        cy.get(this.getSubmitBtn()).click()
        this.getShortWait()
    }

    editLoginWidgetInfoForDashboard(loginWidgetType) {
        let widgetType = editloginWidgetData[loginWidgetType]

        // Modify Frequency and Range Option
        cy.get(this.getElementByDataName(FREQUENCY)).find(this.getDDownField()).click()
        cy.get(this.getElementByDataName(FREQUENCY)).find('li').contains(widgetType.frequency).click()
        cy.get(this.getElementByDataName(RANGE)).find(this.getDDownField()).click()
        cy.get(this.getElementByDataName(RANGE)).find('li').contains(widgetType.range).click()

        // Save Changes to Logins Widget
        cy.wrap(this.WaitForElementStateToChange(this.getSubmitBtn()))
        cy.get(this.getSubmitBtn()).click()
    }
    //---------------END OF LOGIN WIDGET---------------//

    //---------------COURSE ENROLLMENT STATUS BY DEPARTMENT WIDGET---------------//
    addCESByDepartmentWidgetInfoForDashboard(graphicType) {
        let widgetData = addCESByDepartmentWidgetData[graphicType]

        // General Section - Enter Title and Subtitle for the widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(widgetData.title)
        cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type(widgetData.subtitle)

        // Data Section - Add Departments and Filters
        cy.get(this.getElementByDataName(actionButtons.SELECT_DEPARTMENTS_DATA_NAME)).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        cy.get(this.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find(this.getDDownField()).eq(0).click()
        cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find('li').contains(widgetData.rule).click()
        cy.get(this.getElementByDataName(actionButtons.ADD_DATA_NAME)).click()
        cy.get(this.getPickerBtn()).click()
        arSelectModal.SearchAndSelectFunction([widgetData.category])

        // Select display and Save Changes
        cy.get(this.getRadioBtn()).find('span').contains(CESBD_DISPLAY_OPTIONS[widgetData.displayOption]).click()
        cy.wrap(this.WaitForElementStateToChange(this.getSubmitBtn()))
        cy.get(this.getSubmitBtn()).click()
        this.getShortWait()
    }

    editCESByDepartmentWidgetInfoForDashboard(graphicType) {
        let widgetData = editCESByDepartmentWidgetData[graphicType]

        // Modify Enrollment Status and Save Changes
        cy.get(this.getElementByDataName(actionButtons.CHECKBOX_GROUP_DATA_NAME)).find('span').contains(widgetData.enrollmentStatus[0]).click()
        cy.get(this.getElementByDataName(actionButtons.CHECKBOX_GROUP_DATA_NAME)).find('span').contains(widgetData.enrollmentStatus[1]).click()
        cy.wrap(this.WaitForElementStateToChange(this.getSubmitBtn()))
        cy.get(this.getSubmitBtn()).click()
    }
    //---------------END OF COURSE ENROLLMENT STATUS BY DEPARTMENT WIDGET---------------//

    //---------------COURSE ENROLLMENT STATUS BY COURSE WIDGET---------------//
    addCESByCourseWidgetInfoForDashboard(graphicType) {
        let widgetData = addCESByCourseWidgetData[graphicType]

        // General Section - Enter Title and Subtitle for the widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(widgetData.title)
        cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type(widgetData.subtitle)

        // Data Section - Add Courses and Filters
        cy.get(this.getElementByDataName(actionButtons.SELECT_COURSES_DATA_NAME)).click()
        arSelectModal.SearchAndSelectFunction(widgetData.course)
        cy.get(this.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(this.getPickerBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.Dept_C_name])

        // Select display and Save Changes
        cy.get(this.getRadioBtn()).find('span').contains(CESBD_DISPLAY_OPTIONS[widgetData.displayOption]).click()
        cy.wrap(this.WaitForElementStateToChange(this.getSubmitBtn()))
        cy.get(this.getSubmitBtn()).click()
        this.getLShortWait()
    }

    editCESByCourseWidgetInfoForDashboard(graphicType) {
        // Perform edits and Save Changes
        switch (graphicType) {
            case 'horizontalBarGraph':
                cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find(this.getDDownField()).eq(0).click()
                cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find('li').contains('Group').click()
                cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find(this.getDDownField()).eq(1).click()
                cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find(this.getFileInput()).eq(1).type('GUIA_GROUP')
                cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find(this.getDDownOpt()).contains('GUIA_GROUP').should('be.visible').click()
                break

            case 'horizontalStackedBarGraph':
                cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type('updated Subtitle')
                break

            case 'verticalBarGraph':
                cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find(this.getDDownField()).eq(0).click()
                cy.get(this.getElementByDataName(AVAILABILITY_RULE_ITEM)).find('li').contains('User Status').click()
                break

            case 'verticalStackedBarGraph':
                cy.get(this.getElementByDataName(actionButtons.CHECKBOX_GROUP_DATA_NAME)).find('span').contains('Absent').click()
                break
        }
        cy.wrap(this.WaitForElementStateToChange(this.getSubmitBtn()))
        cy.get(this.getSubmitBtn()).click()
        this.getLShortWait()
    }
    //---------------END OF COURSE ENROLLMENT STATUS BY DEPARTMENT WIDGET---------------//

    getDefaultsTab() {
        return '[data-tab-menu="Defaults"]'
    }

    getShowLeaderboardPointsInCourseDetailsToggleBtn() {
        return '#ShowLeaderboardPointsInCourseDetails'
    }


    //------------- CONFIGURE WIDGETS ------------------------------------------------//

    getMaxNumberOfWidgetsTitle() {
        return '[class*="_max_widget_message"]'
    }

    addRichTextWidgetWithDataFilled(widgetNumber = 0) {
        this.addWidget(dashboardDetails.richText, widgetNumber)
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.richTextTitle)
        cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.subTitle)
        cy.get(this.getElementByAriaLabelAttribute('Body')).clear().type(dashboardDetails.bodyText)
    }

    addCompetenciesWidgetWithDataFilled(widgetNumber = 0) {
        this.addWidget(dashboardDetails.widgetCompetency, widgetNumber)

        // General Section - Enter Title for the Competencies widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(addCompetenciesData.title)

        // Data Section - Select Competencies and Add Filters
        cy.get(this.getElementByDataName(actionButtons.SELECT_COMPETENCIES_DATA_NAME)).click()
        cy.wrap(arSelectModal.SearchAndSelectCompetencies([addCompetenciesData.competency1, addCompetenciesData.competency2]))
        cy.get(this.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(this.getElementByDataName(dashboardDetails.availability_rule_item)).find(this.getDDownField()).eq(0).click()
        cy.get(this.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(addCompetenciesData.filterTypeDD1).click()
        cy.get(this.getElementByDataName(dashboardDetails.availability_rule_item)).find(this.getDDownField()).eq(1).click()
        cy.get(this.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(addCompetenciesData.filterTypeDD2).click()
    }

    addGeneratedReportsWithDataFilled(widgetNumber = 0) {
        this.addWidget(dashboardDetails.generatedReports, widgetNumber)

        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(generatedReportsData.TITLE)
    }

    addLoginsWidgetWithDataFilled(widgetNumber = 0) {
        this.addWidget(dashboardDetails.logins, widgetNumber)

        // General Section - Enter Title for the Logins widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(LoginsWidgetData.TITLE)
        cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type(LoginsWidgetData.SUB_TITLE)

    }

    addMyActivitiesWidgetWithDataFilled(widgetNumber = 0) {
        this.addWidget(dashboardDetails.myActivity, widgetNumber)

        // General Section - Enter Title for the My Activity widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.myActivityWidgetName)
        cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.subTitle)

    }

    addCourseEnrollmentByCourseWidgetWithDataFilled(widgetNumber = 0) {
        this.addWidget(dashboardDetails.widgetCourse, widgetNumber)
        // General Section - Enter Title for the Course Enrollment Status by Courses widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.widgetCourseTitle)
        cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.subTitle)

        //Data Section - Select a course , Assert Enrollment Status
        cy.get(this.getElementByAriaLabelAttribute("Data")).within(() => {
            cy.get(this.getElementByDataNameAttribute('select-courses')).should('have.text', 'Add Courses').click()
            this.getShortWait()
        })
        //Selecting Courses
        arSelectModal.SearchAndSelectFunction([coursesTest.cb_filter_01_name])

    }

    addCourseEnrollmentByDeptWidgetWithDataFilled(widgetNumber = 0) {
        this.addWidget(dashboardDetails.widgetDepartment, widgetNumber)
        // General Section - Enter Title for the Course Enrollment Status by Courses widget
        cy.get(this.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.widgetDeptTitle)
        cy.get(this.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.subTitle)

        //Data Section - Select a course , Assert Enrollment Status
        cy.get(this.getElementByAriaLabelAttribute("Data")).within(() => {
            cy.get(this.getElementByDataNameAttribute('select-departments')).should('have.text', 'Add Departments').click()
            this.getShortWait()
        })
        //Selecting Courses
        arSelectModal.SearchAndSelectFunction([departments.Dept_F_name])

    }

    assertEnrollmentStatusCheckBox() {
        //Asserting Enrollment Status 
        cy.get(this.getElementByDataNameAttribute('showProgress')).children().should(($child) => {
            expect($child).to.contain('Not Started');
            expect($child).to.contain('In Progress');
            expect($child).to.contain('Completed');
            expect($child).to.contain('Failed');
            expect($child).to.contain('Absent');
            expect($child).to.contain('Not Complete');
        })
    }

    getAddWidgetModal() {
        return '[class*="_form_1xxm5_"]'
    }
    
    getConfigureWidgetsDasboardTitle() {
        return `[data-name="item"]:nth-of-type(2)`
    }

    getBackBtn() {
        return 'button[data-name="back"]'
    }

    getDialogueTitle() {
        return '[data-name="dialog-title"]'
    }

    getModalDescription() {
        return '[data-name="description"]';
    }

    getGeneralSection() {
        return '[data-name="general-section"]';
    }

    getAssaignmentSection() {
        return '[data-name="assignment-section"]'
    }

    getAssaignmentDescription() {
        return 'div[class*="_highlight_bbc1v_"] > [class*="_message_"]'
    }

    getDashboardEditorsSection() {
        return `[data-name="editors-section"]`
    }

    getDialogueModule() {
        return '[class*="dialog-module__focus_area--"]'
    }

    getListItem() {
        return 'ul > li'
    }

    assertRadioBtnLabelByIndex(label, index = 0) {
        cy.get(this.getRadioBtn()).eq(index).should('contain', label)
    }

    getLoginWidgetFrequencyDdown() {
        return '[data-name="frequency"] [data-name="field"]';
    }

    getLoginWidgetFrequencyDdownLabel() {
        return '[data-name="frequency"] [data-name="selection"] [data-name="label"]';
    }

    getLoginWidgetRangeDdown() {
        return '[data-name="range"] [data-name="field"]';
    }

    getLoginWidgetRangeDdownLabel() {
        return '[data-name="range"] [data-name="selection"] [data-name="label"]';
    }

    getAndClickSelectDashboardLayoutRadioBtnByLabel(label) {
        return cy.get(this.getRadioBtn()).find('span').contains(label).click()
    }

    getPortalSettingsBtn() {
        return `[title="Portal Settings"]`;
    }

    getWidgetTitle() {
        return `[data-name="wigdet-title"] [data-name="title"]`
    }

    getAddWidgetBtn() {
        return `[data-name="add-widget"][type="button"]`
    }


    // Added on the Nov Nov 04, 2022
    getConfigureWidgetsTitle() {
        return '[class*="_title"]'
    }

    getAddDepartmentsBtn() {
        return '[data-name="select-departments"] [class*="icon icon-plus"]'
    }

    getSelectDepartmentBtn() {
        return '[class*="_select_department_button"]'
    }
    deleteUsers(userNames = []) {
        let i = 0;
        this.getShortWait()
        this.getUsersReport()
        for (i = 0; i < userNames.length; i++) {
            this.AddFilter('Username', 'Contains', userNames[i])
        }
        cy.get(this.getElementByAriaLabelAttribute('Row Select Options')).click({ force: true })
        cy.get(this.getElementByDataNameAttribute('select-page')).click()
        cy.get(this.getDeleteUsersBtn() , {timeout:15000}).should('have.attr' , 'aria-disabled' , 'false')
        cy.get(this.getDeleteUsersBtn()).click()
        cy.get(this.getElementByDataNameAttribute('confirm')).click()
        cy.get(this.getToastSuccessMsg()).should('be.visible').and('contain','User has been deleted successfully.')
    }

    getDeleteUsersBtn() {
        return 'button[title*="Delete"]'
    }

    // Added for TC # C6318
    getFileChooserBtnContainer() {
        return 'div[data-name="control_wrapper"]'
    }

    getChooseFileBtn() {
        return 'button[data-name="select"]'
    }

    getFileInput() {
        return 'input[data-name="input"]'
    }

    getSaveBtn() {
        return '[data-name="submit"]'
    }

    getUserMenu() {
        return '[aria-label="Users"]'
    }

    getElementByRoleAttribute(attr) {
        return `[role="${attr}"]`
    }

    getDashboardDDownArrowBtn() {
        return '[class*="icon-arrows-up-down"]'
    }
//------------- CONFIGURE WIDGETS ------------------------------------------------//
//------------- MANAGE DASHBOARD MODALS ---------------------------//

    getManageDashboardDepartmentListName() {
        return `[data-name="departments"] [data-name="name"]`
    }

    getManageDashboardDepartmentinputF() {
        return `[data-name="department-input"]`
    }
    
    getA5RemoveAllFilterBtn() {
        return `a[title="Remove All"]`
    }

    getDashboardLink() {
        return '[aria-label="Dashboard"]'
    }

    getWidgetContainer() {
        return '[data-name="widget"]'
    }

    getSelectRowCheckbox() {
        return '[value="Select row"]'
    }
    
    // Added for the TC# C6843
    getGridTableColumnCourseName(name){
        return `tbody > tr > :nth-child(2):contains(${name})`
    }

    getMarkAttendanceClassBtn(){
        return '[data-name="mark-attendance-toggle"]'
    }

    getMarkAttendanceSaveBtn(){
        return 'button[data-name="submit"]'
    }

    getIlcReportProgress(){
        return '[data-name="enrollmentProgress"]'
    }

    getGeneralStatus(){
        return '[data-name="isActive"] [data-name="enable-label"]'
    }

    getA5DashboardBtn() {
        return `[class="absorb"]`
    }

    // Added for the JIRA# AUT-602 / TC# C2086
    getUserAccountBtn () {
        return '[data-name="button-account"]'
    }

    switchAdminRefreshToggle(turnOn = true) {
        // Navigate to portal settings menu  
        this.getPortalSettingsMenu()
        if (turnOn === true) {
            // Turn on Admin Refresh toggle button
            AREditClientUserPage.switchAdminRegreshToggle('true')
        } else if (turnOn === false) {
            // Turn off Admin Refresh toggle button
            AREditClientUserPage.switchAdminRegreshToggle('false')
        }
        // Save the settings
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        // Verify to page url for checking the settings get saved properly or not.
        cy.url().should('include', '/Admin/Clients')
    }

    getLearnerExperienceAccountMenu() {
        return this.getElementByDataNameAttribute('learner-experience')
    }
}

export const ManageDashboardArticles = {
    "Inactive_description": "Your dashboard will not be visible to assigned administrators if this is set to 'Inactive'",
    "Edit_description": 'System administrators who manage this department can edit this dashboard.',
    "Availability_description": 'This dashboard will be available to administrators in any of the selected groups or departments',
    "MAX_ALLOWED_DASHBOARD_WIDGETS": "A maximum of 10 Widgets can be added to a Dashboard"
}

