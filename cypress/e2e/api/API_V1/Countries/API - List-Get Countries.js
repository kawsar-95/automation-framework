
let countryId;

describe("API - Countries Test", () => {

    it("GET - List Countries", () => {
        cy.getApiV15("/countries", null).then((response) => {
            expect(response.status).to.be.eq(200)
            countryId = response.body[0].Id
       })
    })
    it("GET - Country", () => {
        cy.getApiV15("/countries/" + countryId, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.Id).to.include(countryId)
            expect(response.body.CountryCode).to.include("US")})
            
    })
})