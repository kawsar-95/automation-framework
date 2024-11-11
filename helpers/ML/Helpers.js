import { users } from "../TestData/users/users";
import basePage from "../BasePage";
import arOCAddEditPage from "../AR/pageObjects/Courses/OC/AROCAddEditPage";
import arCBAddEditPage from "../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage";
import arReviewerMenu from "../AR/pageObjects/Menu/ARReviewer.menu";
import arCURRAddEditPage from "../AR/pageObjects/Courses/CURR/ARCURRAddEditPage";
import arSelectLearningObjectModal from "../AR/pageObjects/Modals/ARSelectLearningObjectModal";
import arUserPage from "../AR/pageObjects/User/ARUserPage";
import arAddSurveyLessonModal from "../AR/pageObjects/Modals/ARAddSurveyLessonModal";
import arEnrollUsersPage from "../AR/pageObjects/User/AREnrollUsersPage";
import arUserAddEditPage from "../AR/pageObjects/User/ARUserAddEditPage";
import arDeleteModal from "../AR/pageObjects/Modals/ARDeleteModal";
import arCoursesPage from "../AR/pageObjects/Courses/ARCoursesPage";
import LEDashboardPage from "../LE/pageObjects/Dashboard/LEDashboardPage";
import leDashboardAccountMenu from "../../helpers/LE/pageObjects/Menu/LEDashboardAccount.menu";
import arDashboardPage from "../AR/pageObjects/Dashboard/ARDashboardPage";
import LEFilterMenu from "../LE/pageObjects/Menu/LEFilterMenu";
import LESideMenu from "../LE/pageObjects/Menu/LESideMenu";
import { learnerDetails } from "../TestData/ML/learnerData";
import { courseDetails } from "../TestData/ML/courseData";
import arSelectModal from "../AR/pageObjects/Modals/ARSelectModal";
import { commonDetails } from "../TestData/Courses/commonDetails";
import { ocDetails } from "../../helpers/TestData/Courses/oc";
import { ilcDetails } from "../../helpers/TestData/Courses/ilc";
import { cbDetails } from "../../helpers/TestData/Courses/cb";
import { currDetails } from "../../helpers/TestData/Courses/curr";
import adminContextMenu from "../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../helpers/ML/mlPageObjects/adminReportCourse";
import adminUserMenu from "../../helpers/ML/mlPageObjects/adminUserMenu";
import MLEnvironments from "./MLEnvironments";

