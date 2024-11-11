let queryParams = {
    _limit: "20",
    _offset: "0"

}

describe("Resumable Catalog Course Test", () => {
    it("GET - List My resumable catalog courses", () => {


        cy.getApiSFV2("/my-resumable-courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
        })
    })
})