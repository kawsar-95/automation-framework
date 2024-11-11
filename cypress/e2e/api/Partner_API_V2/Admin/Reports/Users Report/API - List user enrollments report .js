



describe("Users Report Test", () => {
    it("GET - List user enrollments report", () => {


        cy.getApiSFV2("/admin/reports/user-enrollments", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            expect(response.body.userEnrollments[0]).to.have.property("userId")


        })
    })
})