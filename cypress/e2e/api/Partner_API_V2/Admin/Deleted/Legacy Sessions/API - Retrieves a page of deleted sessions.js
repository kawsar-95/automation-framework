


describe("Legacy Sessions Test", () => {
    it("GET - Retrieves a page of deleted sessions", () => {


        cy.getApiSFV2("/admin/deleted-instructor-led-course-sessions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})