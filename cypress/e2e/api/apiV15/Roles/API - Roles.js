
let hasSystemAdmin;

describe("API -  Roles Test", () => {
    it("GET - Lists all available roles.", () => {
        cy.getApiV15("/roles", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            hasSystemAdmin = response.body.roles.some(role => role.name === "System Admin")
            expect(hasSystemAdmin).to.be.true
        })
    })
})