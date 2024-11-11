import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc);
dayjs.extend(timezone);

export default class BasePage {

    getElementByDataNameAttribute(attrValue) {
        return `[data-name="${attrValue}"]`
    }

    getElementByDataTabAttribute(attrValue) {
        return `[data-tab="${attrValue}"]`
    }

    getElementByDataNameAttributeAndIndex(attrValue, index) {
        return `[data-name="${attrValue}-${index}"]`
    }

    getElementByPartialDataNameAttribute(attrValue) {
        return `[data-name*="${attrValue}"]`
    }

    getElementByAriaLabelAttribute(attrValue) {
        return `[aria-label="${attrValue}"]`
    }

    getElementByPartialAriaLabelAttribute(attrValue) {
        return `[aria-label*="${attrValue}"]`
    }

    getElementByNameAttribute(attrValue) {
        return `[name="${attrValue}"]`
    }

    getElementByPartialNameAttribute(attrValue) {
        return `[name*="${attrValue}"]`
    }
    getElementByTitleAttribute(attrValue) {
        return `[title="${attrValue}"]`
    }

    getElementByPartialTitleAttribute(attrValue) {
        return `[title*="${attrValue}"]`
    }

    getElementByPlaceholderAttribute(attrValue) {
        return `[placeholder*="${attrValue}"]`
    }

    getTimeStamp() {
        return new dayjs().format();
    }

    getETTimeStamp() {
        let datetime = dayjs.tz(new dayjs(), "America/New_York");
        return datetime.format();
    }

    //Common Elements shared by the entire LMS

    // Common button icons (use with data-name or inside a within() function)

    getBtn() {
        return '[type="button"]'
    }

    getPencilBtn() {
        return '[class*="icon icon-pencil"]'
    }

    getXBtn() {
        return '[class*="icon icon-x"]'
    }

    getRemoveAllBtn() {
        return "button[aria-label='Remove All']"
    }

    getTrashBtn() {
        return '[class*="icon icon-trash"]'
    }

    getActionDeselectButtonLabel() {
        return '[class="_button_4zm37_1 _cancel_4zm37_86 _deselect_button_1thd6_1"]'
    }

    //Returns general WSIWYG Text box
    getWSIWYGTxtF() {
        return '[class*="fr-element fr-view"]'
    }

    getGripBtn() {
        return '[class*="icon icon-grip"]'
    }

    //Adds desired number of days (or other unit ex. 'month') to the current date and returns a formatted timestamp
    //Add second num and type to combine units of time
    //See https://day.js.org/docs/en/manipulate/add for available units
    getFutureDate(num, type = 'day', num2, type2) {
        let futureDate;
        if (num2 != undefined) {
            futureDate = String(dayjs(dayjs(this.getTimeStamp()).add(num, type).add(num2, type2)).format()).slice(0, 10);
        } else {
            futureDate = String(dayjs(dayjs(this.getTimeStamp()).add(num, type)).format()).slice(0, 10);
        }
        return futureDate;
    }

    //Subtracts desired number of days to the current date and returns a formatted timestamp
    getPastDate(num) {
        let pastDate = String(dayjs(dayjs(this.getTimeStamp()).subtract(num, 'day')).format()).slice(0, 10);
        return pastDate;
    }

    /**
     * Pass in a timestamp with YYYY-MM-DD format (ex. '2021-10-08') and the desired output format string (ex. 'dddd, MMMM DD'). 
     * See https://day.js.org/docs/en/display/format for formatting reference.
     * @param {String} date 
     * @param {String} format 
     */
    getFormattedDateString(date, format) {
        let formattedDate = dayjs(date).format(format);
        return formattedDate;
    }

    getAppendText() {
        return "-edited";
    }

    getDuplicateText() {
        return "-duplicate";
    }

    getCopyText() {
        return " - Copy"
    }

    getVShortWait() {
        cy.wait(500);
    }

    getShortWait() {
        cy.wait(1000);
    }

    getLShortWait() {
        cy.wait(2000);
    }

    getMediumWait() {
        cy.wait(3000)
    }

    getLongWait() {
        cy.wait(5000)
    }

    getVLongWait() {
        cy.wait(7500)
    }

    getHFJobWait() { //use for waiting for Hangfire event 
        cy.wait(20000)
    }

