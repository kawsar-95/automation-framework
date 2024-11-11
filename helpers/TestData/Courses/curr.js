import { commonDetails } from '../Courses/commonDetails'
import BasePage from "../../BasePage";
let timestamp = new BasePage().getTimeStamp()

export const currDetails = {
    "courseName": "GUIA-CED-CURR-" + commonDetails.timestamp,
    "courseName2": "GUIA-CED-CURR-2-" + commonDetails.timestamp,
    "curriculumGroupName" : "GUIA-CED-Curriculum Group 1-",
    "description": "GUIA-CED-CURR-Description",
    "creditCourseName" : "GUIA-MultiCredit-CURR-",
    "language" :"French",
    "Defaultlanguage" :"English",
    "commentReply_1":"GUIA-Test-CommentReply"+ timestamp,
    "commentReply_2":"GUIA-Test-CommentReply"+ timestamp,
    "postComment":"GUIA-Tesing-PostComment",
    "postComment2":"GUIA-Tesing-PostComment-2" + timestamp,
    "defaultGroupName": "Group 1", 
    "defaultGroupName2": "Group 2", 
    "defaultGroupName3": "Group 3", 
}
