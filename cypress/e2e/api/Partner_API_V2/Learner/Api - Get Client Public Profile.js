

describe("Public Profile Test", () => {

    it("GET - Client-public profiles", () => {
        cy.getApiSFV2("/profiles/client-public", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
        })
    })
    


})