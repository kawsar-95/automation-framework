describe("Billboards Test", () => {

    it("GET - List My Billboards", () => {
        cy.getApiSFV2("/my-billboard-tiles/a1052d6a-43a3-4a3c-898f-db47fd127755/billboards", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
        })
    })
    it("GET - My Billboard", () => {
        cy.getApiSFV2("/my-billboards/a1052d6a-43a3-4a3c-898f-db47fd127756", null).then((response) => {
            expect(response.status).to.be.eq(404)
            expect(response.duration).to.be.below(3000)
        })
    })
    


})