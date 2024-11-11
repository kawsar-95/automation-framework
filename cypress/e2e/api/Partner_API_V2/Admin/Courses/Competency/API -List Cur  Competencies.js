



let curriculumID;
let curriculaCompetencyDefinitionID;

describe("Competency Test", () => {
    it("GET - Get Curriculum ID", () => {


        cy.getApiSFV2("/admin/reports/curriculum-activities", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            curriculumID = response.body.curriculumActivities[0].curriculumId


        })
    })

    it("GET - List course competencies", () => {


        cy.getApiSFV2("/admin/curricula/" + curriculumID + "/competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            curriculaCompetencyDefinitionID = response.body.competencies[0].competencyDefinitionId

        })
    })
})