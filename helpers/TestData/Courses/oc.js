import { commonDetails } from '../Courses/commonDetails'
import arOCAddEditPage from '../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arCoursesPage from '../../AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsCatalogVisibilityModule from '../../AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import miscData from '../../../cypress/fixtures/miscData.json'

let objectName = "GUIA OC Lesson Object"
let objectNotes = "GUIA OC Notes"

export const ocDetails = {
    "courseName": "GUIA-CED-OC-" + commonDetails.timestamp,
    "courseName2": "GUIA-CED-OC-2" + commonDetails.timestamp,
    "courseName3": "GUIA-CED-OC-3" + commonDetails.timestamp,
    "courseName4": "GUIA-CED-OC-4" + commonDetails.timestamp,
    "courseName5": "GUIA-CED-OC-5" + commonDetails.timestamp,
    "description": "GUIA-CED-OC-Description",
    "longDescription": "GUIA-CED-OC-LongDescription ".repeat(75),
    "creditCourseName" : "GUIA-MultiCredit-OC-" + commonDetails.timestamp,
    "defaultChapterName": "Chapter 1",
    "defaultChapterName2": "Chapter 2",
    "defaultChapterName3": "Chapter 3",
    "longChapterName": "Chapter" + arOCAddEditPage.getLongString(100),
}

export const catalogVisibility = {

    "thumbnailUploadPathFM" : `${miscData.RESOURCE_IMAGE_FOLDER_PATH}${miscData.THUMBNAIL_01_FILENAME}`,
    "toggleFuncs" : [ARCourseSettingsCatalogVisibilityModule.getMandatoryCourseToggleContainer(), ARCourseSettingsCatalogVisibilityModule.getFeaturedCourseToggleContainer(), 
         ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer(),ARCourseSettingsCatalogVisibilityModule.getEnableForMobileAppToggleContainer()]
}

export const moreSection = {
    "description" : "Online Course More Section Test",
    "ocNotes" : arOCAddEditPage.getLongString(10001),
    "ocNotesEdited" : "Online Course Notes - Edited"
}

export const availabilitySection = {
    "Date" : arOCAddEditPage.getFutureDate(2, 'day'),
    "Date2" : arOCAddEditPage.getPastDate(2),
    "prerequisite": "Prerequisite 1"
} 

export const messageSection = {
    "emailTemplateSubject" : "You have been enrolled in " + ocDetails.courseName + commonDetails.timestamp,
    "ChkBoxLabels" : ['enrollment', 'completion', 'nudge', 'failure'], 
    "ChkBoxDefaults" : ['true', 'true', 'false', 'false'],
    "nudgeFields" : ['Years', 'Months', 'Days', 'Hours'], 
    "nudgeValues" : ['1', '3', '2', '4']
}

let uploadLabel = "GUIA OC Upload Label";
let uploadLabelApproval = "GUIA OC Approval Upload Label";

export const courseUploadSection = {
    "uploadLabel" : uploadLabel,
    "uploadLabelApproval" : uploadLabelApproval,
    "uploadLabelNames": [uploadLabel, uploadLabelApproval],
    "uploadLabelDefaultPrefix": "Course Upload",
    "uploadInstructions" : "GUIA OC Upload Instructions",
    "ocNotesEdited" : "Online Course Notes - Edited",
    "reviewerNotes": "GUIA OC Upload Notes",
    "uploadNotes": "GUIA Upload Notes",
    "dateIssued": "01/23/2021",
    "dateIssued2": "03/17/2020",
    "dateIssued2Long": "March 17, 2020",
    "dateExpired": "04/17/2023",
    "dateExpired2": "11/06/2024",
    "dateExpired2Long": "November 6, 2024",
    "issuer": "Absorb",
    "issuer2": "Absorb Software",
    "approvalTypes": ['None', 'Course Editor', 'Supervisor', 'Administrator', 'Other'],
    "approvalMessages": ["No approval is required for the course upload.", "A course editor must approve the course upload.",
                        "A user's supervisor must approve the course upload.", "A user's department administrator must approve the course upload.", 
                        "Specify the users that are responsible for approving the course upload."],
}

export const courseResourceSection = {
    "ocFMCourseREsourceName" : "GUIA File Manager Upload Course Resource"

}

