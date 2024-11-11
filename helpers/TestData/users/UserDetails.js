import arBasePage from "../../AR/ARBasePage";
import { users } from '../../../helpers/TestData/users/users'
import { departments } from '../../../helpers/TestData/Department/departments'
import { images, resourcePaths } from '../../../helpers/TestData/resources/resources'

let userID;
let userID2;
let userIDs = [];

const username = "GUIA-CED-User-" + new arBasePage().getTimeStamp()
const username2 = "GUIA-CED-User-2-" + new arBasePage().getTimeStamp()
const username3 = "GUIA-CED-User-3-" + new arBasePage().getTimeStamp()
const username4 = "GUIA-CED-User-4-" + new arBasePage().getTimeStamp()
const username5 = "GUIA-CED-User-5-" + new arBasePage().getTimeStamp()
const username6 = "GUIA-CED-User-6-" + new arBasePage().getTimeStamp()
const username7 = "GUIA-CED-User-7-" + new arBasePage().getTimeStamp()
const username8 = "GUIA-CED-User-8-" + new arBasePage().getTimeStamp()
const username9 = "GUIA-CED-User-9-" + new arBasePage().getTimeStamp()
const username10 = "GUIA-CED-User-10-" + new arBasePage().getTimeStamp()
const username11 = "GUIA-CED-User-11-" + new arBasePage().getTimeStamp()
const username12 = "GUIA-CED-User-12-" + new arBasePage().getTimeStamp()
const rpDeptBLearnerUserName = "GUIA-CED-User-DEPTB" + new arBasePage().getTimeStamp()
const rpDeptCLearnerUserName = "GUIA-CED-User-DEPTC" + new arBasePage().getTimeStamp()
const rpDeptDLearnerUserName = "GUIA-CED-User-DEPTD" + new arBasePage().getTimeStamp()


export const userDetails = {
   "firstName": "GUIA-CED" + new arBasePage().getTimeStamp(),
   "firstName2": "GUIA-CED-2" + new arBasePage().getTimeStamp(),
   "firstName3": "GUIA-CED-3" + new arBasePage().getTimeStamp(),
   "middleName": "mn",
   "lastName": "User",
   "lastName2": "UserTwo",
   "emailAddress": "GUIA-CED-User@absorblms.com",
   "username": username,
   "username2": username2,
   "username3": username3,
   "username4": username4,
   "username5": username5,
   "username6": username6,
   "username7": username7,
   "username8": username8,
   "username9": username9,
   "username10": username10,
   "username11": username11,
   "username12": username12,
   "duplicateUsername": users.duplicateUsername,
   "invalidPassword1": "testing",
   "invalidPassword2": "2",
   "validPassword": "testing1",
   "pin": 1111,
   "topLevelDept": departments.dept_top_name,
   "invalidTextInput": "<b>testing123</b>",
   "invalidEmail": 222,
   "firstNameEdited": "GUIA-CED-Edited",
   "lastNameEdited": "User-Edited",
   "emailAddressEdited": "GUIA-CED-User-Edited@absorblms.com",
   "usernameEdited": username + "Edited",
   "deptEdited": departments.Dept_B_name,
   "userID": userID,
   "userID2": userID2,
   "userIDs": userIDs,
   "rpDeptBAdminUserName": "GUIA-CED-Admin-DEPTB",
   "rpDeptBLearnerUserName": rpDeptBLearnerUserName,
   "rpDeptCAdminUserName": "GUIA-CED-Admin-DEPTC",
   "rpDeptCLearnerUserName": rpDeptCLearnerUserName,
   "rpDeptDAdminUserName": "GUIA-CED-Admin-DEPTD",
   "rpDeptDLearnerUserName": rpDeptDLearnerUserName,
   "inactiveUser": "GUIAuto Learner Inactive",
   "appendText": "-edited",
   "userWithAdminRoleOnly": "UserWithAdminRole",
   "textCustomFieldLabel": "GUIA Text Custom Field",
   "numberCustomFieldLabel": "GUIA Number Custom Field",
   "customText1": "GUIA Custom Text 1",
   "customText2": "GUIA Custom Text 2"
}

