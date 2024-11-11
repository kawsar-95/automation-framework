import ARBasePage from "../../AR/ARBasePage"

const userName = 'GUIA-OJT-USER-' +  new ARBasePage().getTimeStamp()
export const ojtDetails = {
    "user_fname_pefix" : 'GUIA',
    "user_lname_prefix" : 'OJT-User',
    "userName" : userName,
    ojtStepTitle: 'Step 2',
    ojtSectionName: 'Section One',
    ojtName: 'GUIA OC Observation Lesson',
    ojtDescription: 'GUIA OC Observation Lesson Description'
}