export const lessonObjects = {
    "ocObjectNameFileManager": "GUIA Object Lesson For File Manager Testing",
    "prerequisiteName" : "GUIA Prerequisite",
    "objectName" : objectName,
    "objectUploadPathFM" : `${miscData.RESOURCE_IMAGE_FOLDER_PATH}${miscData.OBJECT_01_FILENAME}`,
    "longObjectName" : objectName + arOCAddEditPage.getLongString(100),
    "ocObjectDescription" : "GUIA OC Object Description",
    "objectNotes" : objectNotes,
    //These values need to be hardcoded for now. This can be fixed by a element consolidation refactor to move a number of elements to ARBasePage from Sub pages
    "funcNames" : [arCoursesPage.getElementByAriaLabelAttribute('Name'), '[name="source"]', '[data-name="content"] [class*="text-area-module__text_area"]'],
    "validValues" : [objectName, miscData.REMOTE_VIDEO_URL, objectNotes]
}

export const lessonTask = {
    "prerequisiteName" : "GUIA Prerequisite",
    "ocTaskName" : "GUIA OC Task",
    "ocTaskDescription" : "GUIA OC Task Description",
    "ocInstructions" : 'GUIA OC Task Instructions'
}

export const lessonVideo = {
    "ocVideoName" : "GUIA Video Lesson",
    "ocVideoName2" : "GUIA Video Lesson 2",
    "ocVideoNameFileUpload" : "GUIA Video File Upload",
    "ocVideoDescription" : "GUIA Video Lesson Description",
    "videoLabel" : "GUIA Video Lesson Label 640 x 480",
    "videoNotes" : "GUIA Video Lesson Notes",
    "videoName" : "big_buck_bunny_720p_1mb.mp4",
    "videoName2" : "small.mp4",
    "videoNameFileUploadMP4" : "VideoLessonUploadMp4.mp4"
}
export const assessmentDetails = {
    "ocAssessmentName" : "GUIA Assessment-"+ commonDetails.timestamp,
    "ocAssessmentType" : "Exam"
}

export const lessonAssessment = {
    "prerequisiteName" : "GUIA Prerequisite",
    "ocAssessmentName" : "GUIA OC Assesssment -"+ commonDetails.timestamp,
    "ocAssessmentName2" : "GUIA OC Assesssment-2-"+ commonDetails.timestamp,
    "ocAssessmentDescription" : "GUIA OC Task Description",
    "ocInstructions" : 'GUIA OC Task Instructions',
    "introMessage": "GUIA OC Assessment Introduction",
    "postMessage": "GUIA OC Assessment Completion",
    "failMessage": "GUIA OC Assessment Failure"
}


export const eSignature = {
    "eSignatureName": "GUIA OC Agreement",
    "eSignatureDescription": "GUIA OC E-Signature Description",
    "eSignatureAgreement": "GUIA OC E-Signature Agreement"
}

export const lessonSurvey = {
    "ocSurveyName": "GUIA OC Survey",
    "ocSurveyDescription": "GUIA OC Survey Description",
    "maxAttempts": "5",
    "introMessage": "GUIA OC Survey Introduction",
    "postMessage": "GUIA OC Survey Completion",
    "questionGroupName": "GUIA Question Group", 
    "questionGroupName2": "Second GUIA Question Group", 
    "questionGroupNameDefault": "Question Group 1", 
    "threeQuestionLetters": ['A', 'B', 'C'],
    "tenQuestionLetters": Array.from("ABCDEFGHIJ"),
    "questionTypes": ["Free Form Inquiry", "Poll Single Answer", "Poll Multiple Answer"],
    "pollQuestions": ["GUIA Question One", 'GUIA Question Two', 'GUIA Question Three'],
    "toggleFuncNames": ["getAllowMultipleAttemptsToggleContainer", "getRandomizeQuestionsToggleContainer", "getRandomizeAnswersToggleContainer", "getUseAnswerActionsToggleContainer", 
    "getAllowScoredAnswersToggleContainer", "getSinglePageLayoutToggleContainer", "getShowNavigationToggleContainer", "getAllowNavigationToggleContainer"]
}
export const taskDetails = {
    "ocTaskName" : "GUIA Task-"+ commonDetails.timestamp,
}