export default new (class MLHelpers extends basePage {
    WaitThenClick(element) {
        cy.wrap(this.WaitForElementStateToChange(element));
        cy.get(element).first().click();
    }

    WaitThenType(element, value) {
        cy.wrap(this.WaitForElementStateToChange(element));
        cy.get(element).click();
        cy.get(element).type(value);
    }

    WaitForElementStateToChange(element, intTimeout = 800) {
        //get the initial value of your object
        //intTimeout = 500
        cy.get(element)
            .invoke("attr", "aria-disabled")
            .then(($initialVal) => {
                //It's better if you can do your click operation here

                //Wait untill the element changes
                cy.get(element).then(($newVal) => {
                    cy.waitUntil(() => $newVal[0].value !== $initialVal, {
                        //optional timeouts and error messages
                        errorMsg: "was expeting some other Value but got : " + $initialVal,
                        timeout: 10000,
                        interval: 800,
                        //interval: 12000
                    }).then(() => {
                        cy.log("Found a difference in values");
                    });
                });
                cy.wait(intTimeout);
            });
    }

    SearchAndSelectFunction(arrayElements) {
        cy.wrap(arrayElements).each((el) => {
            cy.get('input[aria-label="Search"]').clear().type(el);
            cy.wait(1000);
            cy.get(`[role='tree'] > [role='treeitem']:nth-child(1) [class*="_hierarchy_node"]`).click();
        });
        cy.get(`[role=dialog]`).find(`[data-name="submit"]`).click();
    }

    createCourses() {
        cy.wait(2000);
        this.goToCoursesReport();
                // Create courses
        for (const course_key in courseDetails) {
            let course_info = courseDetails[course_key];
            this.createCourse(course_info["type"], course_info["name"]);
            if (course_info["type"] === "Online Course") {
                // TTC
                cy.get(`[data-name="section-button-catalogVisibility"]`).find(`button[title="Catalog Visibility"]`).click();
                arCURRAddEditPage.getLShortWait();
                cy.get(`[data-name=estimatedTimeToComplete]`).contains(course_info["ttc"]).click();
                // Add assessment
                cy.get(`[data-name=add_learning_object]`).should("have.attr", "aria-disabled", "false").click();
                cy.get(`[data-name=label]`).contains("Assessment").click();
                cy.get(arSelectLearningObjectModal.getNextBtn()).click();
                arAddSurveyLessonModal.getExpandQuestions();
                this.WaitThenClick(`[data-name="edit-questions"]`);
                this.WaitThenClick(`[data-name="add-question"]`);
                this.WaitThenType(`[aria-label="Question"]`, `Where is Absorb Software located?`);
                this.WaitThenType('[data-name="control_wrapper"] input[name="0"]', `Calgary`);
                this.WaitThenClick(`[class*="_assessment_question_modal"] [data-name="save"]`);
                this.getShortWait();
                this.WaitThenClick(`[data-name="assessment-questions"] [data-name="save"]:contains("Apply")`);
                this.getShortWait();
                this.WaitThenClick(`[class*="_assessment_modal"] [data-name="save"]`);
            } else if (course_info["type"] === "Curriculum") {
                let course_names = course_info["courses"].map((key) => courseDetails[key]["name"]);
                //Add courses to curriculum - verify multiple courses are added in the order they are selected
                console.log("course names:", course_names);
                this.SearchAndSelectFunction(course_names);
                arSelectModal.getMediumWait();
            } else if (course_info["type"] === "Course Bundle") {
                let course_names = course_info["courses"].map((key) => courseDetails[key]["name"]);
                // Add Courses to Course Bundle
                this.SearchAndSelectFunction(course_names);
            } else {
                console.log();
            }

            // Allow automatic enrollment
            this.WaitThenClick(`[data-name="section-button-enrollmentRules"] button[title="Enrollment Rules"]`);
            cy.get(`[data-name="enrollmentAvailabilityType"] [aria-label="Allow Self Enrollment"] [data-name=label]:contains("All Learners")`).click();

            //Publish course
            cy.publishCourseAndReturnId().then((id) => {
                commonDetails.courseID = id.request.url.slice(-36);
            });
            cy.clearLocalStorage();
        }
        // cy.editCourse(courseDetails["automatic"]["name"]);
    }

    createUsers() {
        this.goToUsersReport();
        cy.wait(2000);
        learnerDetails.map((userDetails) => {
            cy.get(`[data-name="create-user-context-button"]`).click({ force: true });
            cy.get(arUserAddEditPage.getFirstNameTxtF()).clear().type(userDetails.firstName);
            cy.get(arUserAddEditPage.getLastNameTxtF()).clear().type(userDetails.lastName);
            cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.username);
            cy.get(arUserAddEditPage.getPasswordTxtF()).clear().type(userDetails.validPassword);
            cy.get(arUserAddEditPage.getConfirmPasswordTxtF()).clear().type(userDetails.validPassword);
            cy.get(arUserAddEditPage.getDepartmentTxtF()).click();
            cy.get(`[class*="_hierarchy_node"]`, { timeout: 10000 }).contains(MLEnvironments.getParam("top_level_department")).click({ force: true });
            cy.get(`[role=dialog]`).find(`[data-name="submit"]`).click();
            cy.get(arUserAddEditPage.getAddressTxtF()).clear().type(userDetails.userAddress );
            cy.get(arUserAddEditPage.getCountryDDown()).click();
            cy.get(arUserAddEditPage.getCountryDDownSearchInputTxt()).type(userDetails.userCountry);
            cy.wait(2000);
            cy.get('[class*=_label_]').contains(userDetails.userCountry).click();
            // cy.get(arUserAddEditPage.getCountryDDownOpt()).contains(userDetails.userCountry).click();
            cy.wait(2000);
            cy.get(arUserAddEditPage.getStateProvinceDDown()).click();
            cy.get(arUserAddEditPage.getStateProvinceDDownSearchInputTxt()).type(userDetails.userStateProvince);
            cy.get('[class*=_label_]').contains(userDetails.userStateProvince).click();
            // cy.get(arUserAddEditPage.getStateProvinceDDownOpt()).contains(userDetails.userStateProvince).click();
            cy.get(arUserAddEditPage.getCityTxtF()).clear().type(userDetails.userCity);
            cy.get(arUserAddEditPage.getLocationTxtF()).clear().type(userDetails.userLocation);
            cy.wait(2000);
            // Save User
            this.WaitThenClick(arUserAddEditPage.getSaveBtn());
            cy.wait(6000);

        });
    }
    goToUsersReport() {
        // Go to courses report using the dashboard
        cy.wait(2000);
        cy.visit(MLEnvironments.getParam("urlAdmin"));
        cy.wait(2000);
        cy.get(`[aria-label="Users"][data-name="button"]`).click();
        cy.wait(2000);
        cy.get(`[id=users-report-menu-option]`).click();
        cy.wait(4000);
    }

    addFilter(filterby, text, report = "user") {
        cy.wait(1000);
        cy.get('button[aria-label="Add Filter"]:first-child').click();
        if (report === "course") {
            cy.get(`div[data-name=selection] [data-name=label]:contains("# of Ratings")`).click();
        } else if (report === "user") {
            cy.get(`div[data-name=selection] [data-name=label]`)
                .contains(/# of Groups|Address/g)
                .click();
        }
        cy.get(`span[class*=_label]:contains("${filterby}")`).click();
        cy.get("[aria-label=Value]").type(text);
        cy.get('[data-name="submit-filter"]').click();
    }
    deleteUsers() {
        this.goToUsersReport();
        cy.wait(2000);
        learnerDetails.map((userDetails) => {
            //Delete user
            cy.wrap(this.addFilter("Username", userDetails.username, "user"));
            cy.wait(2000);
            cy.get(`[role=gridcell]:contains(${userDetails.username})`).click();
            cy.wait(2000);
            cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName("Delete"), arEnrollUsersPage.getShortWait()));
            cy.wait(2000);
            cy.get(arUserPage.getAddEditMenuActionsByName("Delete")).click();
            cy.wait(2000);
            cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()));
            cy.wait(2000);
            cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click();
            cy.wait(2000);
            cy.get(arUserPage.getNoResultMsg()).contains("No results found.").should("exist");
            cy.clearLocalStorage();
        });
    }

    deleteCourses() {
        this.goToCoursesReport();
        for (const course_key in courseDetails) {
            let course_info = courseDetails[course_key];
            cy.wrap(this.addFilter("Name", course_info["name"], "course"));
            cy.wait(6000);
            cy.get(this.getFirstTableRow(2)).contains(course_info["name"]).click();
            cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName("Delete"), 1000));
            cy.get(arCoursesPage.getAddEditMenuActionsByName("Delete")).click();
            cy.get(`[data-name=delete-course-prompt] [data-name="confirm"]`).click();
            // cy.deleteCourse(commonDetails.courseID, 'curricula');
            cy.clearLocalStorage();
        }
    }

    deleteCourse(name) {
        cy.wrap(this.goToCoursesReport());
        cy.wrap(this.addFilter("Name", name, "course"));
        cy.wait(6000);
        cy.get(this.getFirstTableRow(2)).contains(name).click();
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName("Delete"), 1000));
        cy.get(arCoursesPage.getAddEditMenuActionsByName("Delete")).click();
        cy.get(`[data-name=delete-course-prompt] [data-name="confirm"]`).click();
        // cy.deleteCourse(commonDetails.courseID, 'curricula');
        cy.clearLocalStorage();
    }

    goToCoursesReport() {
        // Go to courses report using the dashboard
        cy.wait(500);
        cy.visit(MLEnvironments.getParam("urlAdmin"));
        cy.wait(500);
        cy.get(`[aria-label="Courses"][data-name="button"]`).should("exist");
        this.WaitThenClick(`[aria-label="Courses"][data-name="button"]`);
        cy.get(`[id=courses-report-menu-option] [data-name="icon"]`).click();
        this.getShortWait();
    }

    stopImpersonating() {
        cy.visit(MLEnvironments.getParam("urlLearner"));
        cy.get(LEDashboardPage.getNavMenu()).should("be.visible").click();
        cy.get(LEDashboardPage.getMenuItems()).find("button").contains("Stop Impersonating").click();
    }

    getMenuItemOptionByName(text) {
        cy.get('[aria-labelledby="main-menu-options-title"]').contains(text).click();
    }

    getLearnerByUsername(learner_username) {
        cy.get(`[id="users-menu-group"]`).click();
        cy.get(`[id="users-report-menu-option"]`).should("have.text", "Users").click();
        // cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel("Users"))).click();
        cy.wait(500);
        // cy.wrap(this.getMenuItemOptionByName("Users"));
        cy.wait(500);
        cy.wrap(this.addFilter("Username", learner_username, "user"));
    }
    getFirstTableRow(index) {
        return `[class*="_grid_row"]:first() td:nth-of-type(${index})`;
    }
    impersonateLearner(learner_detail) {
        // Click on learner
        this.getLearnerByUsername(learner_detail.username);
        cy.wait(4000);
        cy.get(this.getFirstTableRow(4)).contains(learner_detail.username).click();
        //Verify learner can be impersonated
        cy.wait(500);
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName("Impersonate"), 1000));
        cy.wait(500);
        cy.get(arDashboardPage.getAddEditMenuActionsByName("Impersonate")).click();

        //Verify admin is directed to LE and is impersonating learner
        cy.url().should("not.contain", "/Admin");
    }
    learnerLogout() {
        cy.visit(MLEnvironments.getParam("urlLearner"));
        cy.get(LEDashboardPage.getNavMenu()).click();
        cy.get(leDashboardAccountMenu.logoutMenuItemBtn).click();
        LEDashboardPage.getLShortWait(); //wait for logout to complete
    }

    learnerLoginThruDashboardPage(username, password) {
        cy.visit(MLEnvironments.getParam("urlLearner"));
        // cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click();
        cy.get(LEDashboardPage.getUsernameTxtF()).type(username);
        cy.get(LEDashboardPage.getPasswordTxtF()).type(password);
        cy.get(LEDashboardPage.getLoginBtn()).click();
        cy.get(LEDashboardPage.getDashboardPageTitle(), { timeout: 60000 }).contains("Welcome");
    }
    learnerLoginThruDashboardPageFirstTime(username, password) {
        cy.visit(MLEnvironments.getParam("urlLearner"));
        // cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).click();
        cy.get(LEDashboardPage.getUsernameTxtF()).type(username);
        cy.wait(3000);
        cy.get(LEDashboardPage.getPasswordTxtF()).type(password);
        cy.wait(3000);
        //For 5.115
        // cy.get(LEDashboardPage.getLoginBtn()).click();
        //For 5.116
        cy.get(`[class*="login-form-module__btn"]`).click();


        // if (MLEnvironments.env == "comProd") {
        //     // Reset Password
        //     cy.wait(2000);
        //     cy.get(`[class*="reset-password"]`).get(LEDashboardPage.getPasswordTxtF()).type(password);
        //     cy.wait(2000);
        //     cy.get(`[name="confirmPassword"]`).type(password);
        //     cy.wait(2000);
        //     cy.get(`button[class*="reset-password"]`).click();
        //     cy.wait(2000);
        //     cy.get(`button[class*="reset-password"]`).click();
        //     cy.wait(2000);
        //     cy.get(LEDashboardPage.getUsernameTxtF()).type(username);
        //     cy.get(LEDashboardPage.getPasswordTxtF()).type(password);
        //     cy.get(LEDashboardPage.getLoginBtn()).click();
        //     // Enter PIN
        //     cy.get(`[name="pin"]`).type("1234");
        //     cy.get(`button[aria-label="OK"]`).click();
        //     // Go back to dashboard
        //     cy.visit(MLEnvironments.getParam("urlLearner"));
        // }
        // cy.get(LEDashboardPage.getDashboardPageTitle(), { timeout: 60000 }).contains("Welcome");
        cy.wait(7000);

    }

    searchCourseByName(name) {
        cy.get(LEDashboardPage.getNavMenu()).click();
        LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
        cy.get(LEFilterMenu.getFilterBtn()).click();
        LEFilterMenu.SearchForCourseByName(name);
        LEDashboardPage.getLongWait();
    }

    editCourse(courseName) {
        cy.wrap(this.addFilter("Name", courseName, "course"));
        //At some point this intercept stopped logging and caused this command to break. It seems to work without it.
        //cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourseFilter').wait('@getCourseFilter')
        this.getShortWait();
        cy.get(this.getFirstTableRow(2)).contains(courseName).click();
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName("Edit"), 1000));
        cy.get(arCoursesPage.getAddEditMenuActionsByName("Edit")).click();
        //cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourseEdit').wait('@getCourseEdit')
        cy.get(`button[title="Catalog Visibility"]`).should("be.visible");
        this.getMediumWait();
    }

    getToggleDisabled() {
        return this.getElementByDataNameAttribute("disable-label");
    }

    getToggleEnabled() {
        return this.getElementByDataNameAttribute("hidden-enable-label");
    }

    createCourse(courseType, courseName, ilcSession = true) {
        let courseTypeMod = new basePage().capitalizeString(courseType);
        let name;

        if (courseName != undefined) {
            name = courseName;
        } else {
            switch (courseTypeMod) {
                case "Online Course":
                    name = ocDetails.courseName;
                    break;
                case "Instructor Led":
                    name = ilcDetails.courseName;
                    break;
                case "Course Bundle":
                    name = cbDetails.courseName;
                    break;
                case "Curriculum":
                    name = currDetails.courseName;
                    break;
                default:
                    console.log(`Sorry, ${courseTypeMod} type does not exist.`);
            }
        }

        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel(`Add ${courseTypeMod}`))
            .should("have.text", `Add ${courseTypeMod}`)
            .click();
            cy.wait(7000);

        //verify the header and InActive toggle
        if (courseTypeMod == "Online Course") {
            cy.get(this.getElementByDataNameAttribute("edit-online-course-general-section") + " " + this.getElementByDataNameAttribute("header")).should("have.text", "General");
            cy.get(this.getElementByDataNameAttribute("course-status") + " " + this.getToggleDisabled()).should("have.text", "Inactive");
        }
        //Verify the Status Toggle button and text box text
        cy.get(this.getElementByDataNameAttribute("course-status") + " " + this.getToggleDisabled()).should("have.text", "Inactive");
        cy.get(this.getElementByDataNameAttribute("course-status") + " " + this.getToggleDisabled()).click();
        cy.get(this.getElementByDataNameAttribute("course-status") + " " + this.getToggleEnabled()).should("have.text", "Active");
        arCoursesPage.getLShortWait(); //wait as the title field can reset if we type too fast

        switch (courseTypeMod) {
            case "Online Course":
                // Add Course name
                //cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear().type(name)
                cy.get(arOCAddEditPage.getRequiredInRedColor()).should("have.css", "background-color", "rgba(0, 0, 0, 0)");
                cy.get(arOCAddEditPage.getGeneralTitleTxtF()).should("have.value", "Course Name");
                cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear();
                cy.get(arOCAddEditPage.getErrorMsg()).should("contain", "Field is required.");
                cy.get(arOCAddEditPage.getGeneralTitleTxtF()).invoke("val", name.slice(0, -1)).type(name.slice(-1));
                break;
            case "Instructor Led":
                //Add title, description, language
                //cy.get(arILCAddEditPage.getGeneralTitleTxtF()).clear().type(name)
                cy.get(arILCAddEditPage.getGeneralTitleTxtF()).invoke("val", name.slice(0, -1)).type(name.slice(-1));
                if (ilcSession === true) {
                    // Add Session to ILC with start date 2 days into the future
                    arILCAddEditPage.getAddSession(ilcDetails.sessionName, arILCAddEditPage.getFutureDate(2));
                    cy.get(arILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`);
                    // Save Session
                    cy.get(arILCAddEditPage.getAddEditSessionSaveBtn()).click();
                }
                break;
            case "Course Bundle":
                //Add title, description, language
                //cy.get(arCBAddEditPage.getGeneralTitleTxtF()).clear().type(name)
                cy.get(arCBAddEditPage.getGeneralTitleTxtF()).invoke("val", name.slice(0, -1)).type(name.slice(-1));
                // Add Courses to Course Bundle
                cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click();
                break;
            case "Curriculum":
                arCURRAddEditPage.WaitForElementStateToChange(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF()));
                //cy.get(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF())).clear().type(name)
                cy.get(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF())).invoke("val", name.slice(0, -1)).type(name.slice(-1));
                // Add Courses to Curriculum
                cy.get(arCURRAddEditPage.getAddCoursesBtn()).should("have.attr", "aria-disabled", "false").click();
                break;
            default:
                console.log(`Sorry, ${courseTypeMod} type does not exist.`);
        }
    }

    checkAutomaticTaggingEnabled() {
        cy.get(adminReportCourse.toggleAutomaticTagging()).contains("Automatic Tagging").should("exist");
        cy.get(adminReportCourse.toggleAutomaticTagging()).contains("Automatically generate tags based on course content. These tags are marked with an asterisk").should("exist");
        //This is a check for ON toggle by default in 5.113
        // cy.get(adminReportCourse.toggleAutomaticTagging() + ' ' + `[class*="toggle-module__enabled"]` ).should('exist');
        //This is a check for ON toggle by default in 5.114
        cy.get(adminReportCourse.toggleAutomaticTagging() + " " + `[aria-checked="true"]`).should("exist");
        cy.get(adminContextMenu.btnCancel()).should("have.text", "Cancel").click();
        cy.wait(2000);
    }

    checkAutomaticTaggingDisabled() {
        cy.contains(adminReportCourse.toggleAutomaticTagging()).should("not.exist");
        cy.get(adminContextMenu.btnCancel()).should("have.text", "Cancel").click();
        cy.wait(3000);
    }

    toggleEnableAutotagging() {
        cy.get(adminUserMenu.userAccount()).click();
        cy.wait(5000);
        cy.get(adminUserMenu.portalSettings()).click();
        cy.wait(5000);
        cy.get(adminUserMenu.autoTaggingEnabled()).click();
        cy.wait(2000);
        cy.get(adminUserMenu.btnPortalSettingsSave()).click();
    }
})();
