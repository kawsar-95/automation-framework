// TestRail TC reference: Course Thumbnail Suggestions:  https://absorblms.testrail.io//index.php?/cases/view/3000

/// <reference types="cypress" />
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";

const menuGroupCourse = `[id="courses-menu-group"]`;
const menuGroupUsers = `[id="users-menu-group"]`;
const menuGroupEngage = `[id="engage-menu-group"]`;
const menuGroupReports = `[id="reports-menu-group"]`;
const menuGroupSetup = `[id="setup-menu-group"]`;

const mlReportFilterLoc = `[data-name="data-filters"]`;
const reportsTag = `[id="tags-report-menu-option"]`;
const reportsCourse = `[id="courses-report-menu-option"]`;
const reportsCourseManageCategories = `[data-name="manage-categories-context-button"][title="Manage Categories"]`;
const reportsCourseEnrollments = `[id="course-enrollments-report-menu-option"]`;
const reportsCourseVenues = `[id="venues-report-menu-option"]`;
const reportsUsers = `[id="users-report-menu-option"]`;
const reportsRoles = `[id="roles-report-menu-option"]`;
const reportsDepartments = `[id="departments-report-menu-option"]`;
const reportGroups = `[id="groups-report-menu-option"]`;
const reportBillboards = `[id="billboards-report-menu-option"]`;
const reportLearnerActivity = `[id="learner-activities-report-menu-option"]`;
const reportLearnerProgress = `[id="learner-progress-report-menu-option"]`;
const reportCourseActivity = `[id="online-course-activities-report-menu-option"]`;
const reportCurriculaActivity = `[id="curriculum-activities-report-menu-option"]`;
const reportGeneratedReports = `[id="generated-reports-report-menu-option"]`;
const reportMessageTemplates = `[id="message-templates-report-menu-option"]`;
const reportDashboards = `[id="dashboards-report-menu-option"]`;

