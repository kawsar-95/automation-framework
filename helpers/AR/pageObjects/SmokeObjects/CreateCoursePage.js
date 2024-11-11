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
import ARILCAddEditPage from '../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'

export default new class CreateCoursePage extends ARBasePage {

//Pass courseName if you wish to use this function to create multiple courses w/ unique names in the same test
//Pass ilcSession = false if you want to create an ILC without a session
    getCreateCouseForSmoke(courseType, courseName, ilcSession = true) {
    
    let courseTypeMod = new basePage().capitalizeString(courseType)
    let name;

    if (courseName != undefined) {
        name = courseName;
    } else {
        switch (courseTypeMod) {
            case 'Online Course':
                name = ocDetails.courseName;
                break;
            case 'Instructor Led':
                name = ilcDetails.courseName;
                break;
            case 'Course Bundle':
                name = cbDetails.courseName;
                break;
            case 'Curriculum':
                name = currDetails.courseName;
                break;
            default:
                console.log(`Sorry, ${courseTypeMod} type does not exist.`);
        }
    }

    cy.get(arCoursesPage.getCoursesActionsButtonsByLabel(`Add ${courseTypeMod}`)).should('have.attr', 'aria-disabled', 'false').should('have.text', `Add ${courseTypeMod}`).click()
    

    //verify the header and InActive toggle 
    if (courseTypeMod == 'Online Course') {
        cy.get(arCBAddEditPage.getCouseGeneralHeader() + ' ' + arCBAddEditPage.getHeaderLabel()).should('have.text', 'General')
    }
    //Verify the Status Toggle button and text box text
     this.generalToggleSwitch('true',ARILCAddEditPage.getGeneralStatusToggleContainerName())
    arCoursesPage.getLShortWait() //wait as the title field can reset if we type too fast

    switch (courseTypeMod) {
        case 'Online Course':
            // Add Course name 
            //cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear().type(name)
            cy.get(arOCAddEditPage.getRequiredInRedColor()).should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
            cy.get(arOCAddEditPage.getGeneralTitleTxtF()).should('have.value', 'Course Name')
            cy.get(arOCAddEditPage.getGeneralTitleTxtF()).clear()
            cy.get(arOCAddEditPage.getErrorMsg()).should('contain', 'Field is required.')
            cy.get(arOCAddEditPage.getGeneralLabels()).children().should(($child) => {
                expect($child).to.contain('Status');
                expect($child).to.contain('Title');
                expect($child).to.contain('Description');
                expect($child).to.contain('Language');
                expect($child).to.contain('Tags');
                //expect($child).to.contain('Automatic Tagging')
            })
            cy.get(arOCAddEditPage.getGeneralTitleTxtF()).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            // Add Description
            //cy.get(arOCAddEditPage.getDescriptionTxtF()).type(ocDetails.description)
            // Add Language
            cy.get(this.getGeneralLanguageDDownSmoke()).click({ force: true })
            cy.get(this.getGeneralLanguageDDownOptSmoke()).contains('English').click()
            //Add Tags
            /*
            cy.get(arOCAddEditPage.getGeneralTagsDDown()).click()
            cy.get(arOCAddEditPage.getElementByAriaLabelAttribute('Tags')).type(`${commonDetails.tagName}`)
            cy.get(arOCAddEditPage.getGeneralTagsDDownOpt()).contains(`${commonDetails.tagName}`).click()
            */
            break;
        case 'Instructor Led':
            //Add title, description, language
            //cy.get(arILCAddEditPage.getGeneralTitleTxtF()).clear().type(name)
            cy.get(arILCAddEditPage.getGeneralTitleTxtF()).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            //cy.get(ARILCAddEditPage.getDescriptionTxtF()).type(ilcDetails.description)
            cy.get(this.getGeneralLanguageDDownSmoke()).click({ force: true })
            cy.get(this.getGeneralLanguageDDownOptSmoke()).contains('English').click()
            if (ilcSession === true) {
                // Add Session to ILC with start date 2 days into the future
                arILCAddEditPage.getAddSession(ilcDetails.sessionName, arILCAddEditPage.getFutureDate(2))
                cy.get(arILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
                // Save Session
                cy.get(arILCAddEditPage.getAddEditSessionSaveBtn()).click()
               
            }
            break
        case 'Course Bundle':
            //Add title, description, language
            //cy.get(arCBAddEditPage.getGeneralTitleTxtF()).clear().type(name)
            cy.get(arCBAddEditPage.getGeneralTitleTxtF()).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            //cy.get(arCBAddEditPage.getDescriptionTxtF()).type(cbDetails.description)
            cy.get(this.getGeneralLanguageDDownSmoke()).click({ force: true })
            cy.get(this.getGeneralLanguageDDownOptSmoke()).contains(cbDetails.language).click()
            // Add Courses to Course Bundle
            cy.get(arCBAddEditPage.getElementByDataNameAttribute(arCBAddEditPage.getAddCoursesBtn())).click()
            break;
        case 'Curriculum':
            arCURRAddEditPage.WaitForElementStateToChange(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF()))
            //cy.get(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF())).clear().type(name)
            cy.get(arCURRAddEditPage.getElementByAriaLabelAttribute(arCURRAddEditPage.getGeneralTitleTxtF())).invoke('val', name.slice(0, -1)).type(name.slice(-1))
            //cy.get(arCURRAddEditPage.getDescriptionTxtF()).type(currDetails.description)
            cy.get(this.getGeneralLanguageDDownSmoke()).click({ force: true })
            cy.get(this.getGeneralLanguageDDownOptSmoke()).contains(currDetails.language).click()
            // Add Courses to Curriculum
            cy.get(arCURRAddEditPage.getAddCoursesBtn()).should('have.attr', 'aria-disabled', 'false').click()
            break;
        default:
            console.log(`Sorry, ${courseTypeMod} type does not exist.`);
        }
    }

    getEditCouseForSmoke(courseName) {
        cy.wrap(this.getAddFilter('Name', 'Contains', courseName))
        //At some point this intercept stopped logging and caused this command to break. It seems to work without it.
        //cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourseFilter').wait('@getCourseFilter')
        arCoursesPage.getShortWait()
        cy.get(this.getTableCellNameSmoke(2)).contains(courseName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(this.getCourseSettingsByNameBannerBtn('More')).should('be.visible')
        arCoursesPage.getMediumWait()
    }

    getAddFilter(propertyName, Operator = null, Value = null) {
        if (Value == null) {
            cy.get(this.getAddFilterBtn()).click();
            cy.get(this.getPropertyNameSmoke() + this.getDDownFieldSmoke()).eq(0).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOptSmoke()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getOperatorSmoke() + this.getDDownFieldSmoke()).click();
            cy.get(this.getOperatorDDownOptSmoke()).contains(Operator).click({ force: true });
            cy.get(this.getSubmitAddFilterBtn()).click();
        } else if (Value != null && Operator == null) {
            cy.get(this.getAddFilterBtn()).click();
            cy.get(this.getPropertyNameSmoke() + this.getDDownFieldSmoke()).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOptSmoke()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).eq(1).type(Value)
            cy.get(this.getSubmitAddFilterBtn()).click();
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        }
        else {
            cy.get(this.getAddFilterBtn()).click();
            cy.get(this.getPropertyNameSmoke() + this.getDDownFieldSmoke()).eq(0).click();
            cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
            cy.get(this.getPropertyNameDDownOptSmoke()).contains(new RegExp("^" + propertyName + "$", "g")).click()
            cy.get(this.getOperatorSmoke() + this.getDDownFieldSmoke()).eq(1).click();
            cy.get(this.getOperatorSearchTxtF()).type(Operator);
            cy.get(this.getOperatorDDownOptSmoke()).contains(Operator).click();
            if (propertyName.includes('Date')) {
                cy.get(this.getElementByAriaLabelAttribute(this.getDateF()) + ' ' + this.getFilterDatePickerBtn()).click()
                this.getSelectDate(Value)
            }
            else {
                cy.get(this.getElementByAriaLabelAttribute(this.getValueTxt())).type(Value)
            }
            cy.get(this.getSubmitAddFilterBtn()).click();
            cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        }
    }

    //this method for create a course
    getGeneralLanguageDDownSmoke() {
        return '[data-name="languageCode"] [class="_select_field_4ffxm_1"]'
    }

    getGeneralLanguageDDownOptSmoke() {
        return '[data-name="languageCode"] [class*="_label_11q4a_62"]'
    }

    getExtensionPriceTxtF() {
        return `[aria-label="Price"]`
    }

    getCourseSettingsByNameBannerBtn(titleText) {
        return `button[title="${titleText}"] > [data-name="icon"]`
 
    }

    getCourseSettingsByNameBtn(titleText) {
        return `button[title="${titleText}"] > [class*="_icon_8vfwm_"]`
        
    }

    getPropertyNameSmoke() {
        return '[data-name="field"]';
    }
    
    //this elements are for getAddFilter method

    getDDownFieldSmoke() {
        return ' [class*="_selection_4ffxm_8"]'
    }

    getPropertyNameDDownOptSmoke() {
        return '[data-name="options"] [role="option"]'
        
    }

    getOperatorSmoke() {
        return '[data-name="field"]'
    }

    getOperatorDDownOptSmoke() {
        return '[class*="_label_11q4a_62"]'
    }

    getTableCellNameSmoke(columnIndex = 2) {
        return `[class*="_grid_row_"] td:nth-of-type(${columnIndex})`
    }

    getMenuItemOptionByName(text) {
        cy.get(this.getMenuItem()).contains(text).click();
    }
 
    getMenuItem() {
        return '[class*="_title"] [data-name="title"]'
    }    

    //AR login page
    getARLoginBtn() {
        return '[class*="_content_4zm37"]'
    }

    getAdminDashboardPageTitle() {
        return '[class*="_content_l"]';
    }

}
