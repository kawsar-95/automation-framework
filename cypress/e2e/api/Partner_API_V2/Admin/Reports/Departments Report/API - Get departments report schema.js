


describe("Departments Report Test", () => {
    it("GET - Get departments report schema", () => {


        cy.getApiSFV2("/admin/reports/departments/schema", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            

        })
    })
})