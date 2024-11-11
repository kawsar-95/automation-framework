

let queryParams = {
    _limit: "20",
    _offset: "0"

}

describe("Catalog Course Test", () => {
    it("GET - List tags on My catalog courses", () => {


        cy.getApiSFV2("/my-catalog/tags", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
        })
    })
})