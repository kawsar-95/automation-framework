import arBasePage from '../../AR/ARBasePage'

const name = "GUIA-CED-NewsArticle-" + new arBasePage().getTimeStamp()
const timeStamp = new arBasePage().getTimeStamp()
let timesAccessed;


export const newsArticle = {
    "newsArticle01Name": "GUIAuto-News Article", 
    "timesAccessed": timesAccessed,
    "GUIA NEWS ART 01":"GUIA NEWS ART 01 (DO NOT DELETE)",
    "GUIA NEWS ART 02":"GUIA NEWS ART 02 (DO NOT DELETE)",
    "GUIA NEWS ART 03":"GUIA NEWS ART 03 (DO NOT DELETE)",
    
}

export const newsArticleDetails = {
    "newsArticleName" : name, 
    "newsArticleNameEdited" : name + ' - Edited',
    "description" : "GUIA-CED-newsArticle-Description"
}

export const helperTextMessages = {
    "textWhenPublicSelecetd" : "These files are accessible and visible for non-LMS users through the Public Dashboard and Course Catalog.", 
    "textWhenPrivateSelecetd" : "These files can only be accessed by authenticated LMS users and enrolled learners.",
}