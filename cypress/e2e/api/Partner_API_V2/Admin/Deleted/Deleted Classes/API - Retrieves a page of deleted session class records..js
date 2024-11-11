


describe("Deleted Classes Test", () => {
    it("GET - Retrieves a page of deleted session class records.", () => {


        cy.getApiSFV2("/admin/deleted-classes", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})