export const ocEnrollments = {
    "courseNameBoolean": "GUIA-CED-OC-" + commonDetails.timestamp + '-BOOLEAN',
    "courseNameBooleanYes": "GUIA-CED-OC-" + commonDetails.timestamp + '-BOOLEAN_YES',
    "courseNameBooleanNo": "GUIA-CED-OC-" + commonDetails.timestamp + '-BOOLEAN_NO',
    "numLearnersYes": "1",
    "numLearnersNo": "5",
    "courseNameDate": "GUIA-CED-OC-" + commonDetails.timestamp + '-DATE',
    "courseNameDateBefore": "GUIA-CED-OC-" + commonDetails.timestamp + '-DATE-BEFORE',
    "courseNameDateAfter": "GUIA-CED-OC-" + commonDetails.timestamp + '-DATE-AFTER',
    "courseNameDateBetween": "GUIA-CED-OC-" + commonDetails.timestamp + '-DATE-BETWEEN',
    "numLearnersBeforeDate": "1", 
    "numLearnersAfterDate": "1", 
    "numLearnersBetweenDate": "3",
    "courseNameDateTime": "GUIA-CED-OC-" + commonDetails.timestamp + '-DT',
    "courseNameDateTimeBefore": "GUIA-CED-OC-" + commonDetails.timestamp + '-DT-BEFORE',
    "courseNameDateTimeAfter": "GUIA-CED-OC-" + commonDetails.timestamp + '-DT-AFTER',
    "courseNameDateTimeBetween": "GUIA-CED-OC-" + commonDetails.timestamp + '-DT-BETWEEN',
    "numLearnersBeforeDateTime": "1", 
    "numLearnersAfterDateTime": "1", 
    "numLearnersBetweenDateTime": "2",
    "courseNameDept": "GUIA-CED-OC-" + commonDetails.timestamp + '-DEPT',
    "courseNameDeptOnly": "GUIA-CED-OC-" + commonDetails.timestamp + '-DEPT-ONLY',
    "courseNameDeptSub": "GUIA-CED-OC-" + commonDetails.timestamp + '-DEPT-SUB',
    "numLearnersDeptOnly": "1", 
    "numLearnersDeptSub": "2", 
    "courseNameList": "GUIA-CED-OC-" + commonDetails.timestamp + '-GROUP',
    "numLearnersList": "1", 
    "courseNameNumDec": "GUIA-CED-OC-" + commonDetails.timestamp + '-NUM_DEC',
    "courseNameNumLessDecEql": "GUIA-CED-OC-" + commonDetails.timestamp + '-NUM_DEC_LESS_EQL',
    "courseNameNumGrtrDecLess": "GUIA-CED-OC-" + commonDetails.timestamp + '-NUM_DEC_GRTR_LESS',
    "courseNameNumEqlDecGrtr": "GUIA-CED-OC-" + commonDetails.timestamp + '-NUM_DEC_EQL_GRTR',
    "numLearnersNumLessDecEql": "1",
    "numLearnersNumGrtrDecLess": "1",
    "numLearnersNumEqlDecGrtr": "1",
    "courseNameText": "GUIA-CED-OC-" + commonDetails.timestamp + '-TEXT',
    "courseNameTextStartsW": "GUIA-CED-OC-" + commonDetails.timestamp + '-TEXT-Starts With',
    "courseNameTextContains": "GUIA-CED-OC-" + commonDetails.timestamp + '-TEXT-Contains',
    "courseNameTextDNContain": "GUIA-CED-OC-" + commonDetails.timestamp + '-TEXT-Does Not Contain',
    "courseNameTextEndsW": "GUIA-CED-OC-" + commonDetails.timestamp + '-TEXT-Ends With',
    "courseNameTextDNEql": "GUIA-CED-OC-" + commonDetails.timestamp + '-TEXT-Does Not Equal',
    "courseNameTextEqls": "GUIA-CED-OC-" + commonDetails.timestamp + '-TEXT-Equals',
    "numLearnersStartsW": "1",
    "numLearnersContains": "4",
    "numLearnersContainsSelf": "3",
    "numLearnersDNContain": "4",
    "numLearnersDNContainSelf": "3",
    "numLearnersEndsW": "1",
    "numLearnersDNEql": "4",
    "numLearnersDNEqlSelf": "3",
    "numLearnersEqls": "1",
    "questionbankcourseplayer":`GUIA - CED - QBank - ${commonDetails.timestamp}`
}

export const ocViewHistoryDetails = {
    "OcViewHistory": "Online Course History"
    
}