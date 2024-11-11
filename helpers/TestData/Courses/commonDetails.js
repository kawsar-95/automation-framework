import arBasePage from "../../AR/ARBasePage";
import { courses } from '../../TestData//Courses/courses'
import { miscData } from '../../TestData/Misc/misc'

let courseID;
let courseID2;
let courseIDs = [];
let courseNames = [];
let tagNames = [];
let userID;
const deptBCourses = [courses.deptB_rp_ilc, courses.deptB_rp_oc];
const deptCCourses = [courses.deptC_rp_ilc, courses.deptC_rp_oc];
const deptDCourses = [courses.deptD_rp_ilc, courses.deptD_rp_oc];

export const commonDetails = {
    "appendText": "-edited",
    "courseID": courseID,
    "courseIDs": courseIDs,
    "courseNames": courseNames,
    "filePath" : miscData.resource_image_folder_path,
    "videoPath" : miscData.resource_video_folder_path,
    "tagName" : "Auto_Tag1",
    "termsAndConditions": "GUIA Terms and Conditions",
    "textWithHtmlTag": "<b> test123 </b>",
    "timestamp" : new arBasePage().getTimeStamp(),
    "posterImgName" : "Absorb logo small.png",
    "posterFMUploadOCImgName" : "OCPosterUploadImage.jpg",
    "posterImgName_1" : "image switching-to-absorb.jpg",
    "posterFMUploadName" : "VideoLessonPosterUploadImage1.jpg",
    "thumbnailImgName" : "billboard (tasty).jpg",
    "THUMBNAIL_01_FILENAME": "ThumbnailUploadImage1.jpg",
    "courseResourceFMUploadName" : "CourseResourceUploadImage1.jpg",
    "prerequisiteName" : "GUIA Prerequisite",
    "date" : "2024-01-02",
    "date1" : "2018-08-01",
    "date2" : "2020-11-30",
    "date3" : "2018-08-10",
    "customTitle" : "GUIA Completion Custom Title",
    "customNotes" : "GUIA Completion Custom Notes",
    "variableCreditRuleName" : "GUIA",
    "certficateFMUploadFile" : "CertificateUploadImage1.jpg",
    "mooseFileName" : "moose.jpg",
    "commonUserName" : 'GUIAutoLearner-',
    "rpDeptCCourseName" : "GUIA-RP-DEPTC-OC-01-" + new arBasePage().getTimeStamp(),
    "rpSubDeptDCourseName" : "GUIA-RP-SUB-DEPTD-OC-01-" + new arBasePage().getTimeStamp(),
    "course_Score" :"100",
    "tagNames":tagNames,
    "tagNameGUIA": "GUIA-TAG-"+ new arBasePage().getTimeStamp(),
    "meetingDescription": "GUIA ILC Session Url Venue Meeting Description",
    "CourseEquivalent" : "Eq"
}
export const courseActivity ={
    "attainedCertificate" : "Yes",
    "courseStatus" :"Complete"
}
export const courseSummary ={
    "enrolled_Count"    : "1",
    "notStarted_Count"  : "1",
    "inProgress_Count"  : "1",
    "completed_Count"   : "1"

}
export const credit = {
    "courseName" : "GUIA-MultiCredit-",
    "userName" : "MC-TRANSCRIPT-USER-",
    "credit1": "33",
    "credit2": "44",
    "credits" : ['General', miscData.guia_credit_1_name, miscData.guia_credit_2_name],
    "credits2" : [miscData.guia_credit_1_name, miscData.guia_credit_2_name],
    "creditAmounts" : ['8', '10'],
    "totalCredit": '18',
    "creditAmounts2": ['10', '8', '6'],
    "totalCredit2": '24',
    "newCreditAmounts" : ['12', '15'],  
    "newTotalCredit" : 27,
    "userID" : userID
}

export const arrayOfCourses = {
    "twoElementsArray": [courses.oc_filter_01_name, courses.oc_filter_03_name],
    "deptBCourses" : deptBCourses,
    "deptCCourses" : deptCCourses,
    "deptDCourses" : deptDCourses,
    "arrRoleCourses" : deptBCourses.concat(deptCCourses, deptDCourses),
    "reviewCourses" : ['GUIA - RP - DEPB - OC', 'GUIAuto - Filter - OC04 - OJT'],
    "arrCourseID" : [courseID, courseID2],
    "fiveElementsArray" : [courses.oc_filter_01_name, courses.ilc_filter_01_name, courses.cb_filter_01_name, courses.cb_filter_01_oc_child_01, courses.curr_filter_01_name], 
    "nineElementsArray" : [courses.oc_filter_01_name, courses.ilc_filter_01_name, courses.cb_filter_01_name, courses.cb_filter_01_oc_child_01, courses.curr_filter_01_name, courses.cb_collaboration_01, courses.cb_ecomm_01, courses.curr_01_ced, courses.curr_02_ced]
}

export const completion = {
    "expireYear" : "20",
    "expireMonth" : "10",
    "expireDay" : "23",
    "enrollmentYear" : "19",
    "enrollmentMonth" : "10",
    "enrollmentDay" : "15",
    "durationYear" : "2019",
    "durationMonth" : "10",
    "durationDay" : "30",
    "negativeValue" : "-1",
    "postValue" : "2",
    "leaderboardPoints": "20",
    "leaderboardPoints2": "30"
}

export const courseExtension = {
    "extensionDays" : ['2', '3', '5'],
    "extensions" : [],
    "extensionPrices" : ['20', '30', '40'],
    "prices" : []
}

export const attributes = {
    "audience":"GUIA Audience",
    "goals" : "GUIA Goals",
    "externalID" : "GUIA1234",
    "vendor" : "GUIA Vendor",
    "companyCost": "200",
    "learnerCost": "201", 
    "companyTime": "202",
    "learnerTime": "203"
 }

export const courseEvalQuestions = {
    "defaultQuestions": ["Materials were helpful to learning", "Knowledge was valuable to job/professional development", "Overall rating of course", 
        "Course clearly communicated objectives/concepts", "Course generated enthusiasm in the subject", "Course was well organized", "Course delivery was convenient", 
        "Course delivery was conducive to learning", "Please enter any additional comments"],
    "newQuestion": "GUIA Test Question",
    "newQuestion2": "Second GUIA Test Question",
    "questionAnswer": "GUIA course evaluation answer"
}