export const ecommFields = {
   "location": "User Location",
   "address": "123 User Street",
   "address2": "456 User Avenue",
   "countryCode": "CA",
   "country": "Canada",
   "country2": "United States",
   "province": "Alberta",
   "province2": "Alabama",
   "provinceCode": "AB",
   "zipCode": "35242",
   "city": "Calgary",
   "postalCode": "T2G 0H7",
   "postalCodeUSA": '35013',
   "creditCardNum": "4111111111111111",
   "phone": "123-456-7891"
}

export const generalSectionFieldNames = {
   "firstName": "First Name",
   "middleName": "Middle Name",
   "lastName": "Last Name",
   "emailAddress": "Email Address",
   "username": "Username",
   "department": "Department",
   "password": "Password",
   "confirmPassword": "Confirm Password",
   "newTemporaryPassword": "New Temporary Password",
   "confirmTemporaryPassword": "Confirm Temporary Password"
}

export const employmentDetailsSectionFields = {
   "employeeNumber": "11111111",
   "jobTitle": "CED Test User",
   "location": "Calgary, AB",
   "supervisor": users.sysAdmin.admin_sys_01_username,
   "supervisorName": `${users.sysAdmin.admin_sys_01_fname} ${users.sysAdmin.admin_sys_01_lname}`,
   "gender": "Male",
   "gender2": "Female",
   "dateHired": "2018-08-01",
   "dateHired2": "2017-07-11",
   "dateTerminated": "2044-02-11",
   "dateTerminated2": "2030-04-13"
}

 export const detailsSectionFields = {
    "avatarFilePath": resourcePaths.resource_image_folder + images.umbrella_icon_filename,
    "avatarFilePathJpg": resourcePaths.resource_image_folder + images.bluetooth_filename,
    "avatarFilePathGif": resourcePaths.resource_image_folder + images.simpsons_gif_filename,
    "avatarImageName": images.umbrella_icon_filename,
    "avatarUrl": images.switching_to_absorb_img_url,
    "language": "English",
    "language2": "French",
    "CCEmailAddress": "GUIA-CED-User-CC@absorblms.com",
    "CCEmailAddress2": "GUIA-CED-User-CC2@absorblms.com",
    "CCEmailAddress3": "GUIA-CED-User-CC3@absorblms.com",
    "CCEmailAddress4": "GUIA-CED-User-CC4@absorblms.com",
    "CCEmailAddress5": "GUIA-CED-User-CC5@absorblms.com",
    "notes": "GUIA User CED Notes"
 }

 export const userManagementTypes = {
   "ALL": "All"
 }

export const arrayOfUsers = {
   "deptBUsers": [users.depAdminDEPTB.admin_dep_username, users.learner01DeptB.learner01DeptB_username, users.learner01DeptB2.learner01DeptB_username],
   "deptCUsers": [users.depAdminDEPTC.admin_dep_username, users.learner01DeptC.learner01DeptC_username, users.learner01DeptC2.learner01DeptC_username],
   "deptUsers": [rpDeptCLearnerUserName, rpDeptDLearnerUserName],
   "deptSubDep": [users.learner01SUBDEP.learner01SUBDEP_username, users.learner01SUBDEP2.learner01SUBDEP_username, users.learner01SubSubDeptB.learner01SubSubDeptB_username, users.learner01SubSubDeptB2.learner01SubSubDeptB_username],
   "reviewUsers": ['GUI_Auto DepAdmin LogInOut', 'GUI_Auto Learner LogInOut'],
   "arrUserID": [userID, userID2]
}

export const adminRoles = {
   "admin": "Admin",
   "createEditor": "Create Editor",
   "enrollAnyoneOff": "EnrollAnyOneOff",
   "reporter": "Reporter",
   "systemAdmin": "System Admin",
   "allRoles": ["Admin", "Create Editor", "EnrollAnyOneOff", "Reporter", "System Admin"]
}

// Added for the TC# C1904
export const groupDetails = {
    "groupName": "TEST-GROUP" + new arBasePage().getTimeStamp(),
    "groupName2": "TEST-GROUP-2" + new arBasePage().getTimeStamp(),
    "groupNameSearch": "TEST-GROUP"
 }

 export const csvFileUser1 = {
   "firstName": "GUIA-User-Import 1 FN",
   "lastName": "GUIA-User-Import 1 LN",
   "emailAddress": "qa.guiauto1@absorblms.com",
   "password": "testing1",
}

export const GUIAListCustomField = ['List Item 1', 'List Item 2']