

let queryParams = {
    fromDeletedDateUtc: "2023-08-01T21:09:00"
}

describe("Legacy Enrollments Test", () => {
    it("GET - GET deleted course enrollments", () => {


        cy.getApiSFV2("/admin/deleted-course-enrollments", queryParams ).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})