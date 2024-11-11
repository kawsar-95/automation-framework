import { commonDetails } from '../Courses/commonDetails'
import users from '../../../cypress/fixtures/users.json'
import BasePage from "../../BasePage";
let timestamp = new BasePage().getTimeStamp()

export const ilcDetails = {
    "courseName": "GUIA-CED-ILC-" + timestamp,
    "courseName2": "GUIA-CED-ILC-2-" + timestamp,
    "courseName3": "GUIA-CED-ILC-3-" + timestamp,
    "courseName4": "GUIA-CED-ILC-4-" + timestamp,
    "courseNamePast": "GUIA-CED-ILC-PAST-" + timestamp,
    "courseNameFuture": "GUIA-CED-ILC-FUTURE-" + timestamp,
    "courseNameExistingVenue": "GUIA-CED-ILC-EXISTING-" + timestamp,
    "courseNameNewVenue": "GUIA-CED-ILC-NEW-" + timestamp,
    "description": "GUIA-CED-ILC-Description",
    "sessionName" : "GUIA Session",
    "sessionNameTimeStamp" : "GUIA Session - " + timestamp,
    "sessionDescription" : "GUIA Session description",
    "creditCourseName" : "GUIA-MultiCredit-ILC-" + timestamp, 
    "numLearners": "4",
    "sessionName_edited":"GUIA Session Edited"
}

const sessionName_1 = "GUIA Session 1";
const sessionName_2 = "GUIA Session 2";
const sessionName_3 = "GUIA Session 3";
const sessionName_4 = "GUIA Session 4";
const pastsessionName = "GUIA P Session";
const futuresessionName = "GUIA F Session";
const recurringName= "GUIA R Session"+ timestamp;
let sessionId;
let sessionId2;
let day;
let month;

export const sessions = {
    "sessionId": sessionId,
    "sessionId2": sessionId2,
    "sessionName_1" : sessionName_1,
    "sessionName_2" : sessionName_2,
    "sessionName_3" : sessionName_3,
    "sessionName_4" : sessionName_4,
    "pastsessionName" : pastsessionName,
    "futuresessionName" : futuresessionName,
    "recurringsessionName" :recurringName,
    "sessionNames": [sessionName_1, sessionName_2, sessionName_3],
    "sessionNames2": [sessionName_1, sessionName_2, sessionName_3, sessionName_4],
    "sessionName_Past" : "Past GUIA Session",
    "sessionName_Future" : "Future GUIA Session",
    "numLearnersSession": "1",
    "date1" : "2024-10-11",
    "date2" : "2020-10-11"
}

export const recurrence = {
    "recurrenceFuncNames": ['getAddDailyRecurringSession', 'getAddWeeklyRecurringSession', 'getAddMonthlyRecurringSession', 
                            'getAddYearlyRecurringSession'],
    "recurrenceSessionNames": ['GUIA - Daily', 'GUIA - Weekly', 'GUIA - Monthly', 'GUIA - Yearly'],
    "weekdayRecurrenceSessionName": "GUIA - Weekdays",
    "repeatEvery": "1", 
    "numOcurrences": "3", 
    "onDay": ["Thursday"],
    "onDayofMonth": "16", 
    "onMonth": "May", 
    "day": day,
    "month": month
}

export const attributes = {
   "audience":"GUIA Audience",
   "goals" : "GUIA Goals",
   "externalID" : "GUIA1234",
   "vendor" : "GUIA Vendor"
}

export const catalogVisibility = {
    "posterUrl" : 'https://www.absorblms.com/uploads/wp-content/uploads/2018/10/switching-to-absorb.jpg'
 }

 export const enrollment = {
    "selfEnrollmentName" : "GUIA",
    "approvalAccount" : users.sysAdmin.ADMIN_SYS_01_FNAME + ' ' + users.sysAdmin.ADMIN_SYS_01_LNAME,
    "approvalTypes": ["Instructor", "Supervisor", "Administrator", "Other"],
    "approvalDescriptions": ["A session instructor must approve all enrollments.", "A user's supervisor must approve all enrollments.", 
                            "A user's department administrator must approve all enrollments.", "Specify the users that are responsible for approving enrollments."]
 }
 
 export const messages = {
   "emailTemplateSubject" : "You have been enrolled in ",
   "chkBoxLabels" : ['enrollment', 'completion', 'failure', 'session update', 'session enrollment', 'session approval request', 'session reminder', 'instructor notification', 'mark attendance reminder'],
   "chkBoxDefaults" : ['true', 'true', 'false', 'true', 'true', 'false', 'false', 'true', 'false'],
   "emailTemplateBody": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
   "testEmailSubject": "This is test email message",
   "recipientContainsInactiveLearners": "Your selection contains inactive learners",
   "recipientContainsNonLearners": "Your selection contains non-learners"
 }
     
