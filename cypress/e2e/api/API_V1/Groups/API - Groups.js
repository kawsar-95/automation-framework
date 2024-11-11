
let groupID;

describe("API - Groups Test", () => {
    it("GET - Groups.", () => {
        cy.getApiV15("/groups", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            groupID = response.body[0].Id
        })
    })
    it("GET - Group.", () => {
        cy.getApiV15("/groups/" + groupID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.Id).to.include(groupID)
        })
    })
})