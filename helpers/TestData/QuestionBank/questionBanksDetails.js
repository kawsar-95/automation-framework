import arBasePage from '../../AR/ARBasePage'

const name = "GUIA-CED-QBank-" + new arBasePage().getTimeStamp()
export const qbDetails = {
    "questionBanksName" : name,
    "questionBanksNameEdited" : name + new arBasePage().getAppendText(),
    "questionBanksNameDuplicate": name + '-Duplicate',
    "qb_question_1_text" : "QB QUESTION 1 TEXT",
    "qb_q1_answer_1" : "QB QUESTION 1 ANSWER 1",
    "qb_q1_answer_2" : "QB QUESTION 1 ANSWER 2",
    "qb_question_2_text" : "QB QUESTION 2 TEXT",
    "qb_q2_answer_1" : "QB QUESTION 2 ANSWER 1",
    "qb_q2_answer_2" : "QB QUESTION 2 ANSWER 2",
    "nameFieldErrorMsg" : "Name is required",
    "questionFieldErrorMsg" : "Question is required",
    "answerFieldErrorMsg" : "Option / Answer is required"
}

export const questionDetails = {
    "questionName" : "GUIA-Qn-" + new arBasePage().getTimeStamp(),
    "questionName2" : "GUIA-Qn-2-" + new arBasePage().getTimeStamp(),
    "questionName3" : "GUIA-Qn-3-" + new arBasePage().getTimeStamp(),
    option0 : "Option 0",
    option1 : "Option 1",
    option2 : "Option 2",
    option3 : "Option 3",
    option4 : "Option 4",
    option5 : "Option 5",
    option6 : "Option 6",
    option7 : "Option 7",
    option8 : "Option 8",
    option9 : "Option 9",
}