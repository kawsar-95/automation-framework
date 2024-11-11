



describe("Users Test", () => {
    it("GET - List Users", () => {


        cy.getApiSFV2("/admin/users", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})