




describe("API - Credit Types Test", () => {
    it("GET - List Credit types", () => {
        cy.getApiV15("/credits/credit-types", null).then((response) => {
         expect(response.status).to.be.eq(200)
         expect(response.duration).to.be.below(2500)
         expect(response.body[0]).to.haveOwnProperty("Name", "General")
            
       })
    })
})
