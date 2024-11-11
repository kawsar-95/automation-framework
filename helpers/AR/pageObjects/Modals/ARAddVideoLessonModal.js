import arBasePage from "../../ARBasePage"
import ARUploadFileModal from '../Modals/ARUploadFileModal'
import { miscData } from "../../../TestData/Misc/misc"
import { commonDetails } from "../../../TestData/Courses/commonDetails"
import { lessonVideo } from "../../../TestData/Courses/oc"
import { resourcePaths, videos } from "../../../TestData/resources/resources"

export default new class ARAddVideoLessonModal extends arBasePage {

    getModalErrorMsg() {
        return "error";
    }
    
    getNameTxt() {
        return "Name";
    }

    getNameErrorMsg() {
        return `[data-name="name"] [data-name="error"]`;
    }

    getVideoDescriptionTxtF() {
        return `div[data-name="video-lesson"] ${this.getDescriptionTxtF()}`
    }

    getAddVideoLessonContainer(){
        return `[class*="_dialog_ixjmy_1 _form_modal"]`
    }

    getNotesTxtF() {
        return '[data-name="general-section"] [name="notes"]'
    }

    getDisableSeekingToggleContainer() {
        return 'disableSeeking';
    }

    getAllowPlaybackSpeedAdjustmentToggleContainer(){
        return `enablePlaybackSpeed`
    }

    getAllowPlaybackSpeedAdjustmentToggleBtn(){
        return cy.get(this.getElementByDataName(this.getAllowPlaybackSpeedAdjustmentToggleContainer())+ ' ' + this.getToggleStatus())
    }

    getAllowPlaybackSpeedAdjustmentFlag(){
        return `[data-name="enablePlaybackSpeed"] [data-name="toggle-button"]`
    }

    getAllowPlaybackSpeedAdjustmentMessageContainer(){
        return `[data-name="enablePlaybackSpeed"] [data-name="description"]`
    }
    getAllowPlaybackSpeedAdjustmentMessage(){
        return `Learners have the ability to adjust the speed at which the video plays.`
    }

    //----- Video Section -----//

    getWidthTxtF() {
        return this.getElementByDataNameAttribute("width") + ' ' + this.getNumF()
        //`[data-name="width"] [class*="number-input-module__input"]`;
    }

    getWidthErrorMsg() {
        return `[data-name="width"] [data-name="error"]`;
    }

    getHeightTxtF() {
        return this.getElementByDataNameAttribute("height") + ' ' + this.getNumF()
        //`[data-name="height"] [class*="number-input-module__input"]`;
    }

    getHeightErrorMsg() {
        return `[data-name="height"] [data-name="error"]`;
    }

    getPosterDataName() {
       return `poster` 
    }

    getPosterRadioBtn() {
        return `[data-name="poster"] [class="_label_6rnpz_32"]`;
    }

    getPosterChooseFileBtn() {
        return this.getElementByDataNameAttribute(this.getPosterDataName()) + ' ' + this.getFolderBtn()
    }

    getPosterFilePathF() {
        return `[data-name="poster"] [class*="file-input-module__text_input"]`;
    }

    getPosterUrlFilePathTxtF() {
        return `[data-name="poster"] [class*="text-input-module__text_input"]`;
    }

    getVideoSourceLabelTxtF() {
        return `[data-name="video-lesson-source"] [class="_text_input_1c8rc_1"]`;
    }

    getVideoSourceRadioBtn() {
        return `[data-name="video-lesson-source"] [class="_label_6rnpz_32"]`;
    }

    getVideoSourceChooseFileBtn() {
        return `[data-name="video-lesson-source"] [class*="icon icon-folder-small"]`;
    }

    getVideoSourceFilePathF() {
        return `[data-name="video-lesson-source"] [class*="file-input-module__text_input"]`;
    }

    getVideoSourceUrlFilePathTxtF() {
        return `[data-name="video-lesson-source"] [aria-label="Url"]`;
    }

    getVideoSourceUrlFilePathErrorMsg() {
        return `[data-name="video-lesson-source"] [data-name="error"]`;
    }

    //Subtitles
    getTranscriptVideoToggleContainer() {
        return 'transcriptionEnabled';
    }

    getVideoSubsDataName() {
        return `video-lesson-subtitles`
    }

    getAddSubtitleBtn() {
        return this.getElementByDataNameAttribute(`options`) + ' ' + this.getPlusBtn()
    }

    getLanguageDDown() {
        //cy.get(varRuleType).find(this.getEnrollmentRuleGroup()).eq(index).within((this.getVideoSubsDataName()
        return this.getElementByDataNameAttribute(this.getVideoSubsDataName()) + ' ' + this.getDDown()
    }

    getLanguageDDownSearchTxtF(index) {
        return this.getElementByDataNameAttribute(this.getVideoSubsDataName()) + ' ' + this.getDDownSearchTxtF()
    }

    getLanguageDDownOpt(index) {
        return this.getElementByDataNameAttribute(this.getVideoSubsDataName()) + ' ' + this.getDDownOpt()
    }

    getSubtitlesMessage() {
        return `[data-name="subtitle-messages"]`
    }

    getSubtitlesChooseFileBtn() {
        return this.getElementByDataNameAttribute(this.getVideoSubsDataName()) + ' ' + this.getFolderBtn()
    }


    //--------------------------//

    getApplyBtn() {
        return `[data-name="save"]`
    }

    getCancelBtn() {
        return this.getCancelIconBtn()
    }

    getTurnOnOffAllowPlaybackSpeedAdjustmentToggleBtn(value){
        cy.get(this.getAllowPlaybackSpeedAdjustmentToggleBtn()).invoke('attr','aria-checked').then((status) =>{
            if(status === value){
               cy.get(this.getAllowPlaybackSpeedAdjustmentToggleBtn()).should('have.attr', 'aria-checked', value)
            }
            else{
            cy.get(this.getAllowPlaybackSpeedAdjustmentFlag()).click()
            cy.wait(1000)
            }
        })
        cy.get(this.getAllowPlaybackSpeedAdjustmentMessageContainer()).should('contain', this.getAllowPlaybackSpeedAdjustmentMessage())
    }

    addSubtitles(subtitles) {
        for(let i = 0; i < subtitles.length; i++) {
            cy.get(this.getAddSubtitleBtn()).scrollIntoView().should('be.visible').click()
            cy.get(this.getSubtitlesMessage()).contains('Please note only .vtt subtitle files are supported.')
            cy.get(this.getLanguageDDown()).eq(i).click()
            cy.get(this.getLanguageDDownSearchTxtF()).eq(i).type(subtitles[i].language)
            cy.get(this.getLanguageDDownOpt()).filter(`:contains(${subtitles[i].language})`).eq(i).click()
            cy.get(this.getSubtitlesChooseFileBtn()).eq(i).click()
            cy.get(ARUploadFileModal.getUploadFileBtn()).click()
            cy.get(ARUploadFileModal.getFileInput()).attachFile(subtitles[i].fileName)
            cy.get(this.getWaitSpinner()).should('not.exist')
            cy.get(ARUploadFileModal.getSaveBtn()).click()
            cy.get(ARUploadFileModal.getSaveBtn()).should('not.exist')
            cy.get(this.getWaitSpinner()).should('not.exist')
        }
    }
    
    //Adds a custom video lesson - pass object name and poster and Video type(Url or file), file path, file name, DisableSeeeking, & Subtitle toggle status (true or false)
    getAddCustomVideoLesson(name, disableSeekingStatus, width, height, posterType, posterFilePath, posterFileName, videoType, videoFilePath, videoFileName, transcribeVideo, subtitles) {
        cy.get(this.getElementByAriaLabelAttribute(this.getNameTxt())).type(name)
        cy.get(this.getVideoDescriptionTxtF()).type(lessonVideo.ocVideoDescription)
        cy.get(this.getNotesTxtF()).type(lessonVideo.videoNotes)

        switch (disableSeekingStatus) {
            case 'false':
                cy.get(this.getElementByDataNameAttribute(this.getDisableSeekingToggleContainer()) + ' ' + this.getToggleStatus())
                .should('have.attr', 'aria-checked', disableSeekingStatus)
                break;
            case 'true':
                cy.get(this.getElementByDataNameAttribute(this.getDisableSeekingToggleContainer()) + ' ' + this.getToggleStatus()).click({force: true})
            .should('have.attr', 'aria-checked', disableSeekingStatus)
            break;
        }
        cy.get(this.getWidthTxtF()).clear().type(width)
        cy.get(this.getHeightTxtF()).clear().type(height)
        switch (posterType) {
            case 'Url':
                cy.get(this.getPosterRadioBtn()).contains('Url').click()
                cy.get(this.getPosterUrlFilePathTxtF()).type(miscData.switching_to_absorb_img_url)
                this.getShortWait()
                break;
            case 'File':
                cy.get(this.getPosterRadioBtn()).contains('File').click()
                cy.get(this.getPosterChooseFileBtn()).click()
                this.getShortWait()
                cy.get(ARUploadFileModal.getUploadFileBtn()).click()
                cy.get(ARUploadFileModal.getChooseFileBtn()).click().selectFile(`${posterFilePath}` + `${posterFileName}`, {force:true})
                ARUploadFileModal.getShortWait()
                cy.get(ARUploadFileModal.getSaveBtn()).click()
                cy.get(this.getWaitSpinner(), {timeout: 20000}).should('not.exist')
                ARUploadFileModal.getShortWait()
                break;
        }
        switch (videoType) {
            case 'Url':
                cy.get(this.getVideoSourceRadioBtn()).contains('Url').click()
                cy.get(this.getVideoSourceUrlFilePathTxtF()).type(miscData.remote_vide0_url)
                this.getShortWait()
                break;
            case 'File':
                cy.get(this.getVideoSourceRadioBtn()).contains('File').click()
                cy.get(this.getVideoSourceLabelTxtF()).type(lessonVideo.videoLabel)
                cy.get(this.getVideoSourceChooseFileBtn()).click()
                this.getShortWait()
                cy.get(ARUploadFileModal.getUploadFileBtn()).click()
                cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(`${videoFilePath}` + `${videoFileName}`, {force:true})
                ARUploadFileModal.getShortWait()
                cy.get(ARUploadFileModal.getSaveBtn()).click({force:true})
                cy.get(this.getWaitSpinner(), {timeout: 600000}).should('not.exist')
                ARUploadFileModal.getShortWait()
                break;
        }
        switch (transcribeVideo) {
            case 'false':
                cy.get(this.getElementByDataNameAttribute(this.getTranscriptVideoToggleContainer()) + ' ' + this.getToggleStatus())
                .should('have.attr', 'aria-checked', transcribeVideo)
                break;
            case 'true':
                cy.get(this.getElementByDataNameAttribute(this.getTranscriptVideoToggleContainer()) + ' ' + this.getToggleStatus()).click({force: true})
                .should('have.attr', 'aria-checked', transcribeVideo)
                break;
        }

        if (Array.isArray(subtitles)){
            this.addSubtitles(subtitles)
        }
        else if(subtitles === 'true') {
            cy.get(this.getAddSubtitleBtn()).click({force:true})
            cy.get(this.getLanguageDDown()).eq(0).click()
            cy.get(this.getLanguageDDownSearchTxtF()).type('English')
            cy.get(this.getLanguageDDownOpt()).contains('English').click()
            cy.get(this.getSubtitlesChooseFileBtn()).click()
            cy.get(ARUploadFileModal.getUploadFileBtn()).click()
            cy.get(ARUploadFileModal.getFileInput()).attachFile(miscData.resource_video_folder_path + videos.subtitles_en_vtt, {force:true})
            ARUploadFileModal.getShortWait()
            cy.get(ARUploadFileModal.getSaveBtn()).click()
            cy.get(this.getWaitSpinner(), {timeout: 20000}).should('not.exist')
        }
        else {
            cy.get(this.getSubtitlesMessage()).contains('There are no subtitles set for your video.')
        }

        cy.get(this.getApplyBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(this.getApplyBtn()).should('not.exist')
    }

    getRichTextUnderlineBtn() {
        return 'div[data-name="video-lesson"] button[title="Ordered List"][data-cmd="formatOL"]'
    }
}

export const subtitles = [
    {language: 'English', fileName: miscData.resource_video_folder_path + videos.subtitles_en_vtt},
    {language: 'Spanish', fileName: miscData.resource_video_folder_path + videos.subtitles_es_vtt},
    {language: 'German', fileName: miscData.resource_video_folder_path + videos.subtitles_de_vtt}, 
]