    getDomainEventsWait() { //use for domain events checking i.e. generate report status etc
        return 30000;
    }

    getGeneratedReportsWait() {
        return 60000;
    }

    //Creates a long string (256 char by default) to test max characters in fields - pass number of characters you want in the string
    getLongString(num = 256) {
        let longString = 'a'.repeat(num);
        return longString;
    }

    //Allows you to transform an array by swapping items within it
    transformArray(array, fromIndex, toIndex) {
        let element = array[fromIndex];
        array.splice(fromIndex, 1);
        array.splice(toIndex, 0, element);
    }

    getFileInput() {
        return 'input[type="file"]';
    }


    //------------------- For Rich Text Editor -------------------//

    //Pass the rich text editor label to right align the text after it has been selected (note cy.type('{selectall}') can be used to highlight text within the editor)
    getRightAlignBtnByLabelThenClick(label) {
        cy.get('[class*="fr-box Component-editor"]').parents('[class*="_form_control"]')
            .contains(label).parents('[class*="_form_control"]').within(() => {
                cy.get(`div[role='application'] > .fr-basic.fr-desktop.fr-toolbar.fr-top > div:nth-of-type(2) > button:nth-of-type(1) > .fr-svg`).click()
                cy.get(`div:nth-of-type(2) .fr-basic.fr-desktop.fr-toolbar.fr-top > div:nth-of-type(2) > div[role='listbox'] > div[role='presentation']  ul[role='presentation'] > li:nth-of-type(3) > a[role='option']  path`).click()
            })
    }

    //Pass the rich text editor label to bold the text after it has been selected (note cy.type('{selectall}') can be used to highlight text within the editor)
    // using .type({ctrl}+{b}) on selected text will also work, but only in chrome and edge - not in firefox
    getBoldBtnByLabelThenClick(label) {
        cy.get('[class*="fr-box Component-editor"]').parents('[class*="_form_control"]')
            .contains(label).parents('[class*="_form_control"]').within(() => {
                cy.get(`div:nth-of-type(2) .fr-basic.fr-desktop.fr-toolbar.fr-top > div:nth-of-type(1) > button:nth-of-type(1) > .fr-svg`).click()
            })
    }

    //Pass the rich text editor label to underline the text after it has been selected (note cy.type('{selectall}') can be used to highlight text within the editor)
    getUnderlineBtnByLabelThenClick(label) {
        cy.get('[class*="fr-box Component-editor"]').parents('[class*="_form_control"]')
            .contains(label).parents('[class*="_form_control"]').within(() => {
                cy.get(`div:nth-of-type(2) .fr-basic.fr-desktop.fr-toolbar.fr-top > div:nth-of-type(1) > button:nth-of-type(3) > .fr-svg`).click()
            })
    }

    //Opens the File Upload Modal
    getInsertImageViaFile() {
        cy.get('[class*="fr-box Component-editor"]').within(() => {
            cy.get(`button#insertImage-1 > .fr-svg`).click()
            cy.get(`button#imageUploadCustom-1  path`).click()
        })
    }

    //These are the menu options within ellipses overflow 'dropdowns'. eg. Learner Unenroll and Flag Collaboration Post
    getOverflowMenuBtn() {
        return `[class*="course-options-menu-module__btn"]`
    }
    getOverflowMenuOptThenClick(text) {
        cy.get(`[class*="overflow-menu-button"]`).contains(`${text}`).click()
    }

    capitalizeString(txtString) {
        // Split text
        const txtSplit = txtString.split(' ');
        // convert array of string to lowercase
        const lowerCased = txtSplit.map(elem => elem.toLowerCase());
        // Capitalize first Letter of a String
        const firstLetterUpperCased = lowerCased.map(elem => elem.charAt(0).toUpperCase() + elem.toLowerCase().slice(1) + " ")
        // convert array to String
        const formattedTxt = (firstLetterUpperCased.toString()).replace(',', '');
        return formattedTxt.trim()
    }
    waitUntilLoadingStops(loader) {
        cy.waitUntil(() => {
            return cy.get(loader).should('not.be.visible')
        }, {
            errorMsg: "was expeting loader to be gone",
            timeout: 60000,
            interval: 500
        })
    }
    getInputFileTxtF() {
        return 'input[type="file"]'
    }

    getTableDataCell() {
        return 'tr > td'
    }
}

