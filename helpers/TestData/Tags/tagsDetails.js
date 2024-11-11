import arBasePage from '../../AR/ARBasePage'

const name = "GUIA-CED-Tag-" + new arBasePage().getTimeStamp()
// Added for the TC# C2070
const name1 = "GUIA-CED-Tag1-" + new arBasePage().getTimeStamp()
const name2 = "GUIA-CED-Tag2-" + new arBasePage().getTimeStamp()
const name3 = "GUIA-CED-Tag3-" + new arBasePage().getTimeStamp()
const name4 = "GUIA-CED-Tag4-" + new arBasePage().getTimeStamp()
export const tags = {
    "tagName" : name,
     "tagNameEdited" : name + new arBasePage().getAppendText(),
     // Added for the TC# C2070
    "tagName1": name1,
    "tagName2": name2,
    "tagName3": name3,
    "tagName4": name4    
}