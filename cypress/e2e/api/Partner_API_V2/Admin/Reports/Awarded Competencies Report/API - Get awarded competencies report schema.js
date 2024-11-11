



describe("Awarded Competencies Test", () => {
    it("GET - Get awarded competencies report schema", () => {


        cy.getApiSFV2("/admin/reports/awarded-competencies/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)

        })
    })
})