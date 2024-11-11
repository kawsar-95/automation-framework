


describe("Competencies Test", () => {
    it("GET - Get competencies report schema", () => {


        cy.getApiSFV2("/admin/reports/competencies/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)

        })
    })
})