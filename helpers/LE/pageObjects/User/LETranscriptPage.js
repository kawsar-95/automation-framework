import leBasePage from '../../LEBasePage'

export default new class LETranscriptPage extends leBasePage {

    getTranscriptPageTitle() {
        return `[class*="transcript-module__banner_title"]`;
    }

    getUsername() {
        return `[data-name="username"]`;
    }

    getEmail() {
        return `[data-name*="email"]`;
    }

    getDepartment() {
        return `[data-name*="department"]`;
    }

    getTotalCredits() {
        return `[data-name="credits"]`;
    }

    getPrintTranscriptBtn() {
        return `[class*="transcript-module__print_btn"]`;
    }

    getCreditsItem() {
        return `[class*="transcript-module__credits_item"]`;
    }

    getCreditTotal() {
        return `[class*="transcript-module__credits_total"]`;
    }

    getCourseContainer() {
        return '[data-name="sortable-table"]'
    }

    getCourseTitleCol() {
        return `[class*="course-enrollments-table-module__course_title"]`;
    }

    getStatusCol() {
        return `[class*="transcript-module__enrollments_status_col"]`;
    }

    getEnrollmentDateCol() {
        return `[class*="transcript-module__enrollments_enrollement_date_col"]`;
    }

    getCompletionDateCol() {
        return `[class*="transcript-module__enrollments_completion_date_col"]`;
    }

    getCreditsCol() {
        return `[class*="table-module__enrollments_credits_col"]`;
    }

    getCreditItem() {
        return `[class*="transcript-credits-cell-module__enrollment_credits_cell_item__"]`;
    }

    getViewBtn() {
        return `[class*="action-button-module__title___Vtjlw"]`
    }

    //Pass the course name to verify the certificate & download button for it exists
    getCertificateByCourseName(name) {
        cy.get(`[data-name="sortable-table"]`).eq(0).within(() => {
            cy.get(`[class*="table-row-cell-module__table"]`).contains(name).parents(`[class*="table-row-module"]`).within(() => {
                cy.get(`[data-name="href-button"]`).should('be.visible')
            })
        })
    }


    //Pass the competency name to verify the competency & earned date for it exists
    getCompetencyByCompetencyName(CompetencyName) {
        cy.get(`[class*="transcript-module__competencies"]`).within(() => {
            cy.get(`[class*="transcript-module__competencies_name_col"]`).contains(CompetencyName).parents(`[class*="table-row-module"]`).within(() => {
                cy.get(`[class*="transcript-module__datetime"]`).should('be.visible')
            })
        })
    }


    //Pass the course name and expected status to verify
    getCourseCompletionStatusByCourseName(name, status) {
        cy.get(`[data-name="course-enrollments-table"]`).within(() => {
            cy.get(this.getCourseTitleCol()).contains(name).parents(`[role="rowgroup"]`).within(() => {
                cy.get(`[class*="status-chip-module__chip"]`).should('contain.text', status)
            })
        })
    }

    getCourseNameCellInTranscriptTable() {
        return 'div[data-name="table-row-cell"]'
    }

    getExternalTrainingSection() {
        return 'div[class*="external-training-submissions-table-module"]'
    }

    getExternalTrainingTableHeader() {
        return `${this.getExternalTrainingSection()} [data-name="sortable-column-header"]`
    }

    getExternalTrainingCourseNames() {
        return 'div[class*="external-training-submissions-table-module"] div[data-name="table-row-cell"] div:nth-of-type(2)'
    }

    getExternalTrainingStatusLabel() {
        return 'div[class*="external-training-submissions-table-module__chip"]'
    }
}