describe("Filter Suggestions", function () {
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
  
    
    it("Smaller portal: Ensure the Filtered Suggestions do not display for Courses", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");

        cy.get(menuGroupCourse).click();
        cy.get(reportsCourse).should("have.text", "Courses").click();

        //Confirm no filter suggestions are displaying for: Courses
        cy.get(mlReportFilterLoc).should("have.text", "Filter & Refine");
        cy.get(mlReportFilterLoc).should("not.have.text", "ID EqualsName ContainsStatus Equals");
        cy.wait(5000);

        //Navigate to Courses > Manage Catagories
        cy.get(reportsCourseManageCategories).click();
        //Confirm no filter suggestions are displaying for: Manage Catagories
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter");
        cy.get(mlReportFilterLoc).should("not.have.text", "ID EqualsName Contain");

        //Navigate to Courses > Course Enrollments
        cy.get(menuGroupCourse).click();
        cy.wait(1000);
        cy.get(reportsCourseEnrollments).should("have.text", "Course Enrollments").click();
        cy.wait(2000);
        cy.get(`[data-name="selection"][class*="_selection"]`).should("have.text", "Choose").click();
        cy.contains(`[class*="_select_option"]`, "001 - OC").should("be.visible").click();
        cy.get(`[data-name="submit-filter"]`).should("have.text", "Add Filter").click();

        //Confirm no filter suggestions for: Course Enrollments
        cy.get(mlReportFilterLoc).should("not.have.text", "Is Enrolled EqualsYes");
        cy.get(mlReportFilterLoc).should("not.have.text", "Last Name Contains");
        //Note: Different filter suggestions may display based on the usage behaviours
        cy.get(mlReportFilterLoc).should("not.contain", /Department Equals|First Name Contains/);
        cy.wait(5000);

        //Confirm filter suggestions for: Tags
        cy.get(menuGroupCourse).click();
        cy.get(reportsTag).should("have.text", "Tags").click();
        cy.wait(5000);
        //Confirm no filter suggestions for: Tags
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter");
        cy.get(mlReportFilterLoc).should("not.have.text", "ID EqualsName Contains");

        //Confirm filter suggestions for: Venues
        cy.get(menuGroupCourse).click();
        cy.wait(1000);
        cy.get(reportsCourseVenues).should("have.text", "Venues").click();
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter");
        cy.get(mlReportFilterLoc).should("not.have.text", "Type EqualsType EqualsType Equals");
    });

    it("Smaller portal: Ensure the Filtered Suggestions do not display for Users", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");

        cy.get(menuGroupUsers).click();
        cy.get(reportsUsers).should("have.text", "Users").click();

        // Confirm no filter suggestions for: Users
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter").click();
        cy.get(mlReportFilterLoc).should("not.have.text", "ID EqualsStatus EqualsFull Name Contains");

        //Confirm no filter suggestions for: Roles
        cy.get(menuGroupUsers).click();
        cy.get(reportsRoles).should("have.text", "Roles").click();

        cy.get(mlReportFilterLoc).should("have.text", "Add Filter").click();
        cy.get(mlReportFilterLoc).should("not.have.text", "Name EqualsID EqualsName Does Not Equal");

        //Confirm no filter suggestions for: Departments
        cy.get(menuGroupUsers).click();
        cy.get(reportsDepartments).should("have.text", "Departments").click();
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter").click();
        cy.get(mlReportFilterLoc).should("not.have.text", "ID EqualsName Contains");

        //Confirm no filter suggestions for: Groups
        cy.get(menuGroupUsers).click();
        cy.get(reportGroups).should("have.text", "Groups").click();
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter").click();
        cy.get(mlReportFilterLoc).should("not.have.text", "ID EqualsName ContainsName Starts With");
    });

    it("Smaller portal: Ensure the Filtered Suggestions do not display for Engage", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");

        cy.get(menuGroupEngage).click();
        cy.get(reportBillboards).should("have.text", "Billboards").click();

        // Confirm no filter suggestions for: Billboards
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter").click();
        cy.get(mlReportFilterLoc).should("not.have.text", "Is Published EqualsYesTitle ContainsIs Published EqualsYesTitle Contains");
    });

    it("Smaller portal: Ensure the Filtered Suggestions do not display for Reports", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");

        cy.get(menuGroupReports).click();
        cy.get(reportLearnerActivity).should("have.text", "Learner Activity").click();

        // Confirm no filter suggestions for: Learner Activity
        cy.get(`[data-name="filter-message"]`).should("have.text", "Filter & Refine");
        cy.get(mlReportFilterLoc).should("not.have.text", "Status EqualsLast Name ContainsDepartment Equals");

        //Confirm filter suggestions for: Learner Progress
        //Select learner activity report from right menu
        cy.get(menuGroupReports).click();
        cy.get(reportLearnerProgress).should("have.text", "Learner Progress").click();

        // Confirm no filter suggestions for: Learner Progress
        cy.get(`[data-name="filter-message"]`).should("have.text", "Filter & Refine");
        cy.get(mlReportFilterLoc).should("not.have.text", "Department Department EqualsJob Title Contains");

        //  Confirm filter suggestions for: Course Activity
        // Select learner activity report from right menu
        cy.get(menuGroupReports).click();
        cy.get(reportCourseActivity).should("have.text", "Course Activity").click();
        cy.wait(1000);
        cy.get(`[class="select_field__content"]`).should("have.text", "Choose").click();
        cy.contains(`[class*="select_option"]`, "001 - OC").should("be.visible").click();
        cy.get(`[data-name="submit-filter"]`).should("have.text", "Add Filter").click();
        cy.wait(1000);

        // Confirm no filter suggestions for: Course Activity
        cy.get(mlReportFilterLoc).should("not.have.text", "Add Filter");
        cy.get(mlReportFilterLoc).should("not.have.text", "Course EqualsDate Completed EqualsDate Completed Before");

        //Confirm filter suggestions for: Curricula Activity
        //Select learner activity report from right menu
        cy.get(menuGroupReports).click();
        cy.get(reportCurriculaActivity).should("have.text", "Curricula Activity").click();
        cy.wait(1000);
        cy.get(`[data-name="selection"][class*="_selection"]`).should("have.text", "Choose").click();
        cy.wait(2000);
        cy.contains(`[class*="_select_option"]`, "005").should("be.visible").click();
        cy.wait(1000);
        cy.get(`[data-name="submit-filter"]`).should("have.text", "Add Filter").click();
        cy.wait(1000);

        // Confirm no filter suggestions for: Curricula
        cy.get(mlReportFilterLoc).should("not.have.text", "Course EqualsDate Enrolled AfterDate Enrolled BeforeEmail Address Contains");
    });

    it("Smaller portal: Ensure the Filtered Suggestions do not display for Setup", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");

        //Navigate to Generated Report
        cy.get(menuGroupSetup).click();
        cy.get(reportGeneratedReports).should("have.text", "Generated Reports").click();
        cy.wait(3000);

        // Confirm filter suggestions for: GeneratedReports
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter");
        cy.get(mlReportFilterLoc).should("not.have.text", "Nickname Contains");

        //Navigate to Message Templates
        cy.get(menuGroupSetup).click();
        cy.get(reportMessageTemplates).should("have.text", "Message Templates").click();

        //Confirm filter suggestions for: MessageTemplates
        cy.get(mlReportFilterLoc).should("have.text", "Type EqualsNewUserLanguage EqualsenCustom EqualsYes");

        //Navigate to Dashboards
        cy.get(menuGroupSetup).click();
        cy.get(reportDashboards).should("have.text", "Dashboards").click();

        //Confirm filter suggestions for: Dashboards
        cy.get(mlReportFilterLoc).should("have.text", "Add Filter");
        cy.get(mlReportFilterLoc).should("not.have.text", "ID Equals");
    });

    // // =================================================================================================

    it("On a more populated environment: Confirm Filtered Suggestions for Courses", function () {
        //Go to Website
        MLEnvironments.signInAdmin("kslqamain");

        cy.get(menuGroupCourse).click();
        cy.get(reportsCourse).should("have.text", "Courses").click();
        cy.wait(1000);

        // Confirm filter suggestions for: Courses
        cy.get(mlReportFilterLoc).should("have.text", "ID EqualsName ContainsStatus EqualsActive");

        //Confirm filter suggestions for: Course Categories
        cy.get(reportsCourseManageCategories).click();
        cy.wait(1000);
        cy.get(mlReportFilterLoc).should("have.text", "ID EqualsName Contains");

        //Confirm filter suggestions for: Course Enrollments
        cy.get(menuGroupCourse).click();
        cy.get(reportsCourseEnrollments).should("have.text", "Course Enrollments").click();
        cy.wait(1000);
        cy.get(`[data-name="selection"][class*="_selection"]`).should("have.text", "Choose").click();
        cy.get(`[data-name="list-content"]`).type("zzzksl");
        cy.wait(1000);
        cy.contains(`[class*="_select_option"]`, "zzzksl").should("be.visible").click();
        cy.get(`[data-name="submit-filter"]`).should("have.text", "Add Filter").click();

        // Confirm filter suggestions for: Course Enrollments
        cy.get(mlReportFilterLoc).contains("Course Equals").should("be.visible");
        //Note: Different filter suggestions may display based on the usage behaviours
        cy.get(mlReportFilterLoc).contains(/Department Equals|First Name Contains|Last Name Contains/);

        // Confirm filter suggestions for: Tags
        cy.get(menuGroupCourse).click();
        // cy.wrap(arDashboardPage.getMenuItemOptionByName('Tags'));
        cy.get(reportsTag).should("have.text", "Tags").click();
        cy.wait(1000);
        cy.get(mlReportFilterLoc).should("have.text", "ID EqualsName Contains");

        // //Confirm filter suggestions for: Venues
        cy.get(menuGroupCourse).click();
        cy.get(reportsCourseVenues).should("have.text", "Venues").click();
        cy.wait(1000);
        cy.get(mlReportFilterLoc).should("have.text", "Type EqualsClassroomType EqualsConnectProType EqualsGoToMeeting");
    });

    it("On a more populated environment:  Confirm Filtered Suggestions for Users", function () {
        //Go to Website for QA Main
        MLEnvironments.signInAdmin("kslqamain");
        cy.wait(5000);
        cy.get(menuGroupUsers).click();
        cy.get(reportsUsers).should("have.text", "Users").click();
        cy.wait(1000);

        //Confirm filter suggestions for: Users
        cy.get(mlReportFilterLoc).should("have.text", "ID EqualsStatus EqualsActiveFull Name Contains");

        //Confirm filter suggestions for: Roles
        cy.get(menuGroupUsers).click();
        cy.get(reportsRoles).should("have.text", "Roles").click();
        cy.get(mlReportFilterLoc).should("have.text", "Name EqualsID EqualsName Does Not Equal");

        //Confirm filter suggestions for: Departments
        cy.get(menuGroupUsers).click();
        cy.get(reportsDepartments).should("have.text", "Departments").click();
        cy.get(mlReportFilterLoc).should("have.text", "ID EqualsName Contains");
        cy.wait(1000);

        //Confirm filter suggestions for: Groups
        cy.get(menuGroupUsers).click();
        cy.get(reportGroups).should("have.text", "Groups").click();
        cy.get(mlReportFilterLoc).should("have.text", "ID EqualsName ContainsName Starts With");
        cy.wait(1000);
    });

    it("On a more populated environment: Confirm Filtered Suggestions for Engage", function () {
        //Go to Website for QA Main
        MLEnvironments.signInAdmin("kslqamain");
        cy.wait(5000);

        cy.get(menuGroupEngage).click();
        cy.get(reportBillboards).should("have.text", "Billboards").click();
        cy.wait(1000);

        // Confirm filter suggestions for: Billboards
        cy.get(mlReportFilterLoc).should("have.text", "Is Published EqualsYesTitle Contains");
    });

    it("On a more populated environment:: Confirm Filtered Suggestions for Reports", function () {
        //Go to Website for QA Main
        MLEnvironments.signInAdmin("kslqamain");
        cy.wait(5000);

        cy.get(menuGroupReports).click();
        cy.get(reportLearnerActivity).should("have.text", "Learner Activity").click();
        cy.wait(1000);

        // Confirm filter suggestions for: Learner Activity
        cy.get(mlReportFilterLoc).should("have.text", "Status EqualsActiveLast Name ContainsDepartment Equals");
        cy.wait(1000);

        //Confirm filter suggestions for: Learner Progress
        //Select learner activity report from right menu
        cy.get(menuGroupReports).click();
        cy.get(reportLearnerProgress).should("have.text", "Learner Progress").click();
        cy.wait(5000);

        // Confirm filter suggestions for: Learner Progress
        cy.get(mlReportFilterLoc).should("have.text", "Department Department EqualsJob Title Contains");

        //Confirm filter suggestions for: Course Activity
        //Select learner activity report from right menu
        cy.get(menuGroupReports).click();
        cy.get(reportCourseActivity).should("have.text", "Course Activity").click();
        cy.wait(1000);
        cy.get(`[class="select_field__content"]`).should("have.text", "Choose").click();
        cy.wait(2000);
        cy.get(`[data-name="select-search-input"]`).type("zzzksl");
        cy.wait(4000);
        cy.contains(`[class*="select_option"]`, "zzzksl").should("be.visible").click();
        cy.wait(3000);
        cy.get(`[data-name="submit-filter"]`).should("have.text", "Add Filter").click();


        // Confirm filter suggestions for: Course Activity
        cy.get(mlReportFilterLoc).contains("Course Equals").should("be.visible");
        cy.get(mlReportFilterLoc).contains(/Date Completed|Equals|Before|After|Country Contains|User Status Equals/);

        //Confirm filter suggestions for: Curricula Activity
        //Select learner activity report from right menu
        cy.get(menuGroupReports).click();
        cy.get(reportCurriculaActivity).should("have.text", "Curricula Activity").click();
        cy.wait(1000);

        cy.get(`[data-name="selection"][class*="_selection"]`).should("have.text", "Choose").click();
        cy.get(`[data-name="list-content"]`).type("zzz-ML-C");
        cy.contains(`[class*="_select_option"]`, "zzz-ML-C").should("be.visible").click();
        cy.get(`[data-name="submit-filter"]`).should("have.text", "Add Filter").click();
        cy.wait(1000);

        // Confirm filter suggestions for: Curricula
        cy.get(mlReportFilterLoc).contains("Course Equals").should("be.visible");
        cy.get(mlReportFilterLoc).contains("Date Enrolled After").should("be.visible");
        cy.get(mlReportFilterLoc).contains("Date Enrolled Before").should("be.visible");
        cy.get(mlReportFilterLoc).contains("Email Address Contains").should("be.visible");
    });

    it("On a more populated environment:: Confirm Filtered Suggestions for Setup", function () {
        //Go to Website for QA Main
        MLEnvironments.signInAdmin("kslqamain");
        cy.wait(5000);

        //Navigate to Generated Report
        cy.get(menuGroupSetup).click();
        cy.get(reportGeneratedReports).should("have.text", "Generated Reports").click();

        // Confirm filter suggestions for: GeneratedReports
        cy.get(mlReportFilterLoc).should("have.text", "Nickname Contains");
        cy.wait(5000);

        //Navigate to Message Templates
        cy.get(menuGroupSetup).click();
        cy.get(reportMessageTemplates).should("have.text", "Message Templates").click();
        cy.wait(1000);

        //Confirm filter suggestions for: MessageTemplates
        cy.get(mlReportFilterLoc).should("have.text", "Type EqualsNewUserLanguage EqualsenCustom EqualsYes");

        //Navigate to Dashboards
        cy.get(menuGroupSetup).click();
        cy.get(reportDashboards).should("have.text", "Dashboards").click();

        //Confirm filter suggestions for: Dashboards
        cy.get(mlReportFilterLoc).should("have.text", "ID Equals");
    });
});
