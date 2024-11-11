import ARBasePage from "../../../ARBasePage";

export default new class ARAddMoreCourseSettingsModule extends ARBasePage {
   
     /**
   * This method/function is used to get any of the Course Settings by name within Courses.
   * The method/function takes a string label exactly the way it is displayed on the course settings button
   * @param {String} name The name of the settings button.
   * Example: Use getCourseSettingsByNameBtn('Completion') to get the selector for the Completion button
   */
    //Course Setting button at the top of the Add/Edit Course page
    getCourseSettingsByNameBannerBtn(titleText) {
        return `[class="_button_container_1g00a_1"] > button[title="${titleText}"]`
    }
 

    getCourseSettingsByNameBtn(name) {
       //keeping the old method for future reference
       // return `[class="_button_container_8vfwm_1"] > button[title="${name}"]`
       let nameAsCamelCase = this.toCamelCase(name)
       //Exceptions
       if (name ===  courseSettingsButtons.CourseAdministrators) {
           nameAsCamelCase = "courseAdmins"
       }
       if (name === courseSettingsButtons.CourseUploads ) {
           nameAsCamelCase = "uploads"
       }
       const sectionBtn = this.getElementByDataNameAttribute(`section-button-${nameAsCamelCase}`)
       const button = `${sectionBtn} `+this.getElementByTitleAttribute(name)
       return button ;
    }

    getEnrollmentRulesBtn(){
        return '[data-name="section-button-enrollmentRules"]'
    }

    getCourseAdminBtn(){
        return '[data-name="section-button-courseAdmins"]'
    }

    getCollapseCourseSettingByNameBtn(titleText) {
        return `[aria-label="Collapse ${titleText}"] > [class*="icon icon-caret-up"]`
    }

    getExpandCourseSettingByNameBtn(titleText) {
        return `[aria-label="Expand ${titleText}"] > [class*="icon icon-caret-down"]`
    }

    getHideCourseSettingByNameBtn(titleText) {
        return `[aria-label="Hide ${titleText}"] > [class*="icon icon-trash"]`
    }
    getHideMoreBtn(){
        return this.getElementByAriaLabelAttribute("Hide More")
    }

    // Added for the TC # C6321
    getVendorAttributeInput() {
        return 'input[aria-label="Vendor"]'
    }

    // Added or the TC# C7319
    getCurriculumSection(){
        return  '[data-name="edit-curriculum-enrollment-rules-section"]'
    }

    getCourseApprovalSetting(){
        cy.get('[data-name="course-approval-settings"]').within(() => {
            cy.get('[data-name="radio-button-CourseEditor"]').click({force:true})
        })
    }
    getCourseApprovalNoneSetting(){
        cy.get('[data-name="course-approval-settings"]').within(() => {
            cy.get('[data-name="radio-button-None"]').click({force:true})
        })
    }

    getCourseRadioButtonSpecific(){
        cy.get('[data-name="course-enrollment"]').within(() => {
            cy.get('[data-name="radio-button-Specific"]').first().click({force:true})
        })
    }

    getEnrollmentSelectionCourseName(){
        cy.get('[data-name="course-enrollment"]').eq(0).within(() => {
            cy.get(`[data-name="userIds"] [data-name="field"]`).should("have.text", "Choose").click()
            cy.get(`[data-name="options"] [role="option"]`).eq(0).scrollIntoView().click()
        })
    }
    
    getTimeToCompleteContainer(){
        return `[data-name="estimatedTimeToComplete"]`
    }

    getTimeToCompleteRadioButtons(){
        return `[data-name="estimatedTimeToComplete"] [class="_label_6rnpz_32"]`
    }

    getCourseLangDDown(){
    //  return '[class*="_select_field_"]'
      return '[data-name="languageCode"] [data-name="selection"]'
    }

    toCamelCase(inputString) {
        if (!inputString || typeof inputString !== "string") {
          return ""; // Return an empty string if the input is not valid or empty
        }
         // Split the input string by hyphens, underscores, or spaces
        const words = inputString.split(/[-_ ]+/);
        const camelCaseWords = words.map((word, index) => {
          if (index === 0) {
            return word.toLowerCase(); // Convert the first word to lowercase
          } else {
            // Capitalize the first character of each subsequent word
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();           
          }
        });
      
        return camelCaseWords.join(""); // Join the words and return the camelCase string
      }
      /**
       * Pass the name of Section Button in this method to get equivalent selector 
       * @param {String} name 
       * @returns equivaltent element selector
       */
      getSectionBtn(name) {
       
      }

    // Added for the JIRA# AUT-571, TC# C2029
    getCrossIcon() {
        return '[aria-label="Certificate"] [data-name="clear"]'
    }


}

export const courseSettingsButtons = {
    "General" : "General",
    "Syllabus" : "Syllabus",
    "EnrollmentRules" : "Enrollment Rules",
    "Completion" : "Completion",
    "Availability" : "Availability",
    "CatalogVisibility" : "Catalog Visibility",
    "CourseAdministrators" : "Course Administrators",
    "Messages":"Messages",
    "Resources":"Resources",
    "CourseUploads":"Course Uploads",
    "Attributes":"Attributes",
    "Social":"Social",
    "More":"More"

}