



describe("Tags Report Test", () => {
    it("GET - Schema", () => {


        cy.getApiSFV2("/admin/reports/tags/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})