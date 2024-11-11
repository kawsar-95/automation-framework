

describe(" Create Roles Test", () => {
    it("GET - List Absorb Create Roles", () => {

        cy.getApiV2("/api/rest/v2/admin/create/roles", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})
