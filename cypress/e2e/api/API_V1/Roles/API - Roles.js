
let roleName;

describe("API -  Roles Test", () => {
    it("GET - Lists all available roles.", () => {
        cy.getApiV15("/roles", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            roleName = response.body.some(item => item.Name === roleName)
            expect(roleName).to.not.be.undefined
        })
    })
})