import { commonDetails } from '../Courses/commonDetails'

export const cbDetails = {
    "courseName": "GUIA-CED-CB-" + commonDetails.timestamp,
    "courseName2": "GUIA-CED-CB-2-" + commonDetails.timestamp,
    "description": "GUIA-CED-CB-Description",
    "language" : "Japanese"
}

let ocChild1 = "GUIA-CED-CB-" + commonDetails.timestamp + " CHILD_OC_1"
let ocChild2 = "GUIA-CED-CB-" + commonDetails.timestamp + " CHILD_OC_2"
let ilcChild1 = "GUIA-CED-CB-" + commonDetails.timestamp + " CHILD_ILC_1"

export const childCourses = {
    "ocChild1": ocChild1,
    "ocChild2": ocChild2,
    "ilcChild1": ilcChild1,
    "cbChildCourses": [ocChild1, ocChild2, ilcChild1]
}

