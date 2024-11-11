let queryParams = {
    _limit: "20",
    _offset: "0"

}

describe(" Mandatory Catalog Course Test", () => {
    it("GET - List My mandatory catalog courses", () => {


        cy.getApiSFV2("/my-mandatory-courses", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
        })
    })
})