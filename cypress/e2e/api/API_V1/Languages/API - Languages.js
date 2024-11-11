
let languageID;

describe("API - Languages Test", () => {
    it("GET - Languages.", () => {
        cy.getApiV15("/languages", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            languageID = response.body[0].Id
        })
    })
    it("GET - Language.", () => {
        cy.getApiV15("/languages/" + languageID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Name).to.equal("English")
        })
    })
})