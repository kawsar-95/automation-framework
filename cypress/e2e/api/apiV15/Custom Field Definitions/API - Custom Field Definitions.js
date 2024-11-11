



describe("API -  Custom Field Definitions Test", () => {
    it("GET -  Get Custom Field Definitions.", () => {
        cy.getApiV15("/customfielddefinitions", null ).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })
})