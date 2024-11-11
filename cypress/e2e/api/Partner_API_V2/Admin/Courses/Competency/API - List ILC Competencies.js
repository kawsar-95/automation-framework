


let ilcID;
let ilcCompetencyDefinitionID;

describe("Competency Test", () => {
    it("GET - ILC ID", () => {


        cy.getApiSFV2("/admin/reports/instructor-led-course-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcID = response.body.instructorLedCourseActivities[0].courseId
           

        })
    })

    it("GET - List ILC competencies", () => {


        cy.getApiSFV2("/admin/instructor-led-courses/" + ilcID + "/competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            ilcCompetencyDefinitionID = response.body.competencies[0].competencyDefinitionId

        })
    })
})