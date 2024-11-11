import leBasePage from '../../LEBasePage'

export default new class LEExternalTrainingModal extends leBasePage {

  getModalTitle() {
    return `[class*="external-training-submission-module__title"]`
  }

  getCourseNameTextF() {
    return `[name="CourseName"]`
  }

  getCompletionDateTextF() {
    return `[class="form-control"]`
  }

  getSubmitBtn() {
    return `[type="submit"]`
  }

  getCancelBtn() {
    return `[title="Cancel External Training"]`
  }

  getFileUploadModuleContainer() {
    return `[class="redux-form-file-upload-module__field___Suv2J"]`
  }

  getCalenderTodayDay() {
    return `[class="rdtDay rdtToday"]`
  }

  getFileUploadBtn() {
    return `button[class*="redux-form-image-upload"]`
  }

  getFilePathTxt() {
    return 'input[type="file"]'
  }

  getCloseModalBtn() {
    return `[class="icon icon-x-thin"]`
  }

}