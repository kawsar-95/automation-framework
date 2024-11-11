
describe("API - Coupons Test", () => {

    it("GET - List All Available Coupons", () => {
        cy.getApiV15("/coupons", null).then((response) => {
            expect(response.status).to.be.eq(200)
            
       })
    })
   
})