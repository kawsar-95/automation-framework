



let awardCompetencyID;
let competencyDefinitionID;



describe("Awarded Competencies Test", () => {
    it("GET - List awarded competencies report items", () => {


        cy.getApiSFV2("/admin/reports/awarded-competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            awardCompetencyID = response.body.competencies[0].id
            competencyDefinitionID = response.body.competencies[0].competencyDefinitionId

        })
    })
})