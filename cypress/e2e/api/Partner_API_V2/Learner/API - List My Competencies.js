


describe("Competencies Test", () => {

    let competencyID;
    let queryParams = {
        _limit: "20",
        _offset: "0"
    }
    it("GET - List my competencies", () => {
        cy.getApiSFV2("/my-competencies", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            competencyID = response.body._embedded.competencies[0].id
        })
    })

    it("GET - my competency", () => {
        cy.getApiSFV2("/my-competencies/" + competencyID, null).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(2500)
            expect(response.body.id).to.equal(competencyID)

        })
    })
})