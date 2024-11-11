

describe(" Online Course Import Test", () => {
    it("GET - List OC Imports", () => {

        cy.getApiV2("/api/rest/v2/admin/online-course-imports", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)


        })
    })
})
