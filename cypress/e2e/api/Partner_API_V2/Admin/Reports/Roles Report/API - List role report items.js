



describe("Roles Report Test", () => {
    it("GET - List role report items", () => {


        cy.getApiSFV2("/admin/reports/roles", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)

        })
    })
})