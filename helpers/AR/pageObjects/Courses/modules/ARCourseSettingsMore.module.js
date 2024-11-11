import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsMoreModule extends ARBasePage {
   
    getNotesTxtF() {
        return '[aria-label="Notes"]'
    }
    getCollapseMoreBtn(){
        return this.getElementByAriaLabelAttribute("Collapse More")
    }
}