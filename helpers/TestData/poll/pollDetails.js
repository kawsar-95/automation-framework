import arBasePage from '../../AR/ARBasePage'

const poQuestion = "How good is Our GUIA Automation -" + new arBasePage().getTimeStamp()
export const pollDetails = {
    "pollQuestion" : poQuestion,
    "pollQuestionEdited" : poQuestion + new arBasePage().getAppendText(),
    "answer" : "Very Good"
}
