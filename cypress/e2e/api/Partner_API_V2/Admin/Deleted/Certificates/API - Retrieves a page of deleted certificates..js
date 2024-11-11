


describe("Certificates Test", () => {
    it("GET - Retrieves a page of deleted certificates.", () => {


        cy.getApiSFV2("/admin/deleted-certificates", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})