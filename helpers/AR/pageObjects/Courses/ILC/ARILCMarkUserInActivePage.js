
import ARBasePage from "../../../ARBasePage"

export default new class ARILCEditActivityPage extends ARBasePage {


  getSearchTxtF() {
    return 'input[aria-label="Search"]';
  }
  getFirstSelectOpt() {
    return '[class] [role="tree"]:nth-of-type(1) [class*="hierarchy-node-module__label"]'
  }

  getUsersMenuLevel() {
    return "#submenu-users > li > a"
  }
  getResultSessionMenu() {
    return "#submenu-reports > li.coursesession.submenu-item > a"
  }
  getUserSubMenuLevel() {
    return '#submenu-users > li.users.submenu-item > a'
  }
  getInActiveToggelBtn() {
    return "div[class*='h_1m7'] span[class='toggle-module__label--ZuNLX']"
  }
  getUserTranscriptByUsername(username) {
    cy.wrap(this.AddFilter('Username', 'Contains', username))
    this.getShortWait()
    cy.get(this.getTableCellName(4)).contains(username).click()
    cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('User Transcript'), 1000))
    cy.get(this.getAddEditMenuActionsByName('User Transcript')).click()
    cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')
  }
  getInActiveUser() {
    cy.get(this.getInActiveToggelBtn()).contains('Inactive').click()
  }
  getA5PropertyNameDDown() {
    return `[class="property-select-dropdown"]`
  }
  getA5OperatorDDown() {
    return `[class="operator-select"] > select`
  }
  getA5ValueTxtF() {
    return `.value-select [type]`
  }
  getA5SubmitAddFilterBtn() {
    return `.full-width.margin-bottom-10 > span:nth-of-type(2)`
  }
  verifyLearnerInMarkAttendance(name) {
    cy.get(this.getA5TableCellRecord()).filter(`:contains(${name})`)
  }
  getVerifyHeader() {
    return '#page-content>div>h1'
  }
  getMarkAttendanceHeader() {
    return "div[id='edit-content'] div[class='section-title']"
  }
  getResultManu() {
    return ".icon.icon-reports-30px"
  }
  getUserLeftMenuOption() {
    return '.icon.icon-people-30px'
  }
  getMarkAsRadioBtn() {
    return '[aria-label="Mark As"] :nth-child(3)'
  }
  getCheckBoxForLearner() {
    return 'tr:nth-child(1) > th:nth-child(2) > div > span.icon.icon-box'
  }
  getCheckBoxForLearnerChecked() {
    return 'tr:nth-child(1) > th:nth-child(2) > div > span.icon.icon-box-check'
  }
  getCheckBoxForRLearner() {
    return 'tr:nth-child(1) > th:nth-child(3) > div > span.icon.icon-box'
  }
  getCheckBoxForOneLearnerAndClick(row = 1) {
    // return `tr:nth-child(${row}) > td:nth-child(${column}) > div > span.icon.icon-box`
    cy.get('tbody > tr').eq(row).within(() => {
      cy.get('td').eq(1).click()
    })
  }
  getCertificateImageIcon() {
    return "[data-name='certificate-link-wrapper'] [class*='certificate_image']"
  }
  getCertificateImgCourseName() {
    return '[data-name="Completions"] [href] [data-name="course-name"]'
  }
  getEnrollAndCompletionDate() {
    cy.get("table[class*='course-enrollments']>tbody>tr>td:nth-child(6)").then(($clm) => {
      const text1 = $clm.text()
      cy.get("table[class*='course-enrollments']>tbody>tr>td:nth-child(5)").should(($clm2) => {
        const text2 = $clm2.text()
        expect(text2).not.to.eq(text1)
      })
    })
  }
  //Use when enrolling users into multiple ILC courses & sessions at once
  getSelectILCSessionWithinCourse(courseName, sessionName) {
    cy.get('[class*="_name_8z5wt_28"]').contains(courseName).parents('[class*="_enroll_course_item_8z5wt_1 _course_187rr_44"]').within(() => {
      cy.get('[class*="_field_7teu8_9 select_field"]').click()
      cy.get('input[data-name="input"]').type(sessionName)
      cy.get('[class*="_option_1mq8e_10"]').contains(sessionName).click() //use regex for exact match
    })
  }

    //Use when enrolling users into multiple ILC courses & sessions at once diff Xpath
    getSelectILCSessionWithinCourseAtt(courseName, sessionName) {
      cy.get('[class*="_name_8z5wt_28"]').contains(courseName).parents('[class*="_enroll_course_item_8z5wt_1 _course_187rr_44"]').within(() => {
        cy.get('[class*="_field_7teu8_9"]').click()
        cy.get('input[data-name="input"]').type(sessionName)
        cy.get('[class*="_option_1mq8e_10"]').contains(sessionName).click() //use regex for exact match
      })
    }

  getCheckBoxForAbsent() {
    return '[data-bind*="AllCourseAbsent"]'
  }

  getScoreCreditTxtF() {
    return 'td[class="text-left padding-10"] > div > input'
  }

  getMassActionToggle() {
    return '[class="katana-toggle"]'
  }
  getMassActionMarkAs(state) {
    let n = 1
    if (state === 'Completed') n = 2
    else if (state === 'Absent') n = 3
    return `a[class="radio-option"]:nth-of-type(${n})`
  }

  getOverallGradeStatusToggle() {
    return '[title*="All Learners Overall Grade"]'
  }

  setLearnerPresentAbsentStatus(status) {
    cy.get('thead tr [data-name="mark-attendance-toggle"]').eq(0).invoke('attr', 'title').then((value) => {
      if(value.includes(status)){
        expect(value).to.include(status)
      }
      else {
        cy.get('thead tr [data-name="mark-attendance-toggle"]').eq(0).click()
      }
    })
  }

  setOneLearnerPresentAbsentStatus(status, row = 0) {
    cy.get('tbody tr').eq(row).find('[data-name="mark-attendance-toggle"]').eq(0).invoke('attr', 'title').then((value) => {
      if(value.includes(status)){
        expect(value).to.include(status)
      }
      else {
        cy.get('tbody tr').eq(row).find('[data-name="mark-attendance-toggle"]').eq(0).click()
      }
    })
  }

  setOneLearnerOverallGradeStatus(status, row = 1) {
    cy.get('[title*="Overall Grade"]').eq(row).invoke('attr', 'title').then((value) => {
      if(value.includes(status)){
        expect(value).to.include(status)
      }
      else {
        cy.get('[title*="Overall Grade"]').eq(row).click()
      }
    })
  }
}