import arBasePage from '../../AR/ARBasePage'

const question = "GUIA-CED-FAQs-Question-" + new arBasePage().getTimeStamp()
export const faqDetails = {
    "faqQuestion" : question,
    "faqQuestionEdited" : question + new arBasePage().getAppendText(),
    "answer" : "GUIA-CED-FAQs-Answer"
}
