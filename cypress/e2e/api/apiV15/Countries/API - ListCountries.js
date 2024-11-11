
let countryId;

describe("API - Countries Test", () => {

    it("GET - List Countries", () => {
        cy.getApiV15("/countries", null).then((response) => {
            expect(response.status).to.be.eq(200)
            countryId = response.body[0].id
       })
    })
    it("GET - Country", () => {
        cy.getApiV15("/countries/" + countryId, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.body.id).to.include(countryId)
            expect(response.body.countryCode).to.include("US")
                    })
            
    })
})