import { courses } from '../Courses/courses'
import { miscData } from '../Misc/misc'
import { users } from "../../TestData/users/users"
import { images, pdfs, videos, others, resourcePaths } from '../../TestData/resources/resources'
import LEDashboardPage from "../../LE/pageObjects/Dashboard/LEDashboardPage";

let timeStamp = LEDashboardPage.getTimeStamp();
const postSummary = 'Learner 01 Post ' + timeStamp;
const postSummary2 = 'Learner 01 Second Post ' + timeStamp;
const userName = "GUIA-COLLAB-USER- " + timeStamp;
const containerName = 'Collab Activity - ' + timeStamp;
const containerName2 = 'Collab Activity2 - ' + timeStamp;
const containerName3 = 'Collab Activity3 - ' + timeStamp;
const containerName4 = 'Collab Activity4 - ' + timeStamp;
const resourceOne = ['First Resource', 'First Resource Description', images.absorb_logo_small_filename];
const resourceTwo = ['Second Resource', 'Second Resource Description', miscData.switching_to_absorb_img_url];
const posts = Array.from('ABCDEFGHIJK');
const imgTypes = ['GIF', 'JPG', 'PNG'];
const otherTypes = ['PDF', 'DOCX', 'XLSX', 'MP4'];

export const collaborationDetails = {
    "collaborationName": "GUIA Collaboration - " + timeStamp,
    "activityType" : ['Reply', 'Comment', 'General'],
    "l01Name"  : `${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`,
    "l02Name" : `${users.learner02.learner_02_fname} ${users.learner02.learner_02_lname}`,
    "note1" : "GUIA Sys Admin 1",
    "note2" : "Second Note",
    "note3" : "Third Note",
    "postComment" : 'GUIA Post Comment',
    "postSummary" : postSummary,
    "postSummary2" : postSummary2,
    "postDescription" : "GUIA Collaboration Description",
    "postAnswer": "Learner 01 Answer",
    "postAnswer2": "Learner 02 Answer",
    "commentReply" : "GUIA Post Reply",
    "answerReply": "Learner 01 Reply",
    "otherReason": "GUIA Other Reason",
    "containerName": containerName,
    "containerName2": containerName2,
    "containerName3": containerName3,
    "containerName4": containerName4,
    "userName" : userName,
    "types": ['Reply', 'Comment', 'Post'],
    "reportType" : ['Inappropriate content', 'Spam or irrelevant content', 'Other'],
    "reasons" : ['GUIA Other Reason', 'Spam or irrelevant content', 'Inappropriate content'],
    "courseTypes" : ['Online Course', 'Instructor Led', 'Curriculum', 'Course Bundle'],
    "collabNames" : [miscData.d_collaboration_name, miscData.e_collaboration_name, miscData.f_collaboration_name], 
    "courseNames" : [courses.oc_filter_01_name, courses.ilc_filter_01_name, courses.curr_filter_01_name, courses.cb_filter_01_name],
    "courseNames2" : [courses.oc_filter_01_name, courses.ilc_filter_01_name, courses.curr_filter_01_name, courses.oc_ecomm_free_course_01_name],
    "resourceOne" : resourceOne,
    "resourceTwo" : resourceTwo,
    "temp" : [resourceOne, resourceTwo],
    "A_COLLABORATION_DESCRIPTION": "This is the description for the A - GUIA Collaboration.",
    "posts": posts, 
    "appendedText": " - Edited", 
    "numComments": 12, 
    "numReplies": 6,
    "adminsandnotes" :[ {
        name: users.depAdminLogInOut.admin_dep_loginout_fname + ' ' + users.depAdminLogInOut.admin_dep_loginout_lname,
        note: "Third Note"
    },
    
    {
        name: users.sysAdmin.admin_sys_01_fname + ' ' + users.sysAdmin.admin_sys_01_lname,
        note: "Second Note"
    }]

}


export const toastMessages = {
    "postSuccess": "Post created successfully.",
    "questionSuccess": "Question created successfully."
}

export const collaborationNames = {
    "A_COLLABORATION_NAME": "A - GUIA Collaboration",
    "B_COLLABORATION_NAME": "B - GUIA Collaboration",
    "C_COLLABORATION_NAME": "C - GUIA Collaboration",
    "D_COLLABORATION_NAME": "D - GUIA Collaboration",
    "E_COLLABORATION_NAME": "E - GUIA Collaboration",
    "F_COLLABORATION_NAME": "F - GUIA Collaboration",
    "G_COLLABORATION_NAME": "G - GUIA Collaboration",
    "H_COLLABORATION_NAME": "H - GUIA Collaboration",
    "I_COLLABORATION_NAME": "I - GUIA Collaboration",
    "J_COLLABORATION_NAME": "J - GUIA Collaboration",
    "K_COLLABORATION_NAME": "K - GUIA Collaboration",
    "L_COLLABORATION_NAME": "L - GUIA Collaboration",
    "collaborationNameToEditPrefix": "GUIA - Collaboration to Edit -"
}

export const collabNames = Object.keys(collaborationNames).map((key) => [collaborationNames[key]]).map(String) //This converts the above object into an array of names.

export const attachments = {
    "attachment1": miscData.resource_image_folder_path + images.moose_filename,
    "attachment2": miscData.resource_image_folder_path + images.absorb_logo_small_filename,
    "fileNames": [images.moose_filename, images.billboard_01_filename, images.happy_qas_filename, images.paw_print_logo_filename, images.paw_print_filename], 
    "fileNames2": [pdfs.security_training_certificate_filename, images.moose_filename, images.paw_print_filename], 
    "fileNames3": [images.absorb_logo_small_filename, images.moose_filename, images.billboard_01_filename, images.happy_qas_filename, images.paw_print_logo_filename, images.paw_print_filename],
    "imgAttachments": [[images.simpsons_gif_filename, images.bluetooth_filename, images.absorb_logo_small_filename], imgTypes],
    "otherAttachments": [[pdfs.sample_filename, others.guia_word_doc_filename, others.guia_excel_sheet_filename, videos.big_buck_bunny_filename], otherTypes, 
        [resourcePaths.resource_pdf_folder, resourcePaths.resource_other_folder, resourcePaths.resource_other_folder, resourcePaths.resource_video_folder]]
}

export const chatMessages = {
    msg_1 : "Test message 1",
    msg_2 : "Test Message 2"
}
