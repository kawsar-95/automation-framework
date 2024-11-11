



describe("Courses Report Test", () => {
    it("GET - List course report items", () => {


        cy.getApiSFV2("/admin/reports/courses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
        })
    })
})