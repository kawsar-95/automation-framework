import arBasePage from '../../AR/ARBasePage'

const departmentName = "GUIA-CED-DEPT-" + new arBasePage().getTimeStamp()
const departmentName2 = "GUIA-CED-DEPT-2" + new arBasePage().getTimeStamp()

export const departmentDetails = {
    "departmentName" : departmentName,
    "departmentName2" : departmentName2,
    "departmentNameEdited" : departmentName + '-edited',
    "parentDepartment" : "Top Level Dept",
    "externalID" : "DEPT1234",
    "companyName": "Dept-Company-Name",
    "emailAddress" : "qa.absorblms@qa.com",
    "phoneNo" : "+1403404403",
    "joTitle" : "Sr. Automation Analyst",
    "joTitle2" : "Job Title 2",
    "joTitle3" : "Job Title 3",
    "location" : "California",
    "location2" : "location 2",
    "location3" : "location 3",
    "messageSubject" : "Message to Department",
    "messageBody" : "Welcome to LMS Department"
}
