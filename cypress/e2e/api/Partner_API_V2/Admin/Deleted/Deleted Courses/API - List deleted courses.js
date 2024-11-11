

describe("Deleted Courses Test", () => {
    it("GET - List deleted courses", () => {


        cy.getApiSFV2("/admin/deleted-courses", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})