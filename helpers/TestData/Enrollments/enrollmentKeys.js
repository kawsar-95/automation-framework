
import arBasePage from "../../AR/ARBasePage";
import { userDetails } from '../../TestData/users/UserDetails'

let eKeyId;
let eKeyId2;
let eKeyUrl;

export const generalFields = {
    "appendText": " - Edited",
    "eKeyId": eKeyId,
    "eKeyId2": eKeyId2,
    "singleEKeyName" : "Single GUIA EKey - " + new arBasePage().getTimeStamp(),
    "bulkEKeyName" : "Bulk GUIA EKey - " + new arBasePage().getTimeStamp(),
    "bulkEKeyName2" : "Bulk GUIA EKey Second - " + new arBasePage().getTimeStamp(),
    "eKeyName" : "Valid-EKey-" + new arBasePage().getTimeStamp().slice(0, 10)+Cypress._.random(0,100),
    "coursesEmptyState": "No courses have been added - this enrollment key will grant users access to 0 courses.",
    "date1" : "2020-02-15",
    "date2" : "2024-02-15",
    "date3" : "2020-04-10",
    "date4" : "2024-04-10",
    "eKeyUrl": eKeyUrl
}

export const messagesFields = {
    "subjectText": "Enrollment Key From LMS"
}

export const fieldsFields = {
    "fieldNames": ['Username', 'First Name', 'Last Name', 'Email Address', 'Middle Name', 'Job Title', 'Employee Number', 'Phone', 
                    'Location', 'Address', 'Address 2', 'Country', 'Province', 'City', 'Postal Code', 'Language', 'GUIA Boolean Custom Field', 
                    'GUIA Date Time Custom Field', 'GUIA Number Custom Field', 'GUIA Decimal Custom Field'],
    "behaviourOptions": ['Hidden', 'Locked', 'Optional', 'Read Only', 'Required']
}

export const fieldValues = {
    "First Name": userDetails.firstName,
    "Last Name": userDetails.lastName,
    "Email Address": userDetails.emailAddress,
    "Middle Name": userDetails.middleName,
    "Job Title": "GUIA Job", 
    "Employee Number": "12345", 
    "Phone": "1234567891", 
    "Location": "Absorb", 
    "Address": "123 Street SW", 
    "Address 2": "Unit 10", 
    "Country": "Canada", 
    "Country 2": "United States", 
    "Province": "Alberta", 
    "Province 2": "Alabama",
    "City": "Calgary", 
    "Postal Code": "T3K 4K7", 
    "Language": "English", 
    "Language 2": "French",
    "question_Order":"1",
    "total_Response" : "0"
}

export const instructions = {
    "subject": "Enrollment Key Information",
    "body": "Please be advised that you have been provided an enrollment key"
}