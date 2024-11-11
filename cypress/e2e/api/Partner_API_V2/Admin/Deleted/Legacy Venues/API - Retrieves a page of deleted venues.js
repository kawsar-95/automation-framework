


describe("Legacy Venues Test", () => {
    it("GET - Retrieves a page of deleted venues", () => {


        cy.getApiSFV2("/admin/deleted-venues", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})