

describe("API - OAuth Test", () => {
    it("GET - Request Authorization Code", () => {
        cy.getApiV15("/oauth/authorize", null).then((response) => {
            expect(response.status).to.be.eq(403)
            expect(response.duration).to.be.below(2000)
        })
    })
    it("POST - Get Refresh Token / Access Token", () => {
        cy.postApiV15(null, null, "/oauth/token").then((response) => {
            expect(response.status).to.be.eq(400)
            expect(response.duration).to.be.below(2000)
            expect(response.body.error_description).to.equal("Client credentials are missing.")
        })
    })
})