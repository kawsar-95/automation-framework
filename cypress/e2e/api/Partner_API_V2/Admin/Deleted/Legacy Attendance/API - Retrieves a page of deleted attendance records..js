


describe("Legacy Attendance Test", () => {
    it("GET - Retrieves a page of deleted attendance records.", () => {


        cy.getApiSFV2("/admin/deleted-attendance", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})