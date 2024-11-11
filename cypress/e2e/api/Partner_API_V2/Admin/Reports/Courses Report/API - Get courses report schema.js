


describe("Courses Report Test", () => {
    it("GET - Get courses report schema", () => {


        cy.getApiSFV2("/admin/reports/courses/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
        })
    })
})