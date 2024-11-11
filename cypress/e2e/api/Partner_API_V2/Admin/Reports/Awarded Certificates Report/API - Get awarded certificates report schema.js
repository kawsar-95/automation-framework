



describe("Awarded Certificates Test", () => {
    it("GET - Get awarded certificates report schema", () => {


        cy.getApiSFV2("/admin/reports/awarded-certificates/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})