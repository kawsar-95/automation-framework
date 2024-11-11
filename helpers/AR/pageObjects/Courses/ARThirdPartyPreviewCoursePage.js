import arBasePage from "../../ARBasePage";

export default new class ARThirdPartyPreviewCoursePage extends arBasePage {

getCourseTitle() {
    return `[class*="_top_bar_title"]`
}

}