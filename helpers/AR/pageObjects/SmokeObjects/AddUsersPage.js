/// <reference types="cypress" />
import arCBAddEditPage from '../Courses/CB/ARCBAddEditPage'
import arCoursesPage from '../Courses/ARCoursesPage'
import arCURRAddEditPage from '../Courses/CURR/ARCURRAddEditPage'
import arILCAddEditPage from '../Courses/ILC/ARILCAddEditPage'
import arOCAddEditPage from '../Courses/OC/AROCAddEditPage'
import { ocDetails } from '../../../../helpers/TestData/Courses/oc'
import { ilcDetails } from '../../../../helpers/TestData/Courses/ilc'
import { cbDetails } from '../../../../helpers/TestData/Courses/cb'
import { currDetails } from '../../../../helpers/TestData/Courses/curr'
import ARBasePage from "../../ARBasePage";
import basePage from '../../../../helpers/BasePage'
import arAddMoreCourseSettingsModule from '../Courses/modules/ARAddMoreCourseSettings.module'

export default new class AddUsersPage extends ARBasePage {

 //this method for create a course
  // Selects object in the Select modal with the given name.
  SelectFunction(name) {
    //this.getLongWait()
    cy.get(this.getSelecDepartmentDropDownBtn()).click()
    this.getShortWait()
    cy.get(this.getSelectOptSmoke(),{timeout:10000}).contains(name).click({force:true});
    cy.get(this.getChooseBtn()).contains('Choose').click();
  }

 //this elements are for SelectFunction method
 getSelectOptSmoke() {
    return `[class="_label_ghc15_49"]`
  }
  getSelecDepartmentDropDownBtn(){
    return `[data-name="hierarchy-tree-item"] [data-name="toggle"]`
  }

  getChooseBtn() {
    return '[data-name="submit"] [class="_content_4zm37_17"]'
  }

  getCancelBtn() {
    return `[class*="dialog-module__focus_area"] [class*="button-module__cancel"]`
  }


}
