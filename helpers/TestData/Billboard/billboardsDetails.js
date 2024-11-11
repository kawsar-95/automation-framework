
import arBasePage from '../../AR/ARBasePage'
import miscData from '../../../cypress/fixtures/miscData.json'

export const billboardsDetails = {
    "guiaBillboard": "GUIA-Billboard",
    "billboardName" : 'GUIA-CED-Billboard-' + new arBasePage().getTimeStamp(),
    "billboardName2" : 'GUIA-CED-Billboard-2' + new arBasePage().getTimeStamp(),
    "billboardName3" : 'GUIA-CED-Billboard-3' + new arBasePage().getTimeStamp(),
    "billboardDescription" : 'This is Billboard automation test',
    "uploadPath" : `${miscData.RESOURCE_IMAGE_FOLDER_PATH}${miscData.BILLBOARD_01_FILENAME}`,
    "uploadPathV" :`${miscData.RESOURCE_VIDEO_FOLDER_PATH}${miscData.BillBOARD_01_MP4NAME}`,
    "uploadPathW" :`${miscData.RESOURCE_VIDEO_FOLDER_PATH}${miscData.BillBOARD_01_WEBMNAME}`,

    "billboardFileManagerName" : 'GUIA-FileUpload-Billboard' + new arBasePage().getTimeStamp(),
    "billboardDescriptionForFileManager" : 'This is Billboard automation test for uploading to File Manager',
    "uploadPathU" : `${miscData.RESOURCE_IMAGE_FOLDER_PATH}${miscData.BILLBOARD_01_UPLOADTESTFILENAME}`,
    "uploadPathVU" :`${miscData.RESOURCE_VIDEO_FOLDER_PATH}${miscData.BillBOARD_01_UPLOADTESTMP4NAME}`,
    "uploadPathWU" :`${miscData.RESOURCE_VIDEO_FOLDER_PATH}${miscData.BillBOARD_01_UPLOADTESTWEBMNAME}`
}
