

let deletedCompetencyID;
let queryParams = {
    filter: "",
    pagingRequest: "",
    sortRequest: ""
}

describe("Competency Definitions Test", () => {

    it('Get Retrieves a page of deleted competency definitions - admin', () => {

        cy.getApiV2("/api/rest/v2/admin/deleted-competency-definitions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)



        })
    })

    it('Get Retrieves a page of deleted competency definitions', () => {

        cy.getApiV2("/api/rest/v2/connected-apps/deleted-competency-definitions", queryParams).then((response) => {
            expect(response.status).to.be.eq(200)
            expect(response.duration).to.be.below(3000)
            deletedCompetencyID = response.body._embedded.deletions[0].id



        })
    })
})