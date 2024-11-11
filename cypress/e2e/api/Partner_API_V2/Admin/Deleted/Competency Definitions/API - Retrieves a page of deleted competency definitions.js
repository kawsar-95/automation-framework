

describe("Competency Definitions Test", () => {
    it("GET - Retrieves a page of deleted competency definitions", () => {


        cy.getApiSFV2("/admin/deleted-competency-definitions", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})