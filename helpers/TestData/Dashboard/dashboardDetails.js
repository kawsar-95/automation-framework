import arBasePage from '../../BasePage'


const dashboardName = 'Dashboard-' + new arBasePage().getTimeStamp();
const title = 'Competencies-' + new arBasePage().getTimeStamp();
const generatedReportsWidgetName = 'GeneratedReports-' + new arBasePage().getTimeStamp();
const savedReportsTitle = 'SavedReports-' + new arBasePage().getTimeStamp()
const savedReportsSubTitle = 'SavedReportsSubtitle-' + new arBasePage().getTimeStamp();
const myActivityWidgetName = 'MyActivity-' + new arBasePage().getTimeStamp();
const richTextTitle = 'RichText-' + new arBasePage().getTimeStamp();
const loginsWidgetTitle = 'Logins-' + new arBasePage().getTimeStamp();
const courseEnrollmentStatusTitle  ="Course Enrollment Status By Course - "+new arBasePage().getTimeStamp();
const courseEnrollmentDeptStatusTitle  ="Course Enrollment Status By Dept - "+new arBasePage().getTimeStamp();

export const dashboardDetails = {
    "balanced": "Balanced",
    "dashboardName": dashboardName,
    "widgetCompetency": "Competencies",
    "availability_rule_item": "availability-rule-item",
    "graphics": ['horizontalBarGraph', 'horizontalStackedBarGraph', 'verticalBarGraph', 'verticalStackedBarGraph'],
    "widgetCourse": "Course Enrollment Status by Course",
    "widgetDepartment": "Course Enrollment Status by Department",
    "generatedReports": "Generated Reports",
    "generatedReportsWidgetName": generatedReportsWidgetName,
    "widgetTitle": "wigdet-title",
    "savedReportsTitle": savedReportsTitle,
    "savedReportsSubTitle": savedReportsSubTitle,
    "savedReports": "Saved Reports",
    "reportData": ['My Saved Reports', 'Reports Shared with Me'],
    "logins": "Logins",
    "loginWidgetTypes": ['lineGraph', 'summary', 'verticalBarGraph'],
    "myActivity": 'My Activity',
    "myActivityWidgetName": myActivityWidgetName,
    "richText": "Rich Text",
    "richTextTitle": richTextTitle,
    "subTitle": "SubTitle",
    "body": "Welcome",
    "height_for_test": 56.5,
    "height_default":50,
    "url_for_test":"https://www.absorblms.com/",
    "welcome_message":"Welcome to Absorb",
    "lang_french":"Français",
    "lang_english":"English",
    "welcome_fr":"Bienvenue",
    "bodyText":"welcome to testing",
    "widgetCourseTitle": courseEnrollmentStatusTitle ,
    "widgetDeptTitle":courseEnrollmentDeptStatusTitle
}

export const addCompetenciesData = {
    "title": title,
    "competency1": 'GUIAuto - Competency - 02',
    "competency2": 'GUIAuto - Competency - 03',
    "filterTypeDD1": 'Awarded By',
    "filterTypeDD2": 'Course'
}

export const editCompetenciesData = {
    "filterTypeDD1": 'Date Acquired',
    "filterTypeDD2": 'After'
}

export const generatedReportsData = {
    "TITLE": generatedReportsWidgetName
}

export const LoginsWidgetData = {
    "TITLE": loginsWidgetTitle,
    "SUB_TITLE": "Logins sub title",
    "Line_Graph":"Line Graph",
    "Summary":"Summary",
    "Vertical_Bar_Graph":"Vertical Bar Graph"
}

export const courseEnrollmentStatusData = {
    "HORIZONTAL_BAR_GRAPH":"Horizontal Bar Graph",
    "HORIZONTAL_STACKED_GRAPH":"Horizontal Stacked Bar Graph",
    "VERTICAL_BAR_GRAPH":"Vertical Bar Graph",
    "VERTICAL_STACKED_BAR_GRAPH":"Vertical Stacked Bar Graph"
}
