import arBasePage from '../../AR/ARBasePage'

const name = "GUIA-CED-Competency-" + new arBasePage().getTimeStamp()
const name2 = "GUIA-CED-Competency2-" + new arBasePage().getTimeStamp()
export const competencyDetails = {
    "competencyName" : name,
    "competencyName2" : name2,
    "companyNameEdited" : name + new arBasePage().getAppendText(),
    "description" : "GUIA-CED-Competency-Description"+new arBasePage().getTimeStamp(),
    "competencyLeaderboard" : "10",
    "competencyLevel":"1",
    "nameFieldErrorMsg" : "Name is required",
}

export const competencies = {
    competency_01_name: " GUIAuto - Competency - 01",
    competency_02_name: " GUIAuto - Competency - 02",
    competency_03_name: " GUIAuto - Competency - 03",
}
