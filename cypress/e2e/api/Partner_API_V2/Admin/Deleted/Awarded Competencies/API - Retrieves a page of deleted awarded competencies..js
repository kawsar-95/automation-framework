


describe("Awarded Competency Test", () => {
    it("GET - Retrieves a page of deleted awarded competencies.", () => {


        cy.getApiSFV2("/admin/deleted-awarded-competencies", null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            
        })
    })
})