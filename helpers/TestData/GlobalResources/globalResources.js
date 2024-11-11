import arBasePage from '../../AR/ARBasePage'

const name = "GUIA-CED-GlobalResource-" + new arBasePage().getTimeStamp()
let timesAccessed;

export const globalResources = {
    "resource01Name": "GUIAuto-Global Resources", 
    "timesAccessed": timesAccessed
}

export const resourceDetails = {
    "resourceName" : name, 
    "resourceNameEdited" : name + ' - Edited',
    "resourceNamePublic" : name + '_Public',
    "resourceNamePrivate" : name + '_Private',
    "resourceNameNotImage" : name + '_NotImage',
    "description" : "GUIA-CED-GlobalResource-Description",
    "FilevisibilityDescription" : "Test that FileManager change in upload and Thumbnail URL"
}

export const categories = {
    "rootCategoryName": "Choose Category",
    "guiaCategoryName": "GUIA - Global Category"
}

export const categoryDetails = {
    "categoryName": name,
    "categoryDescription": "GUIA-A-NEW-CATEGORY-DESCRIPTION"
}

export const file = {
    "FileName": "CourseResourceUploadImage1.jpg",
    "fileName2":"https://th.bing.com/th/id/OIP.avb9nDfw3kq7NOoP0grM4wHaEK?pid=ImgDet&rs=1"   
}

