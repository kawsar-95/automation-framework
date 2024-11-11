




describe("API - Online Course Test", () => {
    it("GET - List Courses", () => {
        cy.getApiV15("/courses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2000)

        })
    })
})
