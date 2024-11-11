


let competencyDefinitionID;

describe("Competencies Test", () => {

    before("Get Competency Definition ID", () => {


        cy.getApiSFV2("/admin/reports/awarded-competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            competencyDefinitionID = response.body.competencies[0].competencyDefinitionId

        })
    })
    it("GET - List competency report items", () => {


        cy.getApiSFV2("/admin/reports/competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.competencies[0].id).to.equal(competencyDefinitionID)

        })
    })
})