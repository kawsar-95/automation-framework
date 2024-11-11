
let groupID;

describe("API - Groups Test", () => {
    it("GET - Groups.", () => {
        cy.getApiV15("/groups", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            groupID = response.body.groups[0].id
        })
    })
    it("GET - Group.", () => {
        cy.getApiV15("/groups/" + groupID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.include(groupID)
        })
    })
})